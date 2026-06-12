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

// Hand-drawn violation scenes in the same outlined-figure style as the
// correct-position rider, each with a subtle idle motion acting out its
// hazard. (The reduced-motion media block silences all of them.)
const RED = "#ef4444";
const RED_DARK = "#991b1b";
const RED_SOFT = "#fca5a5";

const ART: Record<string, React.ReactNode> = {
  standing: (
    <>
      <path d="M 8 37 H 36" stroke={RED_SOFT} strokeWidth="2" strokeLinecap="round" />
      <g className="viol-wobble">
        <line x1="22" y1="16" x2="22" y2="26" stroke={RED_DARK} strokeWidth="2.6" strokeLinecap="round" />
        <line x1="22" y1="19" x2="16.5" y2="23.5" stroke={RED_DARK} strokeWidth="2.4" strokeLinecap="round" />
        <line x1="22" y1="19" x2="27.5" y2="23.5" stroke={RED_DARK} strokeWidth="2.4" strokeLinecap="round" />
        <line x1="22" y1="26" x2="18.5" y2="35" stroke={RED_DARK} strokeWidth="2.6" strokeLinecap="round" />
        <line x1="22" y1="26" x2="25.5" y2="35" stroke={RED_DARK} strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="22" cy="11.5" r="3.8" fill={RED} stroke={RED_DARK} strokeWidth="1.4" />
      </g>
    </>
  ),
  headfirst: (
    <g className="viol-drift">
      {/* travel is downward: head leads, arms reach past it */}
      <rect x="19" y="6.5" width="2.7" height="9" rx="1.35" fill={RED} stroke={RED_DARK} strokeWidth="1.2" />
      <rect x="22.3" y="6.5" width="2.7" height="9" rx="1.35" fill={RED} stroke={RED_DARK} strokeWidth="1.2" />
      <rect x="16.5" y="14.5" width="11" height="12" rx="5" fill={RED} stroke={RED_DARK} strokeWidth="1.4" />
      <line x1="18" y1="25" x2="15.5" y2="33.5" stroke={RED_DARK} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="26" y1="25" x2="28.5" y2="33.5" stroke={RED_DARK} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="22" cy="31" r="3.9" fill={RED} stroke={RED_DARK} strokeWidth="1.4" />
    </g>
  ),
  linking: (
    <g className="viol-sway">
      <circle cx="13.5" cy="13" r="3.3" fill={RED} stroke={RED_DARK} strokeWidth="1.3" />
      <rect x="9" y="16" width="9" height="10.5" rx="4.2" fill={RED} stroke={RED_DARK} strokeWidth="1.3" />
      <rect x="10.6" y="27" width="2.5" height="7.5" rx="1.25" fill={RED} stroke={RED_DARK} strokeWidth="1.1" />
      <rect x="14" y="27" width="2.5" height="7.5" rx="1.25" fill={RED} stroke={RED_DARK} strokeWidth="1.1" />
      <circle cx="30.5" cy="13" r="3.3" fill={RED} stroke={RED_DARK} strokeWidth="1.3" />
      <rect x="26" y="16" width="9" height="10.5" rx="4.2" fill={RED} stroke={RED_DARK} strokeWidth="1.3" />
      <rect x="27.6" y="27" width="2.5" height="7.5" rx="1.25" fill={RED} stroke={RED_DARK} strokeWidth="1.1" />
      <rect x="31" y="27" width="2.5" height="7.5" rx="1.25" fill={RED} stroke={RED_DARK} strokeWidth="1.1" />
      {/* the link */}
      <line x1="17.5" y1="20.5" x2="26.5" y2="20.5" stroke={RED_DARK} strokeWidth="4.4" strokeLinecap="round" />
      <line x1="17.5" y1="20.5" x2="26.5" y2="20.5" stroke={RED} strokeWidth="2.2" strokeLinecap="round" />
    </g>
  ),
  spinning: (
    <>
      <path d="M 36.5 15 A 16 16 0 0 1 36.5 29" stroke={RED_SOFT} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 7.5 29 A 16 16 0 0 1 7.5 15" stroke={RED_SOFT} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 36.5 29 l -2.6 -3 M 36.5 29 l 3.2 -1.6" stroke={RED_SOFT} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 7.5 15 l 2.6 3 M 7.5 15 l -3.2 1.6" stroke={RED_SOFT} strokeWidth="2" strokeLinecap="round" fill="none" />
      <g className="viol-spin">
        <circle cx="22" cy="12.5" r="3.5" fill={RED} stroke={RED_DARK} strokeWidth="1.3" />
        <rect x="17" y="15.5" width="10" height="11" rx="4.5" fill={RED} stroke={RED_DARK} strokeWidth="1.3" />
        <rect x="18.8" y="27" width="2.6" height="8" rx="1.3" fill={RED} stroke={RED_DARK} strokeWidth="1.1" />
        <rect x="22.6" y="27" width="2.6" height="8" rx="1.3" fill={RED} stroke={RED_DARK} strokeWidth="1.1" />
      </g>
    </>
  ),
  lap: (
    <>
      <circle cx="22" cy="9.5" r="3.8" fill={RED} stroke={RED_DARK} strokeWidth="1.4" />
      <rect x="15" y="13" width="14" height="14" rx="6" fill={RED} stroke={RED_DARK} strokeWidth="1.4" />
      <rect x="17" y="27.5" width="3" height="9" rx="1.5" fill={RED} stroke={RED_DARK} strokeWidth="1.2" />
      <rect x="24" y="27.5" width="3" height="9" rx="1.5" fill={RED} stroke={RED_DARK} strokeWidth="1.2" />
      {/* the child, riding on the lap */}
      <g className="viol-bob">
        <circle cx="22" cy="21.5" r="2.8" fill={RED_SOFT} stroke={RED_DARK} strokeWidth="1.2" />
        <rect x="18.7" y="24" width="6.6" height="7.5" rx="3" fill={RED_SOFT} stroke={RED_DARK} strokeWidth="1.2" />
      </g>
    </>
  ),
  objects: (
    <>
      <circle cx="17" cy="11.5" r="3.5" fill={RED} stroke={RED_DARK} strokeWidth="1.3" />
      <rect x="12" y="14.5" width="10" height="11" rx="4.5" fill={RED} stroke={RED_DARK} strokeWidth="1.3" />
      <rect x="13.8" y="26" width="2.6" height="8.5" rx="1.3" fill={RED} stroke={RED_DARK} strokeWidth="1.1" />
      <rect x="17.6" y="26" width="2.6" height="8.5" rx="1.3" fill={RED} stroke={RED_DARK} strokeWidth="1.1" />
      {/* the loose item, tumbling away */}
      <g className="viol-tumble">
        <rect x="28" y="13" width="6.5" height="10.5" rx="1.8" fill={RED_SOFT} stroke={RED_DARK} strokeWidth="1.3" />
        <line x1="29.6" y1="15.5" x2="32.9" y2="15.5" stroke={RED_DARK} strokeWidth="1.1" strokeLinecap="round" />
      </g>
      <path d="M 27 27.5 l 3.5 3 M 31.5 26 l 2.5 2.2" stroke={RED_SOFT} strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
};

const PROHIBITED = [
  {
    icon: PersonSimple,
    art: "standing",
    label: "Standing up",
    why: "Instant loss of control - falls and head strikes inside a moving flume.",
    action: "Stop them before dispatch. They sit back down, or they don't ride.",
  },
  {
    icon: ArrowDown,
    art: "headfirst",
    label: "Head-first",
    why: "Spinal loading on impact - the position behind the most serious slide injuries.",
    action: "Reposition feet-first before release. No exceptions on body slides.",
  },
  {
    icon: LinkSimple,
    art: "linking",
    label: "Linking riders",
    why: "Creates one heavy, unpredictable mass that travels faster and exits wrong.",
    action: "Separate them at the platform - one rider per dispatch, every time.",
  },
  {
    icon: ArrowsClockwise,
    art: "spinning",
    label: "Deliberate spinning",
    why: "Uncontrolled orientation - riders arrive at bends and the run-out sideways or backwards.",
    action: "Brief them out of it before dispatch; repeat offenders lose the ride.",
  },
  {
    icon: Baby,
    art: "lap",
    label: "Child on lap",
    why: "Children come loose mid-ride. Only permitted where the manual explicitly allows it.",
    action: "Check the ride's manual rules - otherwise the child rides alone or not at all.",
  },
  {
    icon: Package,
    art: "objects",
    label: "Objects in the flume",
    why: "Loose items become projectiles for the rider behind and obstructions in the flume.",
    action: "Everything loose stays at the top - glasses, jewellery, cameras, pockets emptied.",
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
                  {/* Two legs, feet toward travel - swaying from the hip */}
                  <g className={reduce ? undefined : "rider-legs"}>
                    <rect x="-4.2" y="6.5" width="3.6" height="16.5" rx="1.8" fill="#059669" stroke="#065f46" strokeWidth="1.4" />
                    <rect x="0.6" y="6.5" width="3.6" height="16.5" rx="1.8" fill="#059669" stroke="#065f46" strokeWidth="1.4" />
                  </g>
                  {/* Torso / shoulders */}
                  <rect x="-7" y="-8" width="14" height="15" rx="6" fill="#059669" stroke="#065f46" strokeWidth="1.4" />
                  {/* Forearms crossed over the chest - one curve and its exact
                      mirror, crossing at the centreline. Second arm drawn last
                      so it rests on top at the crossing. */}
                  <g className={reduce ? undefined : "rider-arms"}>
                    <path d="M -6.4 -6 Q -1.5 -4.4 4.6 -0.9" stroke="#065f46" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M -6.4 -6 Q -1.5 -4.4 4.6 -0.9" stroke="#059669" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                    <path d="M 6.4 -6 Q 1.5 -4.4 -4.6 -0.9" stroke="#065f46" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M 6.4 -6 Q 1.5 -4.4 -4.6 -0.9" stroke="#059669" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                  </g>
                  {/* Head - a gentle bob */}
                  <g className={reduce ? undefined : "rider-head"}>
                    <circle cx="0" cy="-13" r="4.5" fill="#059669" stroke="#065f46" strokeWidth="1.4" />
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
              {PROHIBITED.map((p, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="relative w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 44 44" className="w-7 h-7" aria-hidden>
                      {ART[p.art]}
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-stone-700 leading-tight">{p.label}</p>
                    <p className="text-[10.5px] text-stone-400 leading-snug">{p.why}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="relative flex-1 p-5 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="flex items-center gap-4"
                  >
                    <div className="relative w-[72px] h-[72px] rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 44 44" className="w-[58px] h-[58px]" aria-hidden>
                        {ART[current.art]}
                      </svg>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                        <X size={11} weight="bold" className="text-white" />
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[17px] font-bold text-stone-800 leading-tight">
                        {current.label}
                      </p>
                      <p className="text-[12.5px] text-stone-500 leading-relaxed mt-1.5">
                        {current.why}
                      </p>
                      <p className="text-[12px] leading-snug mt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 mr-1.5">
                          Your move
                        </span>
                        <span className="text-stone-700 font-medium">{current.action}</span>
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
