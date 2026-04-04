import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  _stripe = new Stripe(key);
  return _stripe;
}

// Course pricing config
export const COURSES = {
  "waterslide-safety": {
    name: "Waterslide Safety & Competency Training",
    description: "Comprehensive waterslide operator training with certification",
    prices: {
      individual: { seats: 1, pricePerSeat: 14900 }, // $149.00 in cents
      team: { seats: 10, pricePerSeat: 9900 },        // $99.00
      business: { seats: 50, pricePerSeat: 7900 },     // $79.00
    },
  },
} as const;

export type CourseId = keyof typeof COURSES;
export type PriceTier = "individual" | "team" | "business";
