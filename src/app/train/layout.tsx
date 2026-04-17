import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";

export default async function TrainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/train");
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
