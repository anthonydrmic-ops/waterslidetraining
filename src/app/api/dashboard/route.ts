import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET /api/dashboard - fetch team progress for admin dashboard
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  // Find requesting user and their org
  const { data: currentUser } = await supabase
    .from("users")
    .select("id, org_id, role")
    .eq("clerk_user_id", userId)
    .single();

  if (!currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!currentUser.org_id) {
    return NextResponse.json({
      orgName: null,
      members: [],
      license: null,
    });
  }

  // Get org info
  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", currentUser.org_id)
    .single();

  // Get license info
  const { data: license } = await supabase
    .from("licenses")
    .select("total_seats, used_seats, status, course_id")
    .eq("org_id", currentUser.org_id)
    .eq("status", "active")
    .order("purchased_at", { ascending: false })
    .limit(1)
    .single();

  // Get all team members in the org
  const { data: members } = await supabase
    .from("users")
    .select("id, email, full_name, role")
    .eq("org_id", currentUser.org_id);

  if (!members) {
    return NextResponse.json({
      orgName: org?.name || null,
      members: [],
      license,
    });
  }

  // Get progress for all team members
  const memberIds = members.map((m) => m.id);
  const { data: progressData } = await supabase
    .from("user_progress")
    .select("user_id, completed_lessons, completed_modules, quiz_scores, certified, certification_date, user_name")
    .in("user_id", memberIds);

  // Total lessons count (29 lessons across 9 modules + 1 assessment)
  const TOTAL_LESSONS = 30;

  const teamMembers = members.map((member) => {
    const progress = progressData?.find((p) => p.user_id === member.id);
    const completedLessons = progress?.completed_lessons?.length || 0;
    const completedModules = progress?.completed_modules?.length || 0;
    const progressPct = Math.round((completedLessons / TOTAL_LESSONS) * 100);

    return {
      id: member.id,
      name: progress?.user_name || member.full_name || "Unknown",
      email: member.email,
      role: member.role,
      progress: progressPct,
      completedModules,
      completedLessons,
      certified: progress?.certified || false,
      certificationDate: progress?.certification_date || null,
    };
  });

  return NextResponse.json({
    orgName: org?.name || null,
    members: teamMembers,
    license,
    isAdmin: currentUser.role === "admin",
  });
}
