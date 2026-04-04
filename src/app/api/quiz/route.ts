import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET /api/quiz?lessonId=1-1 - fetch quiz questions for a lesson
// Returns a random selection from the question pool, without correctIndex
export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get("lessonId");

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  // Check if user already submitted this quiz
  const { data: dbUser } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (dbUser) {
    const { data: progress } = await supabase
      .from("user_progress")
      .select("quiz_scores")
      .eq("user_id", dbUser.id)
      .single();

    if (progress?.quiz_scores?.[lessonId]) {
      return NextResponse.json({
        alreadySubmitted: true,
        score: progress.quiz_scores[lessonId],
      });
    }
  }

  // Fetch questions from pool
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, question, options, explanation, type, lesson_id")
    .eq("lesson_id", lessonId);

  if (!questions || questions.length === 0) {
    // Fallback: return empty so client can use bundled questions
    return NextResponse.json({ questions: [], fallback: true });
  }

  // Shuffle and pick 5 (or all if fewer than 5)
  const shuffled = questions.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 5);

  // Strip correctIndex - client never sees the answer
  const sanitized = selected.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    type: q.type,
    lessonId: q.lesson_id,
  }));

  return NextResponse.json({ questions: sanitized });
}

// POST /api/quiz - submit answers and get score
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await request.json();
  const { lessonId, answers } = body as {
    lessonId: string;
    answers: Record<string, number>; // questionId -> selected index
  };

  if (!lessonId || !answers) {
    return NextResponse.json({ error: "lessonId and answers required" }, { status: 400 });
  }

  // Find user
  const { data: dbUser } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if already submitted
  const { data: progress } = await supabase
    .from("user_progress")
    .select("quiz_scores")
    .eq("user_id", dbUser.id)
    .single();

  if (progress?.quiz_scores?.[lessonId]) {
    return NextResponse.json({
      error: "Quiz already submitted for this lesson",
      score: progress.quiz_scores[lessonId],
    }, { status: 409 });
  }

  // Fetch correct answers from DB
  const questionIds = Object.keys(answers);
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, correct_index, explanation")
    .in("id", questionIds);

  if (!questions || questions.length === 0) {
    // Fallback: trust client-side scoring
    return NextResponse.json({ fallback: true });
  }

  // Grade
  let score = 0;
  const total = questions.length;
  const results: Record<string, { correct: boolean; correctIndex: number; explanation: string }> = {};

  for (const q of questions) {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correct_index;
    if (isCorrect) score++;
    results[q.id] = {
      correct: isCorrect,
      correctIndex: q.correct_index,
      explanation: q.explanation,
    };
  }

  return NextResponse.json({
    score,
    total,
    pct: Math.round((score / total) * 100),
    results,
  });
}
