"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  IdentificationCard,
  Eye,
  MegaphoneSimple,
  Timer,
  ArrowsClockwise,
  CaretRight,
  Warning,
} from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

const STEPS = [
  {
    icon: IdentificationCard,
    label: "Rider Briefing",
    sub: "Confirm rules, position and signals",
    color: "#1F7A8C",
  },
  {
    icon: Eye,
    label: "Clear Check",
    sub: "Catch pool and runout clear?",
    color: "#1F7A8C",
  },
  {
    icon: MegaphoneSimple,
    label: "Dispatch",
    sub: "Give the clear verbal command",
    color: "#16a34a",
  },
  {
    icon: Timer,
    label: "Interval",
    sub: "Enforce minimum spacing",
    color: "#eab308",
  },
  {
    icon: ArrowsClockwise,
    label: "Next Rider",
    sub: "Repeat from step 1",
    color: "#1F7A8C",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: EASE },
  }),
};

export function DispatchFlow() {
  const reduce = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [active, setActive] = useState(-1);

  // Once in view, walk a soft highlight through the steps on a loop — the
  // dispatch sequence is a rhythm, not a list. A rest beat between cycles
  // keeps it calm. Skipped entirely under reduced motion.
  useEffect(() => {
    if (reduce || !started) return;
    // First tick lands after the entrance stagger settles — a deliberate beat.
    let i = -1;
    const id = setInterval(() => {
      i = (i + 1) % (STEPS.length + 1); // the extra beat = no highlight
      setActive(i === STEPS.length ? -1 : i);
    }, 1400);
    return () => clearInterval(id);
  }, [reduce, started]);

  return (
    <motion.div
      className="w-full"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      onViewportEnter={() => setStarted(true)}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-5 text-center">
        Dispatch Sequence - Operational Flow
      </p>

      <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-1">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = active === i;
          return (
            <div key={i} className="flex items-stretch sm:flex-1 sm:flex-col">
              <motion.div
                variants={cardVariant}
                custom={i}
                className="flex-1 rounded-2xl border bg-white p-3.5 flex flex-row sm:flex-col items-center sm:text-center gap-3 sm:gap-2 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
                style={{
                  borderColor: isActive ? `${step.color}59` : `${step.color}33`,
                  boxShadow: isActive ? `0 4px 18px ${step.color}1f` : undefined,
                }}
              >
                <div
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500"
                  style={{ background: isActive ? `${step.color}22` : `${step.color}14` }}
                >
                  {/* Cycling highlight ring */}
                  <motion.span
                    aria-hidden
                    className="absolute -inset-[3px] rounded-[14px] border-2 pointer-events-none"
                    style={{ borderColor: step.color }}
                    initial={false}
                    animate={{ opacity: isActive ? 0.55 : 0, scale: isActive ? 1 : 0.82 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                  <Icon size={22} weight="duotone" style={{ color: step.color }} />
                  <span
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                    style={{ background: step.color }}
                  >
                    {i + 1}
                  </span>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-stone-700 leading-tight">
                    {step.label}
                  </p>
                  <p className="text-[11px] text-stone-400 leading-snug mt-0.5">
                    {step.sub}
                  </p>
                </div>
              </motion.div>

              {/* Connector — always rendered (hidden on the last step) so every
                  card reserves the same space and stays identically sized. */}
              <div className="flex items-center justify-center px-1 sm:py-1 sm:px-0">
                <CaretRight
                  size={16}
                  weight="bold"
                  className={`rotate-90 sm:rotate-0 transition-colors duration-500 ${
                    i === STEPS.length - 1 ? "invisible" : ""
                  } ${isActive ? "text-stone-400" : "text-stone-300"}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Timing callout */}
      <motion.div
        variants={cardVariant}
        custom={STEPS.length}
        className="mt-4 rounded-2xl border border-amber-200/60 bg-amber-50/70 px-4 py-3 flex items-start gap-3"
      >
        <Warning size={18} weight="fill" className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-amber-800 leading-tight">
            Minimum Dispatch Interval
          </p>
          <p className="text-[11px] text-amber-700/80 leading-snug mt-0.5">
            Based on slide length, type and visibility - never rush, and never dispatch on assumed timing alone.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
