import { auth } from "@clerk/nextjs/server";
import {
  getStripe,
  COURSES,
  tierConfig,
  perSeatPrice,
  clampSeats,
  isLaunchActive,
  type PriceTier,
} from "@/lib/stripe";
import { NextResponse } from "next/server";

// POST /api/checkout - create a Stripe checkout session.
// Auth is OPTIONAL: a buyer can purchase seats without an account and distribute
// them afterwards via the join code. If signed in, we attach their Clerk id so
// the purchase can be linked to them as the org admin.
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });

  let userId: string | null = null;
  try {
    userId = (await auth()).userId;
  } catch {
    userId = null;
  }

  const body = await request.json().catch(() => ({}));
  const courseId = (body.courseId as string) || "waterslide-safety";
  const tier = body.tier as PriceTier;

  const t = tierConfig(courseId, tier);
  if (!t) return NextResponse.json({ error: "Invalid course or tier" }, { status: 400 });

  const seats = clampSeats(courseId, tier, body.seats);
  const perSeat = perSeatPrice(courseId, tier);
  if (!seats || !perSeat) {
    return NextResponse.json({ error: "Invalid configuration" }, { status: 400 });
  }

  const course = COURSES[courseId as keyof typeof COURSES];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      allow_promotion_codes: true,
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: `${course.name} - ${t.label} (${seats} ${seats === 1 ? "seat" : "seats"})`,
              description: course.description,
            },
            unit_amount: perSeat,
          },
          quantity: seats,
        },
      ],
      metadata: {
        courseId,
        tier,
        seats: String(seats),
        launch: isLaunchActive() ? "1" : "0",
        ...(userId ? { clerkUserId: userId } : {}),
      },
      success_url: `${appUrl}/training/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/training/slidesure`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Surface the real Stripe error instead of throwing a bare 500 (which the
    // client could only report as "couldn't connect"). The detail is logged to
    // the Vercel function logs and returned so the cause is visible.
    console.error("Stripe checkout.sessions.create failed:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Checkout failed", detail }, { status: 500 });
  }
}
