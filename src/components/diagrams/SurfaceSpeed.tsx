"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { RiderGlyph } from "./RiderGlyph";

const EASE = [0.32, 0.72, 0, 1] as const;

// All three riders launch together every cycle; the surface decides when each
// arrives. Same dispatch, three constant speeds, three different outcomes.
const START_X = 100;
const END_X = 590;

const LANES = [
  {
    label: "Smooth - as designed",
    outcome: "Arrives on time",
    color: "#22c55e",
    target: END_X,
    travel: 3.0, // seconds, one constant speed
  },
  {
    label: "Scaled / rough",
    outcome: "Late - the gap behind closes",
    color: "#eab308",
    target: END_X,
    travel: 4.6, // slower constant speed - arrives late
  },
  {
    label: "Freshly polished / waxed",
    outcome: "Early - overshoots the exit",
    color: "#f97316",
    target: END_X + 24, // carries past the exit line
    travel: 2.2, // faster constant speed - arrives early
  },
];

const SLOWEST_MS = 4600;
const HOLD_MS = 900; // all landed - let the divergence read
const FADE_MS = 400; // fade out together, reset, fade back in

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
  // runs in the field). Each cycle: fade in at the start line, all three
  // launch together at their own constant speeds, hold once the slowest has
  // landed so the divergence reads, then fade out together and replay - no
  // teleporting back to the start.
  const rider0 = useMotionValue(START_X);
  const rider1 = useMotionValue(START_X);
  const rider2 = useMotionValue(START_X);
  const riders = [rider0, rider1, rider2];
  const fade = useMotionValue(0);

  useEffect(() => {
    if (reduce || !inView) return;
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => {
        timers.push(setTimeout(res, ms));
      });

    (async () => {
      await wait(600); // let the lanes' entrance settle first
      while (alive) {
        riders.forEach((r) => r.set(START_X));
        animate(fade, 1, { duration: 0.25 });
        LANES.forEach((lane, i) =>
          animate(riders[i], lane.target, { duration: lane.travel, ease: "linear" })
        );
        await wait(SLOWEST_MS + HOLD_MS);
        if (!alive) return;
        animate(fade, 0, { duration: FADE_MS / 1000 });
        await wait(FADE_MS + 150);
      }
    })();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      [...riders, fade].forEach((v) => v.stop());
    };
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

              {/* Rider — a little person in the taught position, feet first */}
              {reduce ? (
                // Static snapshot: mid-cycle divergence
                <g transform={`translate(${[460, 320, 560][i]} ${y - 2})`}>
                  <RiderGlyph color={lane.color} />
                </g>
              ) : (
                <motion.g style={{ x: riders[i], opacity: fade }}>
                  <g transform={`translate(0 ${y - 2})`}>
                    <RiderGlyph color={lane.color} animated />
                  </g>
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
