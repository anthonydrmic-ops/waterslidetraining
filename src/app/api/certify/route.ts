import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

function generateCertId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "SS-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// POST /api/certify - generate certificate with verification ID
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await request.json();
  const { userName } = body;

  if (!userName?.trim()) {
    return NextResponse.json({ error: "userName required" }, { status: 400 });
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

  // Check if cert already exists
  const { data: existingCert } = await supabase
    .from("certificates")
    .select("id")
    .eq("user_id", dbUser.id)
    .single();

  if (existingCert) {
    return NextResponse.json({ certId: existingCert.id });
  }

  // Get quiz score from progress
  const { data: progress } = await supabase
    .from("user_progress")
    .select("quiz_scores")
    .eq("user_id", dbUser.id)
    .single();

  const finalScore = progress?.quiz_scores?.["final-assessment"];

  // Generate unique cert ID
  let certId = generateCertId();
  let attempts = 0;
  while (attempts < 10) {
    const { data: clash } = await supabase
      .from("certificates")
      .select("id")
      .eq("id", certId)
      .single();
    if (!clash) break;
    certId = generateCertId();
    attempts++;
  }

  // Create certificate
  await supabase.from("certificates").insert({
    id: certId,
    user_id: dbUser.id,
    user_name: userName.trim(),
    score: finalScore?.score || null,
    total: finalScore?.total || null,
  });

  // Update progress with cert ID
  await supabase
    .from("user_progress")
    .update({
      certified: true,
      certification_date: new Date().toISOString(),
      user_name: userName.trim(),
      cert_id: certId,
    })
    .eq("user_id", dbUser.id);

  return NextResponse.json({ certId });
}
