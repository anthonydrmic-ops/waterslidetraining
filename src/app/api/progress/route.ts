import { auth, currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Helper: ensure user exists in Supabase, create if not
async function ensureUser(supabase: ReturnType<typeof getSupabaseAdmin>, clerkUserId: string) {
  if (!supabase) return null;

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (existing) return existing;

  // Get user info from Clerk
  let email = "";
  let fullName = "";
  try {
    const clerkUser = await currentUser();
    if (clerkUser) {
      email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
      fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ");
    }
  } catch {
    // Clerk user fetch failed, continue with empty values
  }

  const { data: newUser } = await supabase
    .from("users")
    .insert({
      clerk_user_id: clerkUserId,
      email,
      full_name: fullName,
    })
    .select("id")
    .single();

  if (newUser) {
    // Create empty progress record
    await supabase.from("user_progress").upsert(
      { user_id: newUser.id },
      { onConflict: "user_id" }
    );
  }

  return newUser;
}

// GET /api/progress - load user's progress
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const user = await ensureUser(supabase, userId);
  if (!user) return NextResponse.json({});

  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!progress) {
    return NextResponse.json({});
  }

  return NextResponse.json({
    userId: userId,
    completedLessons: progress.completed_lessons || [],
    completedModules: progress.completed_modules || [],
    quizScores: progress.quiz_scores || {},
    currentModule: progress.current_module,
    currentLesson: progress.current_lesson,
    certified: progress.certified || false,
    certificationDate: progress.certification_date,
    userName: progress.user_name,
    certId: progress.cert_id || null,
  });
}

// PUT /api/progress - save user's progress
export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = await request.json();
  const user = await ensureUser(supabase, userId);

  if (!user) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }

  // Upsert progress
  await supabase
    .from("user_progress")
    .upsert({
      user_id: user.id,
      completed_lessons: body.completedLessons || [],
      completed_modules: body.completedModules || [],
      quiz_scores: body.quizScores || {},
      current_module: body.currentModule,
      current_lesson: body.currentLesson,
      certified: body.certified || false,
      certification_date: body.certificationDate,
      user_name: body.userName,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

  return NextResponse.json({ ok: true });
}
