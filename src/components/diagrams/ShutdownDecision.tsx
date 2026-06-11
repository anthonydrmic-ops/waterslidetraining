"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Prohibit, ClipboardText, MagnifyingGlass } from "@phosphor-icons/react";

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

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: d, ease: EASE },
  }),
};

const chipVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 380, damping: 24, delay: 0.55 + i * 0.06 },
  }),
};

export function ShutdownDecision() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        The Shutdown Decision - No Grey Zone
      </p>

      {/* Condition found */}
      <motion.div
        variants={fadeUp}
        custom={0}
        className="rounded-2xl border border-stone-200/80 bg-white p-3.5 flex items-center gap-3 max-w-sm mx-auto"
      >
        <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
          <MagnifyingGlass size={18} weight="duotone" className="text-stone-500" />
        </div>
        <p className="text-[13px] font-semibold text-stone-700">
          You find a condition or defect. Is it on the list?
        </p>
      </motion.div>

      {/* Branch connectors */}
      <motion.div
        variants={fadeUp}
        custom={0.2}
        className="flex justify-center gap-24 my-1.5"
        aria-hidden
      >
        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Yes ↓</span>
        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">No ↓</span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* YES — immediate shutdown */}
        <motion.div
          variants={fadeUp}
          custom={0.35}
          className="rounded-2xl border border-red-200/70 bg-red-50/50 p-4"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="relative w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              {!reduce && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-xl border-2 border-red-400"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: [0.5, 0], scale: [1, 1.45] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 1.4 }}
                />
              )}
              <Prohibit size={18} weight="fill" className="text-red-600" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-red-700 leading-tight">
                Shut down immediately
              </p>
              <p className="text-[10px] text-red-400 font-medium uppercase tracking-wide">
                No exceptions · no &quot;monitoring it for a while&quot;
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TRIGGERS.map((t, i) => (
              <motion.span
                key={i}
                variants={chipVariant}
                custom={i}
                className="text-[10.5px] font-medium px-2 py-1 rounded-full bg-white border border-red-200/60 text-red-700"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* NO — document and monitor */}
        <motion.div
          variants={fadeUp}
          custom={0.5}
          className="rounded-2xl border border-emerald-200/70 bg-emerald-50/40 p-4"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <ClipboardText size={18} weight="duotone" className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-emerald-800 leading-tight">
                Document, monitor, escalate
              </p>
              <p className="text-[10px] text-emerald-500 font-medium uppercase tracking-wide">
                Stays on the record either way
              </p>
            </div>
          </div>
          <ul className="space-y-1.5 text-[11.5px] text-emerald-900/70 leading-snug">
            <li>· Record it in the inspection log with location and photos</li>
            <li>· Keep watching it through the day - conditions change</li>
            <li>· Escalate to maintenance for assessment and scheduling</li>
            <li>· If it worsens toward any trigger on the left: shut down</li>
          </ul>
        </motion.div>
      </div>

      <motion.p
        variants={fadeUp}
        custom={0.7}
        className="text-[11px] text-stone-400 text-center mt-3 leading-snug"
      >
        The cost of shutting a slide is always less than the cost of an incident.
      </motion.p>
    </motion.div>
  );
}
