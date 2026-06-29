import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Readable join code, e.g. "TEAM-7K9X2" (no ambiguous chars).
function makeJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "TEAM-";
  for (let i = 0; i < 5; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

async function uniqueJoinCode(supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = makeJoinCode();
    const { data } = await supabase.from("licenses").select("id").eq("join_code", code).maybeSingle();
    if (!data) return code;
  }
  return makeJoinCode() + Date.now().toString(36).slice(-3).toUpperCase();
}

// POST /api/webhooks/stripe - handle Stripe webhook events
export async function POST(request: Request) {
  const stripe = getStripe();
  const supabase = getSupabaseAdmin();
  if (!stripe || !supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { courseId, tier, seats, clerkUserId } = session.metadata || {};

    if (!courseId || !seats) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const email = session.customer_details?.email || "";
    const fullName = session.customer_details?.name || "";
    const subId = session.subscription?.toString() || session.id;

    // Idempotency: Stripe retries webhooks. One licence per checkout.
    const { data: existing } = await supabase
      .from("licenses")
      .select("id")
      .eq("stripe_subscription_id", subId)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ received: true });
    }

    // If the buyer checked out signed in, resolve/create their user row.
    let user: { id: string; org_id: string | null } | null = null;
    if (clerkUserId) {
      const { data: u } = await supabase
        .from("users")
        .select("id, org_id")
        .eq("clerk_user_id", clerkUserId)
        .single();
      if (u) {
        user = u;
      } else {
        const { data: nu } = await supabase
          .from("users")
          .insert({ clerk_user_id: clerkUserId, email, full_name: fullName, role: "admin" })
          .select("id, org_id")
          .single();
        user = nu;
      }
    }

    // Reuse the buyer's org if they have one, otherwise create the org.
    let orgId = user?.org_id || null;
    if (!orgId) {
      const { data: org } = await supabase
        .from("organizations")
        .insert({ name: fullName || email || "Organisation", stripe_customer_id: session.customer?.toString() })
        .select("id")
        .single();
      orgId = org?.id || null;
    }
    if (user && orgId && !user.org_id) {
      await supabase.from("users").update({ org_id: orgId, role: "admin" }).eq("id", user.id);
    }

    const joinCode = await uniqueJoinCode(supabase);

    // Create the licence. Seats start UNUSED — the buyer distributes them via the
    // join code (the buyer is admin but is not auto-enrolled as a learner).
    const { data: license } = await supabase
      .from("licenses")
      .insert({
        org_id: orgId,
        course_id: courseId,
        total_seats: parseInt(seats),
        used_seats: 0,
        stripe_subscription_id: subId,
        status: "active",
        join_code: joinCode,
        buyer_email: email,
      })
      .select("id")
      .single();

    // An Individual plan bought while signed in: enrol the buyer in their own
    // single seat (they are clearly the learner). Team/Business never auto-enrol.
    if (user && orgId && license && tier === "individual") {
      await supabase.from("enrollments").upsert(
        { user_id: user.id, license_id: license.id, course_id: courseId, status: "active" },
        { onConflict: "user_id,course_id" }
      );
      await supabase.from("licenses").update({ used_seats: 1 }).eq("id", license.id);
      await supabase.from("user_progress").upsert({ user_id: user.id }, { onConflict: "user_id" });
    }
  }

  return NextResponse.json({ received: true });
}
