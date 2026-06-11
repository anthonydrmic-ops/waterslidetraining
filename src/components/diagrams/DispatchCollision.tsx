"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "framer-motion";
import { useEffect } from "react";

// One shared slide geometry, expressed as two cubic Bézier segments so the
// riders can be positioned in JS exactly on the drawn path (no DOM measuring).
const SEG1 = [
  [60, 60],
  [200, 70],
  [250, 190],
  [360, 195],
] as const;
const SEG2 = [
  [360, 195],
  [470, 199],
  [560, 310],
  [660, 300],
] as const;

const PATH_D = "M60 60 C200 70 250 190 360 195 C470 199 560 310 660 300";

function cube(p0: number, p1: number, p2: number, p3: number, u: number) {
  const m = 1 - u;
  return m * m * m * p0 + 3 * m * m * u * p1 + 3 * m * u * u * p2 + u * u * u * p3;
}

// t in [0,1] along the whole slide -> point on the path.
function pointAt(t: number): { x: number; y: number } {
  if (t <= 0.5) {
    const u = t / 0.5;
    return {
      x: cube(SEG1[0][0], SEG1[1][0], SEG1[2][0], SEG1[3][0], u),
      y: cube(SEG1[0][1], SEG1[1][1], SEG1[2][1], SEG1[3][1], u),
    };
  }
  const u = (t - 0.5) / 0.5;
  return {
    x: cube(SEG2[0][0], SEG2[1][0], SEG2[2][0], SEG2[3][0], u),
    y: cube(SEG2[0][1], SEG2[1][1], SEG2[2][1], SEG2[3][1], u),
  };
}

const LOOP = 4.6; // seconds per loop
const COLLISION_PT = pointAt(0.46); // mid, inside the enclosed section

const TEAL = "#1F7A8C";
const ORANGE = "#F05A28";
const NAVY = "#0B3A66";

function Rider({
  progress,
  color,
  letter,
  opacity,
}: {
  progress: ReturnType<typeof useMotionValue<number>>;
  color: string;
  letter: string;
  opacity?: ReturnType<typeof useMotionValue<number>>;
}) {
  const x = useTransform(progress, (p) => pointAt(p).x);
  const y = useTransform(progress, (p) => pointAt(p).y);
  return (
    <motion.g style={{ x, y, opacity }}>
      <circle r="11" fill={color} stroke="#ffffff" strokeWidth="2.5" filter="url(#riderShadow)" />
      <text textAnchor="middle" dy="3.6" fontSize="11" fontWeight="700" fill="#ffffff" fontFamily="system-ui">
        {letter}
      </text>
    </motion.g>
  );
}

function Track({ variant }: { variant: "problem" | "solution" }) {
  const reduce = useReducedMotion();
  const aProg = useMotionValue(variant === "problem" ? 0.46 : 0.5);
  const bProg = useMotionValue(variant === "problem" ? 0.46 : 0.3);
  const aOpacity = useMotionValue(1);

  useEffect(() => {
    if (reduce) return;
    const isProblem = variant === "problem";
    // Light rider (both tracks): decelerates through the rough / enclosed mid.
    // On the solution track it reaches the pool EARLY (t=0.8 of the loop) and
    // then climbs out (fade) — the pool must be empty before the next arrival,
    // and the two riders must never reach the bottom together.
    const ctrlA = animate(
      aProg,
      isProblem ? [0, 0.4, 0.5, 1] : [0, 0.4, 0.5, 1, 1],
      {
        duration: LOOP,
        times: isProblem ? [0, 0.45, 0.62, 1] : [0, 0.45, 0.62, 0.8, 1],
        repeat: Infinity,
        ease: "linear",
      }
    );
    const ctrlAOp = isProblem
      ? null
      : animate(aOpacity, [1, 1, 0, 0], {
          duration: LOOP,
          times: [0, 0.82, 0.92, 1],
          repeat: Infinity,
          ease: "linear",
        });
    // Heavy rider: waits at the top, then constant speed. A short wait (problem)
    // lets it catch the light rider in the blind mid-section; a longer wait
    // (solution) keeps a safe gap and lands in an already-cleared pool.
    const bTimes = isProblem ? [0, 0.16, 1] : [0, 0.34, 1];
    const ctrlB = animate(bProg, [0, 0, 1], {
      duration: LOOP,
      times: bTimes,
      repeat: Infinity,
      ease: "linear",
    });
    return () => {
      ctrlA.stop();
      ctrlAOp?.stop();
      ctrlB.stop();
    };
  }, [variant, reduce, aProg, bProg, aOpacity]);

  const isProblem = variant === "problem";

  return (
    <svg viewBox="0 0 720 360" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="riderShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor={NAVY} floodOpacity="0.25" />
        </filter>
        <pattern id={`hatch-${variant}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke={NAVY} strokeWidth="1" strokeOpacity="0.10" />
        </pattern>
      </defs>

      {/* Enclosed (blind) section over the middle of the run */}
      <rect x="246" y="138" width="232" height="104" rx="16" fill={`url(#hatch-${variant})`} />
      <rect x="246" y="138" width="232" height="104" rx="16" fill="none" stroke={NAVY} strokeOpacity="0.18" strokeWidth="1" strokeDasharray="5 4" />
      <rect x="300" y="126" width="124" height="20" rx="10" fill="#ffffff" stroke={NAVY} strokeOpacity="0.18" strokeWidth="1" />
      <text x="362" y="140" textAnchor="middle" fontSize="9" fontWeight="700" fill={NAVY} fillOpacity="0.6" letterSpacing="0.08em" fontFamily="system-ui">
        ENCLOSED · BLIND
      </text>

      {/* Slide track */}
      <path d={PATH_D} stroke="#e7e5e4" strokeWidth="22" strokeLinecap="round" fill="none" />
      <path d={PATH_D} stroke={TEAL} strokeWidth="22" strokeLinecap="round" fill="none" opacity="0.08" />
      <path d={PATH_D} stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" transform="translate(0,-4)" />

      {/* Launch + catch pool markers */}
      <circle cx="60" cy="60" r="6" fill={NAVY} opacity="0.5" />
      <ellipse cx="668" cy="312" rx="30" ry="11" fill={TEAL} opacity="0.18" />

      <Rider progress={aProg} color={TEAL} letter="L" opacity={aOpacity} />
      <Rider progress={bProg} color={ORANGE} letter="H" />

      {/* Outcome badge */}
      {isProblem ? (
        <motion.g
          initial={false}
          animate={reduce ? { opacity: 1, scale: 1 } : { opacity: [0, 0, 1, 1, 0], scale: [0.6, 0.6, 1.12, 1, 0.95] }}
          transition={reduce ? undefined : { duration: LOOP, times: [0, 0.5, 0.57, 0.66, 0.74], repeat: Infinity, ease: "easeOut" }}
          style={{ x: COLLISION_PT.x, y: COLLISION_PT.y }}
        >
          {/* impact spark — drawn relative to origin so scale pivots on the point */}
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <line
              key={a}
              x1={0}
              y1={0}
              x2={17 * Math.cos((a * Math.PI) / 180)}
              y2={17 * Math.sin((a * Math.PI) / 180)}
              stroke="#dc2626"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
          <rect x={-52} y={-50} width="104" height="24" rx="12" fill="#dc2626" />
          <text x={0} y={-34} textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff" fontFamily="system-ui">
            COLLISION
          </text>
        </motion.g>
      ) : (
        <motion.g
          initial={false}
          animate={reduce ? { opacity: 1 } : { opacity: [0, 0, 1, 1, 0] }}
          transition={reduce ? undefined : { duration: LOOP, times: [0, 0.8, 0.9, 0.97, 1], repeat: Infinity, ease: "easeOut" }}
        >
          <rect x="556" y="232" width="96" height="24" rx="12" fill="#16a34a" />
          <path d="M572 244 l4 4 l7 -8" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text x="612" y="248" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff" fontFamily="system-ui">
            CLEAR
          </text>
        </motion.g>
      )}
    </svg>
  );
}

export function DispatchCollision() {
  return (
    <div className="w-full">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1 text-center">
        Dispatch Timing - Why the Interval Matters
      </p>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mb-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-500">
          <span className="w-3 h-3 rounded-full" style={{ background: TEAL }} />
          Light rider (slower)
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-500">
          <span className="w-3 h-3 rounded-full" style={{ background: ORANGE }} />
          Heavy rider (faster)
        </span>
      </div>

      <div className="space-y-4">
        {/* Problem */}
        <div className="rounded-2xl border border-red-200/60 bg-red-50/40 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-red-100 text-red-600">
              Standard interval
            </span>
            <p className="text-[12px] font-semibold text-stone-700">Not adjusted for weight or surface</p>
          </div>
          <Track variant="problem" />
          <p className="text-[11px] text-stone-500 leading-snug mt-1.5">
            The heavy rider closes the gap and catches the slower light rider inside the blind enclosed section - where neither operator can see it happen.
          </p>
        </div>

        {/* Solution */}
        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              Risk-based interval
            </span>
            <p className="text-[12px] font-semibold text-stone-700">Longer gap for a light-then-heavy pairing</p>
          </div>
          <Track variant="solution" />
          <p className="text-[11px] text-stone-500 leading-snug mt-1.5">
            A longer interval holds a safe separation the whole way down - the light rider has already exited the catch pool before the heavy rider arrives.
          </p>
        </div>
      </div>
    </div>
  );
}
