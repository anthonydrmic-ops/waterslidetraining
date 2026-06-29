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
      .select("id, org_id")
      .eq("clerk_user_id", clerkUserId)
      .single();

    let userId = existing?.id as string | undefined;
    let orgId = existing?.org_id as string | null | undefined;

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
        .select("id, org_id")
        .single();

      // Create empty progress record for the new user
      if (newUser) {
        userId = newUser.id;
        orgId = newUser.org_id;
        await supabase.from("user_progress").upsert(
          { user_id: newUser.id },
          { onConflict: "user_id" }
        );
      }
    }

    // Link a no-login buyer to the licence they paid for: if this email bought a
    // licence (stored as buyer_email) and they aren't in an org yet, make them
    // the org admin so they can manage and distribute seats.
    if (userId && !orgId && email) {
      const { data: lic } = await supabase
        .from("licenses")
        .select("org_id")
        .eq("buyer_email", email)
        .eq("status", "active")
        .not("org_id", "is", null)
        .order("purchased_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (lic?.org_id) {
        await supabase
          .from("users")
          .update({ org_id: lic.org_id, role: "admin" })
          .eq("id", userId);
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
