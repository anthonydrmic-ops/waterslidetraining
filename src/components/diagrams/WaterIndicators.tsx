"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Megaphone } from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

const INDICATORS = [
  { label: "White scale or haze between cleans", color: "#78716c" },
  { label: "Rust-coloured or dark staining", color: "#b45309" },
  { label: "Slimy / unusually slippery surfaces", color: "#16a34a" },
  { label: "Cloudy or discoloured pool water", color: "#0ea5e9" },
  { label: "Unusual corrosion on metal parts", color: "#dc2626" },
  { label: "Weak nozzles or changed spray patterns", color: "#1F7A8C" },
  { label: "More skin / eye irritation reports", color: "#d97706" },
];

const chipVariant = {
  hidden: { opacity: 0, scale: 0.85, y: 6 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 340, damping: 22, delay: i * 0.09 },
  }),
};

export function WaterIndicators() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Seven Sights That Mean &quot;Report It&quot;
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {INDICATORS.map((ind, i) => (
          <motion.span
            key={i}
            variants={chipVariant}
            custom={i}
            className="inline-flex items-center gap-2 text-[11px] font-medium px-3 py-2 rounded-full border bg-white text-stone-600"
            style={{ borderColor: `${ind.color}35` }}
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: ind.color }} />
            {ind.label}
          </motion.span>
        ))}
      </div>

      {/* Report hub */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 10 },
          show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.75, ease: EASE } },
        }}
        className="rounded-2xl border border-[#1F7A8C]/25 bg-[#1F7A8C]/5 px-4 py-3.5 flex items-center justify-center gap-3 max-w-xl mx-auto"
      >
        <ArrowRight size={16} weight="bold" className="text-[#1F7A8C] shrink-0" />
        <div className="relative w-9 h-9 rounded-xl bg-[#1F7A8C]/12 flex items-center justify-center shrink-0">
          {!reduce && (
            <span
              aria-hidden
              className="ping-ring absolute inset-0 rounded-xl border-2 border-[#1F7A8C]"
              style={{ animationDelay: "1.6s" }}
            />
          )}
          <Megaphone size={18} weight="duotone" className="text-[#1F7A8C]" />
        </div>
        <p className="text-[12.5px] font-semibold text-stone-700 leading-snug">
          Report to maintenance - operators observe and escalate, specialists treat the water
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
