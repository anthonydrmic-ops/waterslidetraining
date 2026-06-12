"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;

// All three riders launch together every cycle; the surface decides when each
// arrives. Same dispatch, three different outcomes.
const CYCLE = 6; // seconds
const START_X = 100;
const END_X = 590;

const LANES = [
  {
    label: "Smooth - as designed",
    outcome: "Arrives on time",
    color: "#22c55e",
    // travel 3.0s, steady
    keyframes: [START_X, END_X, END_X],
    times: [0, 3 / CYCLE, 1],
  },
  {
    label: "Scaled / rough",
    outcome: "Late - the gap behind closes",
    color: "#eab308",
    // sticks mid-flume, crawls, arrives late at 5.2s
    keyframes: [START_X, 300, 345, END_X, END_X],
    times: [0, 1.6 / CYCLE, 3.4 / CYCLE, 5.2 / CYCLE, 1],
  },
  {
    label: "Freshly polished / waxed",
    outcome: "Early - overshoots the exit",
    color: "#f97316",
    // fast: arrives at 2.1s
    keyframes: [START_X, END_X + 22, END_X + 22],
    times: [0, 2.1 / CYCLE, 1],
  },
];

const rowVariant = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.14, ease: EASE },
  }),
};

export function SurfaceSpeed() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  // Rider positions driven imperatively (the animation path that reliably
  // runs in the field) - all three launch together each cycle and diverge.
  const rider0 = useMotionValue(START_X);
  const rider1 = useMotionValue(START_X);
  const rider2 = useMotionValue(START_X);
  const riders = [rider0, rider1, rider2];

  useEffect(() => {
    if (reduce || !inView) return;
    const ctrls = LANES.map((lane, i) =>
      animate(riders[i], lane.keyframes, {
        duration: CYCLE,
        times: lane.times,
        repeat: Infinity,
        ease: "linear",
        delay: 0.8,
      })
    );
    return () => ctrls.forEach((c) => c.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, inView]);

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Same Dispatch, Three Surfaces - Three Different Rides
      </p>
      <svg viewBox="0 0 700 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="700" height="240" rx="12" fill="#fafaf9" />

        {/* Expected-arrival line */}
        <line x1={END_X} y1="28" x2={END_X} y2="188" stroke="#d6d3d1" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x={END_X} y="20" textAnchor="middle" fontSize="9" fill="#a8a29e" fontFamily="system-ui" fontWeight="600" letterSpacing="0.06em">
          EXIT
        </text>

        {LANES.map((lane, i) => {
          const y = 58 + i * 56;
          return (
            <motion.g key={i} variants={rowVariant} custom={i}>
              {/* Lane */}
              <line x1={START_X - 14} y1={y} x2={620} y2={y} stroke="#e7e5e4" strokeWidth="10" strokeLinecap="round" />
              <line x1={START_X - 14} y1={y} x2={620} y2={y} stroke={lane.color} strokeWidth="10" strokeLinecap="round" opacity="0.08" />

              {/* Labels */}
              <text x="18" y={y - 12} fontSize="11" fontWeight="700" fill="#44403c" fontFamily="system-ui">
                {lane.label}
              </text>
              <text x="18" y={y + 22} fontSize="10" fill={lane.color} fontFamily="system-ui" fontWeight="600">
                {lane.outcome}
              </text>

              {/* Rider */}
              {reduce ? (
                // Static snapshot: mid-cycle divergence
                <circle cx={[460, 320, 560][i]} cy={y} r="9" fill={lane.color} stroke="#ffffff" strokeWidth="2.5" />
              ) : (
                <motion.g style={{ x: riders[i] }}>
                  <circle cx={0} cy={y} r="9" fill={lane.color} stroke="#ffffff" strokeWidth="2.5" />
                </motion.g>
              )}
            </motion.g>
          );
        })}

        {/* Footer */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.5, delay: 0.6 } },
          }}
        >
          <rect x="120" y="206" width="460" height="24" rx="12" fill="#0B3A66" opacity="0.06" />
          <text x="350" y="222" textAnchor="middle" fontSize="11" fill="#78716c" fontFamily="system-ui">
            Variable friction makes assumed travel times - and dispatch timing - unreliable
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
}
