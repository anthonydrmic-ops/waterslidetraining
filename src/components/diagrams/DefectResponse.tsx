"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Camera, Scales, PhoneCall, Prohibit, ClipboardText, Eye } from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

const STEPS = [
  {
    icon: Camera,
    label: "Report",
    sub: "Location, type, size, photos - immediately",
    color: "#1F7A8C",
  },
  {
    icon: Scales,
    label: "Assess",
    sub: "Immediate shutdown, or monitored operation?",
    color: "#d97706",
  },
  {
    icon: PhoneCall,
    label: "Escalate",
    sub: "Maintenance, supervisor or manufacturer by severity",
    color: "#0B3A66",
  },
];

const RULES = [
  {
    finding: "Structural defect - crack, puncture, fracture",
    action: "Immediate shutdown",
    danger: true,
    icon: Prohibit,
  },
  {
    finding: "Surface defect - chips, scratches, minor scaling",
    action: "Document + schedule maintenance",
    danger: false,
    icon: ClipboardText,
  },
  {
    finding: "Joint - minor sealant wear, no lip or gap",
    action: "Monitor during operation",
    danger: false,
    icon: Eye,
  },
  {
    finding: "Joint - any lip, gap or sharp edge",
    action: "Immediate shutdown",
    danger: true,
    icon: Prohibit,
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.12, ease: EASE },
  }),
};

const rowVariant = {
  hidden: { opacity: 0, x: -10 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: 0.45 + i * 0.1, ease: EASE },
  }),
};

export function DefectResponse() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (reduce || !inView) return;
    let i = -1;
    const id = setInterval(() => {
      i = (i + 1) % (STEPS.length + 1);
      setActive(i === STEPS.length ? -1 : i);
    }, 1400);
    return () => clearInterval(id);
  }, [reduce, inView]);

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Find It, Then Work the Framework
      </p>

      {/* The three steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = active === i;
          return (
            <motion.div
              key={i}
              variants={cardVariant}
              custom={i}
              className="rounded-2xl border bg-white p-3.5 flex items-center gap-3 transition-all duration-500"
              style={{
                borderColor: isActive ? `${step.color}55` : `${step.color}28`,
                boxShadow: isActive ? `0 4px 18px ${step.color}1c` : undefined,
              }}
            >
              <div
                className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500"
                style={{ background: isActive ? `${step.color}1f` : `${step.color}10` }}
              >
                <Icon size={19} weight="duotone" style={{ color: step.color }} />
                <span
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                  style={{ background: step.color }}
                >
                  {i + 1}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-stone-800 leading-tight">{step.label}</p>
                <p className="text-[10.5px] text-stone-400 leading-snug mt-0.5">{step.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Shutdown vs monitor rules */}
      <div className="rounded-2xl border border-stone-200/70 bg-white overflow-hidden">
        {RULES.map((rule, i) => {
          const Icon = rule.icon;
          const color = rule.danger ? "#dc2626" : "#16a34a";
          return (
            <motion.div
              key={i}
              variants={rowVariant}
              custom={i}
              className={`flex items-center gap-3 px-4 py-3 ${
                i < RULES.length - 1 ? "border-b border-stone-100" : ""
              }`}
            >
              <p className="flex-1 text-[11.5px] text-stone-600 leading-snug">{rule.finding}</p>
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0"
                style={{ background: `${color}12`, color }}
              >
                <Icon size={11} weight="fill" />
                {rule.action}
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.5, delay: 0.9 } },
        }}
        className="text-[11px] text-stone-400 text-center mt-3 leading-snug"
      >
        When in doubt, shut down - you will never be criticised for being too cautious.
      </motion.p>
    </motion.div>
  );
}
