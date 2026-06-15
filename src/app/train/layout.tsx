import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { MotionProvider } from "@/components/MotionProvider";

export default async function TrainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Must be signed in. auth() can throw if Clerk isn't initialised on the
  // request — treat that as "not signed in" and send them to sign-in rather
  // than letting anyone through.
  let userId: string | null = null;
  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch {
    userId = null;
  }

  if (!userId) {
    redirect("/sign-in?redirect_url=/train");
  }

  // Must have an active enrolment. If the database isn't reachable we cannot
  // verify entitlement, so we deny rather than allow.
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    redirect("/training/slidesure");
  }

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!user) {
    redirect("/training/slidesure?needs_license=true");
  }

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", "waterslide-safety")
    .eq("status", "active")
    .single();

  if (!enrollment) {
    redirect("/training/slidesure?needs_license=true");
  }

  return <MotionProvider>{children}</MotionProvider>;
}
