"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Prohibit, ClipboardText, MagnifyingGlass, X } from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

const TRIGGERS = [
  "Any crack in the flume",
  "Puncture or hole",
  "Joint lip, gap or sharp edge",
  "Flow below specification",
  "Blocked nozzles / dry zones",
  "Large fracture (esp. flanges)",
  "Missing or damaged signage",
  "Communication failure",
  "Exit zone can't be confirmed",
];

const STEPS = [
  { text: "Record it in the inspection log - location, type, size, photos", danger: false },
  { text: "Keep watching it through the day - conditions change", danger: false },
  { text: "Escalate to maintenance for assessment and scheduling", danger: false },
  { text: "If it worsens toward any trigger on the left: shut down", danger: true },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: d, ease: EASE },
  }),
};

const chipVariant = {
  hidden: { opacity: 0, scale: 0.85 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 380, damping: 24, delay: 0.7 + i * 0.05 },
  }),
};

const stepVariant = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: 0.8 + i * 0.1, ease: EASE },
  }),
};

export function ShutdownDecision() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-5 text-center">
        The Shutdown Decision - No Grey Zone
      </p>

      {/* Decision node */}
      <motion.div variants={fadeUp} custom={0} className="relative z-10 mx-auto w-fit">
        <div className="rounded-full border border-stone-200/80 bg-white pl-2 pr-6 py-2 flex items-center gap-3 shadow-[0_6px_24px_rgba(0,0,0,0.07)]">
          <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center shrink-0">
            <MagnifyingGlass size={18} weight="bold" className="text-white" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-stone-800 leading-tight">
              You find a condition or defect
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400 mt-0.5">
              Is it on the immediate-shutdown list?
            </p>
          </div>
        </div>
      </motion.div>

      {/* Branching connectors */}
      <div className="relative h-14 -mt-1 mx-auto max-w-2xl" aria-hidden>
        <svg viewBox="0 0 400 56" preserveAspectRatio="none" className="w-full h-full" fill="none">
          <motion.path
            d="M200 2 V14 C200 34 130 28 104 54"
            stroke="#fca5a5"
            strokeWidth="2"
            variants={{
              hidden: { pathLength: 0 },
              show: { pathLength: 1, transition: { duration: 0.5, delay: 0.35, ease: EASE } },
            }}
          />
          <motion.path
            d="M200 2 V14 C200 34 270 28 296 54"
            stroke="#6ee7b7"
            strokeWidth="2"
            variants={{
              hidden: { pathLength: 0 },
              show: { pathLength: 1, transition: { duration: 0.5, delay: 0.35, ease: EASE } },
            }}
          />
        </svg>
        <motion.span
          variants={fadeUp}
          custom={0.6}
          className="absolute left-[30%] top-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-red-50 border border-red-200/80 text-red-600 text-[10px] font-bold uppercase tracking-wider"
        >
          Yes
        </motion.span>
        <motion.span
          variants={fadeUp}
          custom={0.6}
          className="absolute left-[70%] top-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-600 text-[10px] font-bold uppercase tracking-wider"
        >
          No
        </motion.span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 items-stretch">
        {/* YES — immediate shutdown */}
        <motion.div
          variants={fadeUp}
          custom={0.5}
          className="rounded-2xl border border-red-200/70 bg-white overflow-hidden h-full flex flex-col"
        >
          <div className="px-4 py-3 bg-red-50/80 border-b border-red-100 flex items-center justify-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              {!reduce && (
                <span
                  aria-hidden
                  className="ping-ring absolute inset-0 rounded-xl border-2 border-red-400"
                  style={{ animationDelay: "1.6s" }}
                />
              )}
              <Prohibit size={18} weight="fill" className="text-red-600" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-red-700 leading-tight">
                Shut down immediately
              </p>
              <p className="text-[10px] text-red-400 font-medium uppercase tracking-wide mt-0.5 whitespace-nowrap">
                No exceptions &middot; no &quot;wait and see&quot;
              </p>
            </div>
          </div>
          <div className="p-4 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 content-start">
            {TRIGGERS.map((t, i) => (
              <motion.div
                key={i}
                variants={chipVariant}
                custom={i}
                className="flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-px">
                  <X size={10} weight="bold" className="text-red-600" />
                </span>
                <p className="text-[12px] text-red-900/80 leading-snug">{t}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* NO — document and monitor */}
        <motion.div
          variants={fadeUp}
          custom={0.6}
          className="rounded-2xl border border-emerald-200/70 bg-white overflow-hidden h-full flex flex-col"
        >
          <div className="px-4 py-3 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <ClipboardText size={18} weight="duotone" className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-emerald-800 leading-tight">
                Document, monitor, escalate
              </p>
              <p className="text-[10px] text-emerald-500 font-medium uppercase tracking-wide mt-0.5">
                Stays on the record either way
              </p>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-start gap-2.5">
            {STEPS.map((step, i) => (
              <motion.div key={i} variants={stepVariant} custom={i} className="flex items-start gap-2.5">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-px ${
                    step.danger ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {i + 1}
                </span>
                <p
                  className={`text-[12px] leading-snug ${
                    step.danger ? "text-red-700 font-medium" : "text-stone-600"
                  }`}
                >
                  {step.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.p
        variants={fadeUp}
        custom={0.9}
        className="text-[11px] text-stone-400 text-center mt-3 leading-snug"
      >
        The cost of shutting a slide is always less than the cost of an incident.
      </motion.p>
    </motion.div>
  );
}
