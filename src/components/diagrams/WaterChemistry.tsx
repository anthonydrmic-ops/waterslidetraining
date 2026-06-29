"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;

type Param = {
  label: string;
  low: string;
  lowRisk: string;
  target: string;
  high: string;
  highRisk: string;
  color: string;
};

// Free chlorine upper figure corrected to the 10 mg/L regulatory maximum
// (the level at which bathers must be cleared), per AU aquatic facility
// guidelines — not the earlier "5.0+".
const params: Param[] = [
  { label: "pH Level", low: "6.0", lowRisk: "Corrosive", target: "7.2 – 7.8", high: "9.0", highRisk: "Scaling", color: "#1F7A8C" },
  { label: "FAC (Indoor)", low: "0", lowRisk: "Infection risk", target: "1.0 – 3.0 ppm", high: "10+ ppm", highRisk: "Surface damage", color: "#16a34a" },
  { label: "FAC (Outdoor)", low: "0", lowRisk: "Infection risk", target: "2.0 – 4.0 ppm", high: "10+ ppm", highRisk: "Surface damage", color: "#16a34a" },
  { label: "LSI Index", low: "-2.0", lowRisk: "Dissolves surfaces", target: "-0.3 to +0.3", high: "+2.0", highRisk: "Heavy scaling", color: "#0B3A66" },
];

export function WaterChemistry() {
  const reduce = useReducedMotion();
  // Explicit in-view trigger — see IncidentChain for why inherited whileInView
  // is unreliable inside the lesson page's animation context.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className="w-full">
      {/* Continuous marker glow uses a CSS keyframe (framer repeats don't run in
          prod); entrance motion stays on framer one-shots. */}
      <style>{`
        @keyframes wcPulse {
          0% { transform: scale(1); opacity: 0.45; }
          70%, 100% { transform: scale(2.6); opacity: 0; }
        }
      `}</style>

      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-4 text-center">
        Water Chemistry Balance · Key Parameters
      </p>

      <div className="space-y-2.5">
        {params.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.45, delay: i * 0.12, ease: EASE }}
            className="rounded-2xl bg-white ring-1 ring-stone-200/70 px-4 py-3.5"
          >
            {/* Header: parameter + safe-range chip */}
            <div className="flex items-center justify-between gap-3 mb-2.5">
              <span className="text-sm font-bold tracking-tight" style={{ color: p.color }}>
                {p.label}
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                style={{
                  color: p.color,
                  backgroundColor: `color-mix(in srgb, ${p.color} 12%, transparent)`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                Safe {p.target}
              </span>
            </div>

            {/* Track: red (too low) · colour (safe) · red (too high) */}
            <div className="relative h-3">
              <div className="absolute inset-0 flex rounded-full overflow-hidden ring-1 ring-stone-200/60">
                <div className="w-1/4 h-full bg-red-400/20" />
                <motion.div
                  className="w-1/2 h-full"
                  style={{ backgroundColor: `color-mix(in srgb, ${p.color} 32%, white)`, transformOrigin: "center" }}
                  initial={{ scaleX: reduce ? 1 : 0.2 }}
                  animate={inView ? { scaleX: 1 } : { scaleX: reduce ? 1 : 0.2 }}
                  transition={{ duration: 0.55, delay: 0.2 + i * 0.12, ease: EASE }}
                />
                <div className="w-1/4 h-full bg-red-400/20" />
              </div>

              {/* Operating point drifts in from the low end and settles in the
                  middle of the safe band — the job of daily dosing. */}
              <motion.div
                className="absolute top-1/2"
                style={{ translateX: "-50%", translateY: "-50%" }}
                initial={{ left: reduce ? "50%" : "13%", opacity: reduce ? 1 : 0 }}
                animate={inView ? { left: "50%", opacity: 1 } : {}}
                transition={{
                  left: { type: "spring", stiffness: 55, damping: 14, delay: 0.45 + i * 0.12 },
                  opacity: { duration: 0.3, delay: 0.45 + i * 0.12 },
                }}
              >
                {!reduce && (
                  <span
                    className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: p.color, animation: "wcPulse 2.6s cubic-bezier(0,0,0.2,1) infinite" }}
                  />
                )}
                <span
                  className="relative block w-3.5 h-3.5 rounded-full ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: p.color }}
                />
              </motion.div>
            </div>

            {/* Danger ends: value + what goes wrong */}
            <div className="flex items-start justify-between mt-2 text-[11px] leading-tight">
              <div className="text-left">
                <span className="font-bold text-red-500">{p.low}</span>
                <span className="block text-stone-400">{p.lowRisk}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-red-500">{p.high}</span>
                <span className="block text-stone-400">{p.highRisk}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.2 + params.length * 0.12 }}
        className="text-[11px] text-stone-400 text-center mt-3.5"
      >
        LSI (Langelier Saturation Index) = water&apos;s tendency to scale or corrode
      </motion.p>
    </div>
  );
}
