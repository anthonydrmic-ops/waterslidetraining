"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { User, UsersThree, Buildings, FirstAid, CaretDown } from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

const LEVELS = [
  {
    icon: User,
    label: "Level 1 - Operator",
    when: "Minor injury, operational issue",
    actions: ["Stop dispatch", "Clear the area", "Basic first aid"],
    color: "#16a34a",
    width: "100%",
  },
  {
    icon: UsersThree,
    label: "Level 2 - Supervisor",
    when: "Significant injury, mechanical failure",
    actions: ["Assess severity", "Coordinate team", "Contact management"],
    color: "#ca8a04",
    width: "88%",
  },
  {
    icon: Buildings,
    label: "Level 3 - Management",
    when: "Serious injury, structural failure",
    actions: ["Facility shutdown", "External notification", "Investigation"],
    color: "#ea580c",
    width: "76%",
  },
  {
    icon: FirstAid,
    label: "Level 4 - Emergency Services",
    when: "Life-threatening, spinal, drowning",
    actions: ["Call 000", "Secure scene", "Preserve evidence"],
    color: "#dc2626",
    width: "64%",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1 + i * 0.16, ease: EASE },
  }),
};

const chipVariant = {
  hidden: { opacity: 0, scale: 0.85 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 360, damping: 24, delay: 0.35 + i * 0.07 },
  }),
};

export function EmergencyResponse() {
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
        Emergency Escalation - The Funnel Narrows By Design
      </p>

      <div className="space-y-1">
        {LEVELS.map((level, i) => {
          const Icon = level.icon;
          const isTop = i === LEVELS.length - 1;
          return (
            <div key={i}>
              <motion.div
                variants={cardVariant}
                custom={i}
                className="mx-auto rounded-2xl border bg-white overflow-hidden"
                style={{ width: level.width, borderColor: `${level.color}38` }}
              >
                <div className="flex items-start gap-3 p-3.5 relative">
                  {/* Accent bar */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full"
                    style={{ background: level.color }}
                  />
                  <div
                    className="relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ml-1"
                    style={{ background: `${level.color}12` }}
                  >
                    {isTop && !reduce && (
                      <span
                        aria-hidden
                        className="ping-ring absolute inset-0 rounded-xl border-2"
                        style={{ borderColor: level.color, animationDelay: "1.4s" }}
                      />
                    )}
                    <Icon size={18} weight="duotone" style={{ color: level.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                      <p className="text-[13px] font-bold leading-tight" style={{ color: level.color }}>
                        {level.label}
                      </p>
                      <p className="text-[10.5px] text-stone-400 italic leading-tight">
                        When: {level.when}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {level.actions.map((action, j) => (
                        <motion.span
                          key={j}
                          variants={chipVariant}
                          custom={i * 3 + j}
                          className="inline-flex items-center gap-1.5 text-[10.5px] font-medium px-2 py-1 rounded-full"
                          style={{ background: `${level.color}10`, color: level.color }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: level.color, opacity: 0.5 }}
                          />
                          {action}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Escalation chevron — pulses in sequence down the funnel */}
              {i < LEVELS.length - 1 && (
                <div className="flex justify-center py-0.5" aria-hidden>
                  <CaretDown
                    size={14}
                    weight="bold"
                    className={reduce ? "opacity-40" : "flow-arrow"}
                    style={{
                      color: LEVELS[i + 1].color,
                      ...(reduce ? {} : { animationDelay: `${i * 0.45}s` }),
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <motion.p
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.5, delay: 0.9 } },
        }}
        className="text-[11px] text-stone-400 text-center mt-3 leading-snug [text-wrap:balance]"
      >
        Severity rises as the funnel narrows - a well-run facility resolves most incidents at
        Level 1, and almost none should ever reach Level 4.
      </motion.p>
    </motion.div>
  );
}
