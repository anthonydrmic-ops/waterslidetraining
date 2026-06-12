"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  PersonSimpleSwim,
  PersonSimple,
  ArrowDown,
  LinkSimple,
  ArrowsClockwise,
  Baby,
  Package,
  CheckCircle,
  X,
} from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

const PROHIBITED = [
  { icon: PersonSimple, label: "Standing up" },
  { icon: ArrowDown, label: "Head-first" },
  { icon: LinkSimple, label: "Linking riders" },
  { icon: ArrowsClockwise, label: "Deliberate spinning" },
  { icon: Baby, label: "Child on lap" },
  { icon: Package, label: "Objects in the flume" },
];

const chipVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 360, damping: 22, delay: 0.35 + i * 0.09 },
  }),
};

export function RiderRules() {
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
        Position Before Dispatch - Not Corrected Mid-Ride
      </p>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* The one correct position */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
          }}
          className="md:col-span-2 rounded-2xl border border-emerald-200/70 bg-emerald-50/40 p-5 flex flex-col items-center justify-center text-center"
        >
          <div className="relative w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-3">
            {!reduce && (
              <span
                aria-hidden
                className="ping-ring absolute inset-0 rounded-2xl border-2 border-emerald-400"
                style={{ animationDelay: "1s" }}
              />
            )}
            <PersonSimpleSwim size={28} weight="duotone" className="text-emerald-600" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1 flex items-center gap-1">
            <CheckCircle size={12} weight="fill" /> Body slide position
          </p>
          <p className="text-[15px] font-bold text-stone-800 leading-snug">
            Lie back · Feet first
            <br />
            Arms crossed
          </p>
          <p className="text-[10.5px] text-stone-400 leading-snug mt-2 max-w-[24ch]">
            Always per the manufacturer&apos;s manual - raft slides have their own seating
            configurations
          </p>
        </motion.div>

        {/* The six stops */}
        <div className="md:col-span-3 rounded-2xl border border-red-200/60 bg-red-50/30 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-3">
            Intervene immediately
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PROHIBITED.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  variants={chipVariant}
                  custom={i}
                  className="rounded-xl border border-red-200/60 bg-white p-2.5 flex flex-col items-center text-center gap-1.5"
                >
                  <div className="relative w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                    <Icon size={18} weight="duotone" className="text-red-400" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                      <X size={9} weight="bold" className="text-white" />
                    </span>
                  </div>
                  <p className="text-[10.5px] font-semibold text-stone-600 leading-tight">
                    {p.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
          <p className="text-[10.5px] text-red-400 leading-snug mt-3">
            Refusal after clear instruction = no ride. Non-negotiable.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
