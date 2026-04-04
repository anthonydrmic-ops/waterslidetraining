import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

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
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { courseId, tier, seats, clerkUserId } = session.metadata || {};

    if (!courseId || !seats || !clerkUserId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    // Find or create user
    let { data: user } = await supabase
      .from("users")
      .select("id, org_id")
      .eq("clerk_user_id", clerkUserId)
      .single();

    if (!user) {
      const { data: newUser } = await supabase
        .from("users")
        .insert({
          clerk_user_id: clerkUserId,
          email: session.customer_details?.email || "",
          full_name: session.customer_details?.name || "",
          role: "admin",
        })
        .select("id, org_id")
        .single();
      user = newUser;
    }

    if (!user) {
      return NextResponse.json({ error: "Failed to resolve user" }, { status: 500 });
    }

    // Create or use org
    let orgId = user.org_id;
    if (!orgId) {
      const { data: org } = await supabase
        .from("organizations")
        .insert({
          name: session.customer_details?.name || "Organization",
          stripe_customer_id: session.customer?.toString(),
        })
        .select("id")
        .single();

      if (org) {
        orgId = org.id;
        await supabase
          .from("users")
          .update({ org_id: orgId, role: "admin" })
          .eq("id", user.id);
      }
    }

    // Create license
    await supabase.from("licenses").insert({
      org_id: orgId,
      course_id: courseId,
      total_seats: parseInt(seats),
      used_seats: 1, // purchaser auto-enrolled
      stripe_subscription_id: session.subscription?.toString() || session.id,
      status: "active",
    });

    // Auto-enroll the purchaser
    const { data: license } = await supabase
      .from("licenses")
      .select("id")
      .eq("org_id", orgId)
      .eq("course_id", courseId)
      .order("purchased_at", { ascending: false })
      .limit(1)
      .single();

    if (license) {
      await supabase.from("enrollments").upsert({
        user_id: user.id,
        license_id: license.id,
        course_id: courseId,
        status: "active",
      }, { onConflict: "user_id,course_id" });
    }

    // Create empty progress record
    await supabase.from("user_progress").upsert({
      user_id: user.id,
    }, { onConflict: "user_id" });
  }

  return NextResponse.json({ received: true });
}
