import { getSupabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET /api/checkout/result?session_id=cs_xxx
// After checkout, the success page polls this to read the licence that the
// webhook created for the session (join code + seats). The Stripe session id is
// the buyer's own redirect token, so it gates access to that licence's code.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { data: license } = await supabase
    .from("licenses")
    .select("join_code, total_seats, used_seats, course_id, buyer_email")
    .eq("stripe_subscription_id", sessionId)
    .maybeSingle();

  // Webhook may not have processed yet — tell the client to keep polling.
  if (!license) {
    return NextResponse.json({ pending: true });
  }

  return NextResponse.json({
    pending: false,
    joinCode: license.join_code,
    totalSeats: license.total_seats,
    usedSeats: license.used_seats,
    courseId: license.course_id,
    buyerEmail: license.buyer_email,
  });
}
