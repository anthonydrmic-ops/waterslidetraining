"use client";

import { MotionConfig } from "framer-motion";

/**
 * Wraps the training experience so every framer-motion animation respects the
 * user's `prefers-reduced-motion` setting. With `reducedMotion="user"`, framer
 * skips transform/layout animations for motion-sensitive users while keeping
 * gentle opacity fades, so the UI stays calm but never feels broken.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
