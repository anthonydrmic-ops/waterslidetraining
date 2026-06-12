"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;
const STAGE_MS = 3600;

const STAGES = [
  {
    tone: "#1F7A8C",
    label: "Monitor continuously",
    detail: "An anemometer at the highest dispatch platform - wind at the tower is stronger than wind on the deck.",
    streaks: 4,
    speed: 7,
    streakOpacity: 0.3,
    tint: 0,
  },
  {
    tone: "#d97706",
    label: "Winds rising toward the limit",
    detail: "Brief operators and watch ride behaviour - expect slower, less predictable riders on open flumes.",
    streaks: 7,
    speed: 4.4,
    streakOpacity: 0.4,
    tint: 0,
  },
  {
    tone: "#d97706",
    label: "Gusts near the limit",
    detail: "Restrict the exposed rides first - tall open flumes and light riders are affected most. Gusts move riders, not averages.",
    streaks: 10,
    speed: 2.6,
    streakOpacity: 0.5,
    tint: 0.06,
  },
  {
    tone: "#dc2626",
    label: "Sustained wind above the manufacturer's limit",
    detail: "Close the affected slides. The figure in the operations manual governs - not judgement on the day.",
    streaks: 14,
    speed: 1.7,
    streakOpacity: 0.6,
    tint: 0.12,
  },
  {
    tone: "#dc2626",
    label: "Lightning or storm front",
    detail: "Clear pools and towers immediately. This overrides everything else.",
    streaks: 14,
    speed: 1.4,
    streakOpacity: 0.65,
    tint: 0.2,
  },
];

// Fixed streak lanes (top %, base width px, phase delay s, slight tilt) so the
// field looks organic without randomness at render time.
const LANES = [
  { top: 4, w: 110, d: 0, r: -1 },
  { top: 11, w: 80, d: 1.6, r: 0 },
  { top: 19, w: 130, d: 0.7, r: -2 },
  { top: 27, w: 95, d: 2.2, r: 1 },
  { top: 35, w: 120, d: 1.1, r: 0 },
  { top: 43, w: 85, d: 2.8, r: -1 },
  { top: 51, w: 140, d: 0.4, r: 1 },
  { top: 59, w: 100, d: 1.9, r: 0 },
  { top: 67, w: 125, d: 0.9, r: -2 },
  { top: 75, w: 90, d: 2.5, r: 1 },
  { top: 82, w: 135, d: 1.4, r: 0 },
  { top: 88, w: 105, d: 0.2, r: -1 },
  { top: 94, w: 115, d: 2.0, r: 1 },
  { top: 47, w: 75, d: 3.1, r: 0 },
];

export function WindResponse() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), STAGE_MS);
    return () => clearInterval(id);
  }, [reduce, inView]);

  const current = STAGES[stage];
  const storm = stage === STAGES.length - 1;

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Staged Wind Response
      </p>

      <div className="relative rounded-2xl overflow-hidden p-3 sm:p-4">
        {/* Weather layer — wind matching the active stage */}
        {!reduce && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {/* Sky darkening */}
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: current.tint,
                backgroundColor: storm ? "#1e293b" : "#64748b",
              }}
              transition={{ duration: 0.8, ease: EASE }}
            />
            {/* Wind streaks */}
            {LANES.slice(0, current.streaks).map((lane, i) => (
              <span
                key={`${stage}-${i}`}
                className="wind-streak"
                style={{
                  top: `${lane.top}%`,
                  width: lane.w,
                  color: storm ? "#cbd5e1" : "#94a3b8",
                  opacity: current.streakOpacity,
                  transform: `rotate(${lane.r}deg)`,
                  animationDuration: `${current.speed + (i % 3) * 0.5}s`,
                  animationDelay: `${lane.d * -1}s`,
                }}
              />
            ))}
            {/* Lightning at the top stage */}
            {storm && (
              <div
                className="storm-flash absolute inset-0"
                style={{
                  background:
                    "radial-gradient(55% 55% at 72% 12%, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)",
                }}
              />
            )}
          </div>
        )}

        {/* The five stages */}
        <div className="relative space-y-2">
          {STAGES.map((s, i) => {
            const isActive = !reduce && stage === i;
            return (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.45, delay: 0.15 + i * 0.12, ease: EASE },
                  },
                }}
                className="flex items-start gap-3 rounded-2xl border px-3.5 py-3 transition-all duration-500"
                style={{
                  borderColor: isActive ? `${s.tone}66` : `${s.tone}2b`,
                  background: isActive ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.88)",
                  boxShadow: isActive ? `0 6px 24px ${s.tone}22` : undefined,
                }}
              >
                <span
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-[11px] font-bold transition-colors duration-500"
                  style={{
                    borderColor: s.tone,
                    color: isActive ? "#ffffff" : s.tone,
                    background: isActive ? s.tone : "transparent",
                  }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[12.5px] font-bold leading-tight" style={{ color: s.tone }}>
                    {s.label}
                  </p>
                  <p className="text-[11px] text-stone-500 leading-snug mt-0.5">{s.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.p
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.5, delay: 0.9 } },
        }}
        className="text-[11px] text-stone-400 text-center mt-2 leading-snug"
      >
        Your slide&apos;s wind limit lives in its operations manual - know the number before the wind arrives.
      </motion.p>
    </motion.div>
  );
}
