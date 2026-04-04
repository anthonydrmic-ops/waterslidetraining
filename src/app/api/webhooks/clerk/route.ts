import { getSupabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Clerk webhook types we care about
interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
  };
}

// POST /api/webhooks/clerk - handle Clerk webhook events
export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  let event: ClerkWebhookEvent;
  try {
    event = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    const clerkUserId = event.data.id;
    const email = event.data.email_addresses?.[0]?.email_address || "";
    const fullName = [event.data.first_name, event.data.last_name]
      .filter(Boolean)
      .join(" ");

    // Upsert user
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", clerkUserId)
      .single();

    if (existing) {
      await supabase
        .from("users")
        .update({ email, full_name: fullName })
        .eq("clerk_user_id", clerkUserId);
    } else {
      const { data: newUser } = await supabase
        .from("users")
        .insert({
          clerk_user_id: clerkUserId,
          email,
          full_name: fullName,
        })
        .select("id")
        .single();

      // Create empty progress record for the new user
      if (newUser) {
        await supabase.from("user_progress").upsert(
          { user_id: newUser.id },
          { onConflict: "user_id" }
        );
      }
    }
  }

  if (event.type === "user.deleted") {
    // Clean up - cascade will handle progress, enrollments
    await supabase
      .from("users")
      .delete()
      .eq("clerk_user_id", event.data.id);
  }

  return NextResponse.json({ received: true });
}
