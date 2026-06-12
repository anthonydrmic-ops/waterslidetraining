"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
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
const CYCLE_MS = 3400;

const PROHIBITED = [
  {
    icon: PersonSimple,
    label: "Standing up",
    why: "Instant loss of control - falls and head strikes inside a moving flume.",
  },
  {
    icon: ArrowDown,
    label: "Head-first",
    why: "Spinal loading on impact - the position behind the most serious slide injuries.",
  },
  {
    icon: LinkSimple,
    label: "Linking riders",
    why: "Creates one heavy, unpredictable mass that travels faster and exits wrong.",
  },
  {
    icon: ArrowsClockwise,
    label: "Deliberate spinning",
    why: "Uncontrolled orientation - riders arrive at bends and the run-out sideways or backwards.",
  },
  {
    icon: Baby,
    label: "Child on lap",
    why: "Children come loose mid-ride. Only permitted where the manual explicitly allows it.",
  },
  {
    icon: Package,
    label: "Objects in the flume",
    why: "Loose items become projectiles for the rider behind and obstructions in the flume.",
  },
];

export function RiderRules() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [idx, setIdx] = useState(0);
  // Bumped on manual selection so the auto-cycle timer restarts from zero.
  const [bump, setBump] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % PROHIBITED.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [reduce, inView, bump]);

  const current = PROHIBITED[idx];
  const CurrentIcon = current.icon;

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
          {/* Top-down mini flume: water flowing, a rider in the taught
              position sliding down on a loop - the rule, demonstrated */}
          <div className="relative w-[86px] h-[134px] mb-3" aria-hidden>
            <svg viewBox="0 0 90 140" className="w-full h-full">
              {/* Flume channel, top-down */}
              <rect x="25" y="4" width="40" height="132" rx="20" fill="#dbeafe" stroke="#93c5fd" strokeWidth="2" />
              {/* Water flow — darker blue, reading clearly as moving water */}
              <path
                className={reduce ? undefined : "flow-dash-return"}
                d="M36 12 V 128"
                stroke="#0369a1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="5 11"
                opacity="0.7"
                fill="none"
              />
              <path
                className={reduce ? undefined : "flow-dash-return"}
                d="M54 12 V 128"
                stroke="#0369a1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="5 11"
                opacity="0.7"
                fill="none"
                style={reduce ? undefined : { animationDelay: "0.4s" }}
              />
              {/* Rider, top-down: head up-screen, arms crossed, feet first */}
              <g
                className={reduce ? undefined : "slide-rider"}
                style={reduce ? { transform: "translateY(42px)" } : undefined}
              >
                <g transform="translate(45 26)">
                  {/* Legs together, feet toward travel - swaying from the hip */}
                  <g className={reduce ? undefined : "rider-legs"}>
                    <rect x="-3.5" y="7" width="7" height="16" rx="3.5" fill="#059669" />
                  </g>
                  {/* Torso / shoulders */}
                  <rect x="-7" y="-8" width="14" height="15" rx="6" fill="#059669" />
                  {/* Arms crossed over the chest - shifting with the water */}
                  <g className={reduce ? undefined : "rider-arms"}>
                    <path d="M -4.5 -4 L 4.5 1 M 4.5 -4 L -4.5 1" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  </g>
                  {/* Head - a gentle bob */}
                  <g className={reduce ? undefined : "rider-head"}>
                    <circle cx="0" cy="-13" r="4.5" fill="#059669" />
                  </g>
                </g>
              </g>
            </svg>
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

        {/* The six stops — one at a time, cycling */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.12, ease: EASE } },
          }}
          className="md:col-span-3 rounded-2xl border border-red-200/60 bg-white overflow-hidden flex flex-col"
        >
          <div className="px-4 py-2.5 bg-red-50/70 border-b border-red-100 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">
              Intervene immediately
            </p>
            <span className="text-[10px] font-mono text-red-400">
              {idx + 1} / {PROHIBITED.length}
            </span>
          </div>

          {reduce ? (
            /* Reduced motion: no auto-cycling content — show the full list */
            <div className="p-4 space-y-2.5">
              {PROHIBITED.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="relative w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                      <Icon size={15} weight="duotone" className="text-red-400" />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-stone-700 leading-tight">{p.label}</p>
                      <p className="text-[10.5px] text-stone-400 leading-snug">{p.why}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <div className="relative flex-1 p-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="flex items-start gap-4"
                  >
                    <div className="relative w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                      <CurrentIcon size={28} weight="duotone" className="text-red-400" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                        <X size={11} weight="bold" className="text-white" />
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold text-stone-800 leading-tight">
                        {current.label}
                      </p>
                      <p className="text-[12px] text-stone-500 leading-relaxed mt-1.5">
                        {current.why}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Cycle progress — refills each time the behaviour changes */}
                <span
                  key={`progress-${idx}-${bump}`}
                  className="cycle-progress absolute bottom-0 left-0 h-[2px] bg-red-300"
                  style={{ animationDuration: `${CYCLE_MS}ms` }}
                  aria-hidden
                />
              </div>

              {/* Behaviour tabs — jump anywhere; the timer restarts */}
              <div className="px-4 pb-3.5 flex items-center gap-1.5">
                {PROHIBITED.map((p, i) => {
                  const Icon = p.icon;
                  const active = i === idx;
                  return (
                    <button
                      key={i}
                      type="button"
                      title={p.label}
                      onClick={() => {
                        setIdx(i);
                        setBump((b) => b + 1);
                      }}
                      className={`flex-1 h-9 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                        active
                          ? "bg-red-500 border-red-500"
                          : "bg-red-50/50 border-red-100 hover:border-red-200"
                      }`}
                    >
                      <Icon
                        size={16}
                        weight="duotone"
                        className={active ? "text-white" : "text-red-300"}
                      />
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <p className="px-4 pb-3 text-[10.5px] text-red-400 leading-snug">
            Refusal after clear instruction = no ride. Non-negotiable.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
