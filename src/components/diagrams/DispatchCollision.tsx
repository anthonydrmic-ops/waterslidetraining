"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RiderGlyph } from "./RiderGlyph";

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

// t in [0,1] along the whole slide -> point on the path (curve parameter).
function pointAtParam(t: number): { x: number; y: number } {
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

// Arc-length reparameterisation: the bezier parameter does NOT advance at
// uniform distance, so a "linear" parameter animation visibly speeds up and
// slows down along the curve. This lookup maps an arc fraction (true fraction
// of distance travelled) to the parameter, so constant progress = constant
// on-screen speed.
const ARC_SAMPLES = 200;
const ARC_TABLE: number[] = (() => {
  const cum: number[] = [0];
  let len = 0;
  let prev = pointAtParam(0);
  for (let i = 1; i <= ARC_SAMPLES; i++) {
    const p = pointAtParam(i / ARC_SAMPLES);
    len += Math.hypot(p.x - prev.x, p.y - prev.y);
    cum.push(len);
    prev = p;
  }
  return cum.map((c) => c / len);
})();

function paramForArc(s: number): number {
  if (s <= 0) return 0;
  if (s >= 1) return 1;
  let lo = 0;
  let hi = ARC_SAMPLES;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (ARC_TABLE[mid] < s) lo = mid + 1;
    else hi = mid;
  }
  const s0 = ARC_TABLE[lo - 1];
  const s1 = ARC_TABLE[lo];
  const f = (s - s0) / (s1 - s0);
  return (lo - 1 + f) / ARC_SAMPLES;
}

// Progress values everywhere below are ARC fractions (true distance).
function pointAt(s: number): { x: number; y: number } {
  return pointAtParam(paramForArc(s));
}

// Local slope of the path, so rider figures lie along the slide.
function angleAt(s: number): number {
  const eps = 0.012;
  const a = pointAt(Math.min(Math.max(s, 0), 1 - eps));
  const b = pointAt(Math.min(Math.max(s, 0) + eps, 1));
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

// Problem track choreography: light rider drops at ONE constant speed; just
// before light reaches halfway the heavy rider launches, also at one constant
// (faster) speed, and catches them just before the bottom - stopping just
// behind, never merging. Freeze on impact, danger badge, hold, replay.
const CRASH_T = 0.88; // where the collision happens (just before the bottom)
const CRASH_GAP = 0.034; // heavy stops this far behind (touching, not merged)
const LIGHT_RUN_MS = 3400; // light rider's constant-speed run to the crash point
const HEAVY_LAUNCH_MS = 1620; // heavy launches as light nears halfway (~0.42)
const CRASH_HOLD_MS = 1900; // freeze with the danger badge up
const RESET_BEAT_MS = 450; // empty-slide beat before the replay

const CRASH_PT = pointAt(CRASH_T);

const LOOP = 4.6; // seconds per solution-track loop

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
  const y = useTransform(progress, (p) => pointAt(p).y - 6);
  const rotate = useTransform(progress, (p) => angleAt(p));
  return (
    <motion.g style={{ x, y, opacity }}>
      {/* The figure tilts with the local slope; the label stays upright */}
      <motion.g style={{ rotate }}>
        <RiderGlyph color={color} animated />
      </motion.g>
      <text
        y={-16}
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill={color}
        stroke="#ffffff"
        strokeWidth="3"
        paintOrder="stroke"
        fontFamily="system-ui"
      >
        {letter}
      </text>
    </motion.g>
  );
}

function Track({ variant, active }: { variant: "problem" | "solution"; active: boolean }) {
  const reduce = useReducedMotion();
  const isProblem = variant === "problem";
  // Static (reduced-motion) snapshots: problem = the collision moment; solution
  // = light rider nearly landed while the heavy rider is still held at the top.
  const aProg = useMotionValue(isProblem ? CRASH_T : 0.85);
  const bProg = useMotionValue(isProblem ? CRASH_T - CRASH_GAP : 0);
  const aOpacity = useMotionValue(1);
  const [crashed, setCrashed] = useState(false);

  useEffect(() => {
    // Hold the choreography until the learner has scrolled to the diagram,
    // so the story always plays from the start in front of them.
    if (reduce || !active) return;

    if (isProblem) {
      // Directed sequence with a freeze-frame on impact, looped manually.
      let alive = true;
      const timers: ReturnType<typeof setTimeout>[] = [];
      const wait = (ms: number) =>
        new Promise<void>((res) => {
          timers.push(setTimeout(res, ms));
        });

      (async () => {
        while (alive) {
          aProg.set(0);
          bProg.set(0);
          setCrashed(false);
          // Light rider: one fixed speed, top to crash point.
          animate(aProg, CRASH_T, {
            duration: LIGHT_RUN_MS / 1000,
            ease: "linear",
          });
          // Heavy rider: launches as light nears halfway, then one fixed
          // (faster) speed - arriving at the same moment, just behind.
          await wait(HEAVY_LAUNCH_MS);
          if (!alive) return;
          animate(bProg, CRASH_T - CRASH_GAP, {
            duration: (LIGHT_RUN_MS - HEAVY_LAUNCH_MS) / 1000,
            ease: "linear",
          });
          await wait(LIGHT_RUN_MS - HEAVY_LAUNCH_MS);
          if (!alive) return;
          // Impact: freeze everything, danger up, hold, then replay.
          setCrashed(true);
          await wait(CRASH_HOLD_MS);
          if (!alive) return;
          setCrashed(false);
          await wait(RESET_BEAT_MS);
        }
      })();

      return () => {
        alive = false;
        timers.forEach(clearTimeout);
        aProg.stop();
        bProg.stop();
      };
    }

    // Solution track: light rider rides the whole slide at ONE constant speed
    // and exits the pool; the heavy rider is HELD until light is just before
    // the bottom, then covers the slide at one clearly faster constant speed -
    // landing in an already-empty pool.
    const ctrlA = animate(aProg, [0, 1, 1], {
      duration: LOOP,
      times: [0, 0.6, 1],
      repeat: Infinity,
      ease: "linear",
    });
    const ctrlAOp = animate(aOpacity, [1, 1, 0, 0], {
      duration: LOOP,
      times: [0, 0.66, 0.76, 1],
      repeat: Infinity,
      ease: "linear",
    });
    const ctrlB = animate(bProg, [0, 0, 1, 1], {
      duration: LOOP,
      times: [0, 0.55, 0.91, 1],
      repeat: Infinity,
      ease: "linear",
    });
    return () => {
      ctrlA.stop();
      ctrlAOp.stop();
      ctrlB.stop();
    };
  }, [isProblem, reduce, active, aProg, bProg, aOpacity]);

  const showDanger = isProblem && (crashed || !!reduce);

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

      {/* aOpacity only ever animates on the solution track (pool exit fade);
          on the problem track it stays at 1, so passing it is always safe */}
      <Rider progress={aProg} color={TEAL} letter="L" opacity={aOpacity} />
      <Rider progress={bProg} color={ORANGE} letter="H" />

      {/* Outcome badge */}
      {isProblem ? (
        <motion.g
          initial={false}
          animate={
            showDanger
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.5 }
          }
          transition={{ type: "spring", stiffness: 320, damping: 17 }}
          style={{ x: CRASH_PT.x, y: CRASH_PT.y }}
        >
          {/* Impact spark — drawn relative to origin so scale pivots on the point */}
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
          {/* Danger sign */}
          <g transform="translate(0 -58)">
            <path d="M0 -16 L17 12 L-17 12 Z" fill="#dc2626" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
            <text x="0" y="9" textAnchor="middle" fontSize="15" fontWeight="800" fill="#ffffff" fontFamily="system-ui">
              !
            </text>
          </g>
          <rect x={-52} y={-38} width="104" height="22" rx="11" fill="#dc2626" />
          <text x={0} y={-23} textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff" fontFamily="system-ui">
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  return (
    <div ref={ref} className="w-full">
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
          <Track variant="problem" active={inView} />
          <p className="text-[11px] text-stone-500 leading-snug mt-1.5">
            Dispatched on a fixed interval, the faster heavy rider runs the slower light rider down and hits them at speed near the bottom of the run.
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
          <Track variant="solution" active={inView} />
          <p className="text-[11px] text-stone-500 leading-snug mt-1.5">
            The heavy rider is held at the platform until the light rider is about to land. They are never on the slide together, and the catch pool is already empty when the heavy rider arrives.
          </p>
        </div>
      </div>
    </div>
  );
}
