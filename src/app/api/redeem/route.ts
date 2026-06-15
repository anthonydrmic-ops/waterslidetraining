import { auth, currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

const COURSE_ID = "waterslide-safety";

// Valid free-access codes, configured via the TRAINING_PROMO_CODES env var
// (comma-separated). Matching is case-insensitive.
function validCodes(): string[] {
  return (process.env.TRAINING_PROMO_CODES || "")
    .split(",")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);
}

// POST /api/redeem - redeem a promo code for free course access.
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const code = String(body.code || "").trim();
  if (!code) {
    return NextResponse.json({ error: "Enter a code" }, { status: 400 });
  }

  const codes = validCodes();
  if (codes.length === 0) {
    return NextResponse.json({ error: "Promo codes are not available" }, { status: 400 });
  }
  if (!codes.includes(code.toLowerCase())) {
    return NextResponse.json({ error: "That code isn't valid" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  // Resolve the signed-in user's email/name from Clerk.
  const cu = await currentUser();
  const email =
    cu?.primaryEmailAddress?.emailAddress ||
    cu?.emailAddresses?.[0]?.emailAddress ||
    "";
  const fullName = [cu?.firstName, cu?.lastName].filter(Boolean).join(" ");

  // Find or create the user row.
  let { data: user } = await supabase
    .from("users")
    .select("id, org_id")
    .eq("clerk_user_id", userId)
    .single();

  if (!user) {
    const { data: newUser } = await supabase
      .from("users")
      .insert({ clerk_user_id: userId, email, full_name: fullName, role: "admin" })
      .select("id, org_id")
      .single();
    user = newUser;
  }

  if (!user) {
    return NextResponse.json({ error: "Could not resolve your account" }, { status: 500 });
  }

  // Already enrolled — nothing to do, just let them in.
  const { data: existing } = await supabase
    .from("enrollments")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("course_id", COURSE_ID)
    .maybeSingle();

  if (existing && existing.status === "active") {
    return NextResponse.json({ success: true, alreadyEnrolled: true });
  }

  // Ensure the user has an organisation to hang the licence off.
  let orgId = user.org_id;
  if (!orgId) {
    const { data: org } = await supabase
      .from("organizations")
      .insert({ name: fullName || email || "Promo access" })
      .select("id")
      .single();
    if (org) {
      orgId = org.id;
      await supabase.from("users").update({ org_id: orgId }).eq("id", user.id);
    }
  }

  // Create a single-seat promo licence (no Stripe subscription).
  const { data: license } = await supabase
    .from("licenses")
    .insert({
      org_id: orgId,
      course_id: COURSE_ID,
      total_seats: 1,
      used_seats: 1,
      stripe_subscription_id: `promo:${code}`,
      status: "active",
    })
    .select("id")
    .single();

  // Enrol the user (same shape as a paid enrolment).
  await supabase.from("enrollments").upsert(
    {
      user_id: user.id,
      license_id: license?.id ?? null,
      course_id: COURSE_ID,
      status: "active",
    },
    { onConflict: "user_id,course_id" }
  );

  // Make sure they have a progress record.
  await supabase.from("user_progress").upsert(
    { user_id: user.id },
    { onConflict: "user_id" }
  );

  return NextResponse.json({ success: true });
}
