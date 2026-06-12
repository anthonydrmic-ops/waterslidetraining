"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { CalendarCheck, CalendarBlank, UserGear, Detective } from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

const TIERS = [
  {
    icon: CalendarCheck,
    label: "Routine",
    freq: "Every operating day",
    who: "Facility staff",
    desc: "Obvious hazards: wear, damage, foreign objects, joints, flow, signage",
    color: "#22c55e",
  },
  {
    icon: CalendarBlank,
    label: "Periodic",
    freq: "Monthly / quarterly / yearly",
    who: "Facility staff",
    desc: "Wear, corrosion, bolt torque, pump performance, component lifecycle",
    color: "#eab308",
  },
  {
    icon: UserGear,
    label: "Thorough",
    freq: "Set intervals",
    who: "Competent professional",
    desc: "All components for wear, structural degradation, corrosion, cracking - NDT if needed",
    color: "#f97316",
  },
  {
    icon: Detective,
    label: "Structural",
    freq: "When damage is suspected",
    who: "Specialist",
    desc: "Determines whether the structure is adequate to keep operating",
    color: "#ef4444",
  },
];

const rowVariant = {
  hidden: { opacity: 0, x: -14 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: 0.1 + i * 0.16, ease: EASE },
  }),
};

export function InspectionTiers() {
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
        Four Inspection Tiers - Increasing Depth and Qualification
      </p>
      <div className="relative">
        {/* Depth rail */}
        <motion.div
          aria-hidden
          variants={{
            hidden: { scaleY: 0 },
            show: { scaleY: 1, transition: { duration: 0.9, ease: EASE } },
          }}
          className="absolute left-[19px] top-4 bottom-4 w-px origin-top"
          style={{
            background: "linear-gradient(180deg, #22c55e, #eab308, #f97316, #ef4444)",
          }}
        >
          {/* Probe dot stepping down the tiers - inspection going deeper */}
          {!reduce && <span className="tier-probe" aria-hidden />}
        </motion.div>
        <div className="space-y-2.5">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <motion.div key={i} variants={rowVariant} custom={i} className="flex items-start gap-3">
                <div
                  className="relative z-10 w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center shrink-0"
                  style={{ borderColor: tier.color }}
                >
                  <Icon size={18} weight="duotone" style={{ color: tier.color }} />
                </div>
                <div
                  className="flex-1 rounded-2xl border bg-white p-3.5"
                  style={{ borderColor: `${tier.color}30` }}
                >
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                    <p className="text-[13px] font-bold text-stone-800">{tier.label}</p>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${tier.color}14`, color: tier.color }}
                    >
                      {tier.freq}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                      {tier.who}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-snug">{tier.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <p className="text-[11px] text-stone-400 text-center mt-3 leading-snug">
        Daily checks catch the obvious - they never replace the deeper tiers.
      </p>
    </motion.div>
  );
}
