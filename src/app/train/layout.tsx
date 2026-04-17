import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";

export default async function TrainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userId: string | null = null;
  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch {
    // Auth may fail in dev bypass mode
  }

  if (!userId) {
    return <>{children}</>;
  }

  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (!user) {
      redirect("/training/slidesure");
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
  }

  return <>{children}</>;
}
