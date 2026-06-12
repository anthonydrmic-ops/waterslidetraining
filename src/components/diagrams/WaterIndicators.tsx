"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { CaretDown, Megaphone } from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

// Rainbow stack, top to bottom. Colours are decorative; the labels are the
// seven sights an operator reports.
const INDICATORS = [
  { label: "White scale or haze between cleans", color: "#ef4444" },
  { label: "Rust-coloured or dark staining", color: "#f97316" },
  { label: "Slimy or unusually slippery surfaces", color: "#eab308" },
  { label: "Cloudy or discoloured pool water", color: "#22c55e" },
  { label: "Unusual corrosion on metal parts", color: "#0ea5e9" },
  { label: "Weak nozzles or changed spray patterns", color: "#6366f1" },
  { label: "More skin or eye irritation reports", color: "#a855f7" },
];

// One full cycle of the scan wave; each block fires at i * (CYCLE / count).
const CYCLE = 4.9;
const STEP = CYCLE / INDICATORS.length;

const blockVariant = {
  hidden: { opacity: 0, x: -14 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: EASE },
  }),
};

export function WaterIndicators() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      className="w-full max-w-xl mx-auto"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Seven Sights That Mean &quot;Report It&quot;
      </p>

      {/* The rainbow stack — a scan wave sweeps down it */}
      <div className="space-y-2">
        {INDICATORS.map((ind, i) => {
          const delay = `${(i * STEP).toFixed(2)}s`;
          return (
            <motion.div
              key={i}
              variants={blockVariant}
              custom={i}
              className={`relative flex items-center gap-3 rounded-xl border bg-white pl-3 pr-4 py-2.5 overflow-hidden ${
                reduce ? "" : "scan-block"
              }`}
              style={
                {
                  borderColor: `${ind.color}33`,
                  background: `${ind.color}0a`,
                  ["--glow" as string]: `${ind.color}55`,
                  animationDelay: reduce ? undefined : delay,
                } as React.CSSProperties
              }
            >
              {/* Coloured rail that brightens as the wave passes */}
              <span
                aria-hidden
                className={`absolute left-0 top-0 bottom-0 w-1.5 origin-center ${reduce ? "" : "scan-bar"}`}
                style={{ background: ind.color, animationDelay: reduce ? undefined : delay }}
              />
              {/* Numbered dot */}
              <span
                className={`relative ml-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${
                  reduce ? "" : "scan-dot"
                }`}
                style={
                  {
                    background: ind.color,
                    ["--glow" as string]: ind.color,
                    animationDelay: reduce ? undefined : delay,
                  } as React.CSSProperties
                }
              >
                {i + 1}
              </span>
              <p className="text-[12.5px] font-medium text-stone-700 leading-snug">
                {ind.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Converging arrow */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.4, delay: 0.7 } },
        }}
        className="flex justify-center py-1.5"
      >
        <CaretDown
          size={20}
          weight="bold"
          className={`text-[#1F7A8C] ${reduce ? "" : "flow-arrow"}`}
        />
      </motion.div>

      {/* The single response — all seven sights lead here */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 10 },
          show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8, ease: EASE } },
        }}
        className="rounded-2xl border border-[#1F7A8C]/30 bg-[#1F7A8C]/5 px-4 py-3.5 flex items-center gap-3"
      >
        <div className="relative w-10 h-10 rounded-xl bg-[#1F7A8C]/12 flex items-center justify-center shrink-0">
          {!reduce && (
            <span
              aria-hidden
              className="ping-ring absolute inset-0 rounded-xl border-2 border-[#1F7A8C]"
              style={{ animationDelay: `${(CYCLE - 0.3).toFixed(2)}s` }}
            />
          )}
          <Megaphone size={19} weight="duotone" className="text-[#1F7A8C]" />
        </div>
        <p className="text-[12.5px] font-semibold text-stone-700 leading-snug">
          One response for all seven: report to maintenance. Operators observe and escalate -
          specialists treat the water.
        </p>
      </motion.div>

      <motion.p
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.5, delay: 1 } },
        }}
        className="text-[11px] text-stone-400 text-center mt-3 leading-snug"
      >
        After any shock treatment: retest and confirm levels before the ride reopens.
      </motion.p>
    </motion.div>
  );
}
