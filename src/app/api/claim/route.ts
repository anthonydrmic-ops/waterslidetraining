import { auth, currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

// POST /api/claim - a signed-in user claims a seat on a team licence using its
// join code. Enrols them in the course if a seat is available.
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const code = String(body.code || "").trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Enter a team code" }, { status: 400 });
  }

  // Find the licence for this join code.
  const { data: license } = await supabase
    .from("licenses")
    .select("id, org_id, course_id, total_seats, status")
    .eq("join_code", code)
    .maybeSingle();

  if (!license || license.status !== "active") {
    return NextResponse.json({ error: "That team code isn't valid" }, { status: 404 });
  }

  // Resolve / create the signed-in user's row.
  let { data: user } = await supabase
    .from("users")
    .select("id, org_id")
    .eq("clerk_user_id", userId)
    .single();

  if (!user) {
    const cu = await currentUser();
    const email =
      cu?.primaryEmailAddress?.emailAddress || cu?.emailAddresses?.[0]?.emailAddress || "";
    const fullName = [cu?.firstName, cu?.lastName].filter(Boolean).join(" ");
    const { data: nu } = await supabase
      .from("users")
      .insert({ clerk_user_id: userId, email, full_name: fullName })
      .select("id, org_id")
      .single();
    user = nu;
    if (user) {
      await supabase.from("user_progress").upsert({ user_id: user.id }, { onConflict: "user_id" });
    }
  }

  if (!user) {
    return NextResponse.json({ error: "Could not resolve your account" }, { status: 500 });
  }

  // Already enrolled in this course — just let them in.
  const { data: existingEnrolment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", license.course_id)
    .maybeSingle();

  if (existingEnrolment) {
    return NextResponse.json({ success: true, alreadyEnrolled: true });
  }

  // Seats available? Count real enrolments against this licence (authoritative,
  // avoids a drifting counter).
  const { count } = await supabase
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .eq("license_id", license.id);

  const used = count || 0;
  if (used >= license.total_seats) {
    return NextResponse.json(
      { error: "This team has no seats remaining. Ask the buyer for another licence." },
      { status: 409 }
    );
  }

  // Attach the user to the org (if not already in one) and enrol them.
  if (!user.org_id && license.org_id) {
    await supabase.from("users").update({ org_id: license.org_id }).eq("id", user.id);
  }

  await supabase.from("enrollments").upsert(
    { user_id: user.id, license_id: license.id, course_id: license.course_id, status: "active" },
    { onConflict: "user_id,course_id" }
  );

  // Reflect the new count on the licence for the dashboard display.
  await supabase.from("licenses").update({ used_seats: used + 1 }).eq("id", license.id);

  return NextResponse.json({ success: true });
}
