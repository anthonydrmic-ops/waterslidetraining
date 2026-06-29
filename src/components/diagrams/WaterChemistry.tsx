"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;

// Zone colours: bright green = ideal, dim green = OK/acceptable, red = danger.
const ZONE_FILL: Record<string, string> = {
  ideal: "rgba(34, 197, 94, 0.9)",
  ok: "rgba(34, 197, 94, 0.3)",
  red: "rgba(239, 68, 68, 0.24)",
};

type Zone = { to: number; kind: "red" | "ok" | "ideal" };

type Param = {
  label: string;
  scaleMin: number;
  scaleMax: number;
  zones: Zone[]; // contiguous, each runs from the previous boundary up to `to`
  idealLow: number;
  idealHigh: number;
  target: string; // ideal range, shown in the chip
  lowRisk: string;
  lowThresh: string; // where the low danger zone begins ("below X")
  highRisk: string;
  highThresh: string; // where the high danger zone begins ("above X")
  color: string; // label/identity colour only
};

// FAC scale runs to 15 so the danger zone past the 10 mg/L regulatory maximum
// has room to read; ideal is the bright-green sweet spot, OK the acceptable
// operating band up to the limit.
const params: Param[] = [
  {
    label: "pH Level", scaleMin: 6.0, scaleMax: 9.0,
    zones: [{ to: 7.0, kind: "red" }, { to: 7.2, kind: "ok" }, { to: 7.8, kind: "ideal" }, { to: 8.0, kind: "ok" }, { to: 9.0, kind: "red" }],
    idealLow: 7.2, idealHigh: 7.8, target: "7.2 – 7.8",
    lowRisk: "Corrosive", lowThresh: "7.0", highRisk: "Scaling", highThresh: "8.0", color: "#1F7A8C",
  },
  {
    label: "FAC (Indoor)", scaleMin: 0, scaleMax: 15,
    zones: [{ to: 1, kind: "red" }, { to: 3, kind: "ideal" }, { to: 10, kind: "ok" }, { to: 15, kind: "red" }],
    idealLow: 1, idealHigh: 3, target: "1 – 3 ppm",
    lowRisk: "Infection risk", lowThresh: "1 ppm", highRisk: "Surface damage", highThresh: "10 ppm", color: "#16a34a",
  },
  {
    label: "FAC (Outdoor)", scaleMin: 0, scaleMax: 15,
    zones: [{ to: 2, kind: "red" }, { to: 4, kind: "ideal" }, { to: 10, kind: "ok" }, { to: 15, kind: "red" }],
    idealLow: 2, idealHigh: 4, target: "2 – 4 ppm",
    lowRisk: "Infection risk", lowThresh: "2 ppm", highRisk: "Surface damage", highThresh: "10 ppm", color: "#16a34a",
  },
  {
    label: "LSI Index", scaleMin: -2.0, scaleMax: 2.0,
    zones: [{ to: -0.5, kind: "red" }, { to: -0.3, kind: "ok" }, { to: 0.3, kind: "ideal" }, { to: 0.5, kind: "ok" }, { to: 2.0, kind: "red" }],
    idealLow: -0.3, idealHigh: 0.3, target: "-0.3 to +0.3",
    lowRisk: "Dissolves surfaces", lowThresh: "-0.5", highRisk: "Heavy scaling", highThresh: "+0.5", color: "#0B3A66",
  },
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
          0% { transform: scale(1); opacity: 0.4; }
          70%, 100% { transform: scale(2.6); opacity: 0; }
        }
      `}</style>

      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-4 text-center">
        Water Chemistry Balance · Key Parameters
      </p>

      <div className="space-y-2.5">
        {params.map((p, i) => {
          const span = p.scaleMax - p.scaleMin;
          const centerPct = (((p.idealLow + p.idealHigh) / 2 - p.scaleMin) / span) * 100;
          let cursor = p.scaleMin;

          return (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.45, delay: i * 0.12, ease: EASE }}
              className="rounded-2xl bg-white ring-1 ring-stone-200/70 px-4 py-3.5"
            >
              {/* Header: parameter + ideal-range chip */}
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <span className="text-sm font-bold tracking-tight" style={{ color: p.color }}>
                  {p.label}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                  style={{ color: "#15803d", backgroundColor: "rgba(34,197,94,0.12)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22c55e" }} />
                  Ideal {p.target}
                </span>
              </div>

              {/* Track: red · ideal (bright) · ok (dim) · red — positioned to scale */}
              <div className="relative h-3">
                <div className="absolute inset-0 flex rounded-full overflow-hidden ring-1 ring-stone-200/60 bg-stone-100">
                  {p.zones.map((z, zi) => {
                    const w = ((z.to - cursor) / span) * 100;
                    cursor = z.to;
                    const isIdeal = z.kind === "ideal";
                    return (
                      <motion.div
                        key={zi}
                        className="h-full"
                        style={{ width: `${w}%`, backgroundColor: ZONE_FILL[z.kind] }}
                        initial={{ opacity: reduce ? 1 : isIdeal ? 0 : 0.5 }}
                        animate={inView ? { opacity: 1 } : { opacity: reduce ? 1 : isIdeal ? 0 : 0.5 }}
                        transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: EASE }}
                      />
                    );
                  })}
                </div>

                {/* Operating point drifts up from the under-treated (low) end and
                    settles in the middle of the ideal band — the job of dosing. */}
                <motion.div
                  className="absolute top-1/2"
                  style={{ translateX: "-50%", translateY: "-50%" }}
                  initial={{ left: reduce ? `${centerPct}%` : "4%", opacity: reduce ? 1 : 0 }}
                  animate={inView ? { left: `${centerPct}%`, opacity: 1 } : {}}
                  transition={{
                    left: { type: "spring", stiffness: 55, damping: 14, delay: 0.45 + i * 0.12 },
                    opacity: { duration: 0.3, delay: 0.45 + i * 0.12 },
                  }}
                >
                  {!reduce && (
                    <span
                      className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: "#1c1917", animation: "wcPulse 2.6s cubic-bezier(0,0,0.2,1) infinite" }}
                    />
                  )}
                  <span className="relative block w-3.5 h-3.5 rounded-full bg-stone-900 ring-2 ring-white shadow-sm" />
                </motion.div>
              </div>

              {/* Danger ends: threshold + what goes wrong */}
              <div className="flex items-start justify-between mt-2 text-[11px] leading-tight">
                <div className="text-left">
                  <span className="font-semibold text-red-500">{p.lowRisk}</span>
                  <span className="block text-stone-400">below {p.lowThresh}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-red-500">{p.highRisk}</span>
                  <span className="block text-stone-400">above {p.highThresh}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.2 + params.length * 0.12 }}
        className="flex items-center justify-center flex-wrap gap-x-5 gap-y-1.5 mt-3.5 text-[10px] font-medium text-stone-500"
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[4px]" style={{ backgroundColor: ZONE_FILL.ideal }} /> Ideal
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[4px]" style={{ backgroundColor: ZONE_FILL.ok }} /> OK
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[4px]" style={{ backgroundColor: ZONE_FILL.red }} /> Out of range
        </span>
      </motion.div>

      <p className="text-[11px] text-stone-400 text-center mt-2.5">
        LSI (Langelier Saturation Index) = water&apos;s tendency to scale or corrode
      </p>
    </div>
  );
}
