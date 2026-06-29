import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  _stripe = new Stripe(key);
  return _stripe;
}

// ---------------------------------------------------------------------------
// Launch pricing — runs through the end of July 2026 (AEST). After the window
// closes, the regular per-seat price applies automatically.
// ---------------------------------------------------------------------------
export const LAUNCH_END_ISO = "2026-07-31T23:59:59+10:00";

export function isLaunchActive(now: Date = new Date()): boolean {
  return now.getTime() <= new Date(LAUNCH_END_ISO).getTime();
}

export type PriceTier = "individual" | "team" | "business";
export type CourseId = keyof typeof COURSES;

// Per-seat prices are in cents (AUD). `regular` is the list price; `launch` is
// the founding/launch price charged during the launch window.
export const COURSES = {
  "waterslide-safety": {
    name: "Waterslide Safety & Competency Program",
    description: "Comprehensive waterslide operator training with certification",
    tiers: {
      individual: { label: "Individual", minSeats: 1, maxSeats: 1, regular: 14900, launch: 9900 },
      team: { label: "Team", minSeats: 2, maxSeats: 10, regular: 11900, launch: 8900 },
      business: { label: "Business", minSeats: 11, maxSeats: 50, regular: 9900, launch: 7900 },
    },
  },
} as const;

export function tierConfig(courseId: string, tier: string) {
  const course = COURSES[courseId as CourseId];
  if (!course) return null;
  return course.tiers[tier as PriceTier] ?? null;
}

/** Active per-seat price (cents) for a tier — launch price during the window, else regular. */
export function perSeatPrice(courseId: string, tier: string, now: Date = new Date()): number | null {
  const t = tierConfig(courseId, tier);
  if (!t) return null;
  return isLaunchActive(now) ? t.launch : t.regular;
}

/** Clamp a requested seat count into the tier's allowed [min, max] range. */
export function clampSeats(courseId: string, tier: string, requested: number | undefined): number | null {
  const t = tierConfig(courseId, tier);
  if (!t) return null;
  const n = Math.floor(Number(requested ?? t.minSeats));
  if (!Number.isFinite(n)) return t.minSeats;
  return Math.max(t.minSeats, Math.min(t.maxSeats, n));
}
