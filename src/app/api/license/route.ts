import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ licensed: false }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    // Can't verify entitlement without the database — report not licensed.
    return NextResponse.json({ licensed: false });
  }

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!user) {
    return NextResponse.json({ licensed: false });
  }

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("course_id", "waterslide-safety")
    .eq("status", "active")
    .single();

  return NextResponse.json({ licensed: !!enrollment });
}
