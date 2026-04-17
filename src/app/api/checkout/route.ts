import { auth } from "@clerk/nextjs/server";
import { getStripe, COURSES, type PriceTier } from "@/lib/stripe";
import { NextResponse } from "next/server";

// POST /api/checkout - create Stripe checkout session
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });

  const body = await request.json();
  const courseId = body.courseId as string;
  const tier = body.tier as PriceTier;
  const customSeats = body.seats as number | undefined;

  const course = COURSES[courseId as keyof typeof COURSES];
  if (!course) return NextResponse.json({ error: "Invalid course" }, { status: 400 });

  const pricing = course.prices[tier];
  if (!pricing) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

  const seats = tier === "business" && customSeats ? Math.max(customSeats, pricing.seats) : pricing.seats;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "aud",
          product_data: {
            name: `${course.name} - ${tier.charAt(0).toUpperCase() + tier.slice(1)} (${seats} seats)`,
            description: course.description,
          },
          unit_amount: pricing.pricePerSeat,
        },
        quantity: seats,
      },
    ],
    metadata: {
      courseId,
      tier,
      seats: String(seats),
      clerkUserId: userId,
    },
    success_url: `${appUrl}/training/slidesure?purchased=true`,
    cancel_url: `${appUrl}/training/slidesure`,
  });

  return NextResponse.json({ url: session.url });
}
