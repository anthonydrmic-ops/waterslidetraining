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

// One shared slide geometry (two cubic Bézier segments) ending at the splash
// pool, so riders can be placed in JS exactly on the drawn path.
const SEG1 = [
  [60, 56],
  [200, 66],
  [250, 180],
  [360, 188],
] as const;
const SEG2 = [
  [360, 188],
  [470, 194],
  [560, 250],
  [628, 262],
] as const;

const PATH_D = "M60 56 C200 66 250 180 360 188 C470 194 560 250 628 262";

function cube(p0: number, p1: number, p2: number, p3: number, u: number) {
  const m = 1 - u;
  return m * m * m * p0 + 3 * m * m * u * p1 + 3 * m * u * u * p2 + u * u * u * p3;
}

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

// Arc-length reparameterisation so constant progress = constant on-screen speed.
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

function pointAt(s: number): { x: number; y: number } {
  return pointAtParam(paramForArc(s));
}

function angleAt(s: number): number {
  const eps = 0.012;
  const a = pointAt(Math.min(Math.max(s, 0), 1 - eps));
  const b = pointAt(Math.min(Math.max(s, 0) + eps, 1));
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

const LAND = pointAt(1); // where the slide meets the pool
const EXIT = { x: 690, y: 250 }; // steps up onto the deck, off to the side
const POOL = { x: 600, y: 286, rx: 78, ry: 24 };

// Problem timing: first rider lands and lingers in the pool; the next rider is
// dispatched and runs down into the occupied pool, colliding at the landing.
const RIDE_MS = 2500; // constant-speed descent of the slide
const A_LINGER_MS = 900; // first rider dawdles in the pool after landing
const B_LAUNCH_MS = 1500; // next rider dispatched while the first is still in
const CRASH_HOLD_MS = 1900; // freeze with the danger badge up
const RESET_BEAT_MS = 450;

const LOOP = 5.0; // solution-track loop seconds

const TEAL = "#1F7A8C";
const ORANGE = "#F05A28";
const NAVY = "#0B3A66";

function Rider({
  progress,
  exit,
  color,
  letter,
  opacity,
}: {
  progress: ReturnType<typeof useMotionValue<number>>;
  exit: ReturnType<typeof useMotionValue<number>>;
  color: string;
  letter: string;
  opacity?: ReturnType<typeof useMotionValue<number>>;
}) {
  // Position = point on the slide, plus an exit translation once in the pool.
  const x = useTransform([progress, exit], ([p, e]: number[]) => pointAt(p).x + e * (EXIT.x - LAND.x));
  const y = useTransform([progress, exit], ([p, e]: number[]) => pointAt(p).y - 6 + e * (EXIT.y - LAND.y));
  // Tilt along the slope while descending; level out once in the pool.
  const rotate = useTransform([progress, exit], ([p, e]: number[]) => (e > 0.02 ? 0 : angleAt(p)));
  // Crossfade from the lying ride pose to a standing walk as the rider climbs
  // out of the pool toward the steps. Riders who never exit keep e at 0, so
  // they stay in the ride pose.
  const lyingOpacity = useTransform(exit, [0, 0.12], [1, 0]);
  const standOpacity = useTransform(exit, [0.05, 0.2], [0, 1]);
  // Lift the standing figure so its feet sit on the deck, not at slide centre.
  const standY = useTransform(standOpacity, [0, 1], [0, -8]);
  return (
    <motion.g style={{ x, y, opacity }}>
      <motion.g style={{ rotate, opacity: lyingOpacity }}>
        <RiderGlyph color={color} animated />
      </motion.g>
      <motion.g style={{ opacity: standOpacity, y: standY }}>
        <StandingRider color={color} />
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

// An upright person mid-stride, for a rider walking out of the pool. Built
// from the SAME vocabulary as RiderGlyph - white underlay, colour-stroke
// limbs at the same weights, skin head under a coloured swim cap - so it
// reads as the same rider now standing rather than a different figure.
function StandingRider({ color }: { color: string }) {
  return (
    <g className="walk-bob" aria-hidden>
      {/* White underlay for contrast (matches RiderGlyph) */}
      <g stroke="#ffffff" strokeLinecap="round" fill="none">
        <path d="M 0 -9 L 0 2" strokeWidth="7.4" />
        <path d="M 0 2 L -3.5 12" strokeWidth="5" />
        <path d="M 0 2 L 4 11" strokeWidth="5" />
      </g>
      <circle cx="0" cy="-13" r="4.6" fill="#ffffff" />
      {/* Legs - one striding forward, same weights as the rider's legs */}
      <path d="M 0 2 L -3.5 12" stroke={color} strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <path d="M 0 2 L 4 11" stroke={color} strokeWidth="2.8" strokeLinecap="round" fill="none" />
      {/* Torso - thick stroke like the rider's reclined torso */}
      <path d="M 0 -9 L 0 2" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Arm swinging forward */}
      <path d="M 0 -6 L 4.4 -1.6" stroke={color} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      {/* Head - skin tone under a coloured swim cap (identical to RiderGlyph) */}
      <circle cx="0" cy="-13" r="3.5" fill="#e7b98a" />
      <path d="M -3.5 -13.6 A 3.5 3.5 0 0 1 3.5 -13.6 Z" fill={color} />
    </g>
  );
}

function Track({ variant, active }: { variant: "problem" | "solution"; active: boolean }) {
  const reduce = useReducedMotion();
  const isProblem = variant === "problem";
  // Static (reduced-motion) snapshots: problem = both riders in the pool at the
  // collision; solution = first rider stepping out as the next lands clear.
  const aProg = useMotionValue(1);
  const aExit = useMotionValue(isProblem ? 0 : 1);
  const aOpacity = useMotionValue(isProblem ? 1 : 0.4);
  const bProg = useMotionValue(isProblem ? 0.97 : 0.86);
  const bExit = useMotionValue(0);
  const [crashed, setCrashed] = useState(false);

  useEffect(() => {
    if (reduce || !active) return;

    if (isProblem) {
      let alive = true;
      const timers: ReturnType<typeof setTimeout>[] = [];
      const wait = (ms: number) =>
        new Promise<void>((res) => {
          timers.push(setTimeout(res, ms));
        });

      (async () => {
        while (alive) {
          aProg.set(0);
          aExit.set(0);
          bProg.set(0);
          setCrashed(false);
          // First rider descends and lands in the pool.
          animate(aProg, 1, { duration: RIDE_MS / 1000, ease: "linear" });
          await wait(RIDE_MS + A_LINGER_MS);
          if (!alive) return;
          // Next rider is dispatched while the first is STILL in the pool.
          animate(bProg, 0.99, { duration: RIDE_MS / 1000, ease: "linear" });
          await wait(RIDE_MS);
          if (!alive) return;
          // Impact in the pool: freeze, danger up, hold, replay.
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

    // Solution: first rider lands, then promptly climbs out of the pool. Only
    // once the pool is clear is the next rider dispatched - landing safely.
    void B_LAUNCH_MS;
    const ctrlAProg = animate(aProg, [0, 1, 1, 1], {
      duration: LOOP,
      times: [0, 0.34, 0.4, 1],
      repeat: Infinity,
      ease: "linear",
    });
    const ctrlAExit = animate(aExit, [0, 0, 1, 1], {
      duration: LOOP,
      times: [0, 0.4, 0.56, 1],
      repeat: Infinity,
      ease: "easeInOut",
    });
    const ctrlAOp = animate(aOpacity, [1, 1, 0, 0], {
      duration: LOOP,
      times: [0, 0.56, 0.62, 1],
      repeat: Infinity,
      ease: "linear",
    });
    const ctrlBProg = animate(bProg, [0, 0, 1, 1], {
      duration: LOOP,
      times: [0, 0.6, 0.94, 1],
      repeat: Infinity,
      ease: "linear",
    });
    return () => {
      ctrlAProg.stop();
      ctrlAExit.stop();
      ctrlAOp.stop();
      ctrlBProg.stop();
    };
  }, [isProblem, reduce, active, aProg, aExit, aOpacity, bProg]);

  const showDanger = isProblem && (crashed || !!reduce);

  return (
    <svg viewBox="0 0 720 340" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Slide track */}
      <path d={PATH_D} stroke="#e7e5e4" strokeWidth="22" strokeLinecap="round" fill="none" />
      <path d={PATH_D} stroke={TEAL} strokeWidth="22" strokeLinecap="round" fill="none" opacity="0.08" />
      <path d={PATH_D} stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" transform="translate(0,-4)" />

      {/* Launch marker */}
      <circle cx="60" cy="56" r="6" fill={NAVY} opacity="0.5" />

      {/* Splash pool */}
      <ellipse cx={POOL.x} cy={POOL.y} rx={POOL.rx} ry={POOL.ry} fill={TEAL} opacity="0.16" />
      <ellipse cx={POOL.x} cy={POOL.y} rx={POOL.rx} ry={POOL.ry} fill="none" stroke={TEAL} strokeOpacity="0.4" strokeWidth="1.5" />
      {!reduce && <ellipse className="shimmer-fade" cx={POOL.x} cy={POOL.y} rx={POOL.rx - 16} ry={POOL.ry - 8} fill="#ffffff" />}

      {/* Exit steps up onto the deck */}
      <g opacity="0.7">
        <rect x="676" y="244" width="30" height="7" rx="2" fill="#d6d3d1" />
        <rect x="682" y="252" width="30" height="7" rx="2" fill="#e7e5e4" />
        <path d="M690 240 l0 -10 M683 232 l14 0" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" />
      </g>
      <text x="691" y="226" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#a8a29e" letterSpacing="0.06em" fontFamily="system-ui">
        EXIT
      </text>

      {/* aExit/aOpacity only move on the solution track; safe to pass either way */}
      <Rider progress={aProg} exit={aExit} color={TEAL} letter="1" opacity={aOpacity} />
      <Rider progress={bProg} exit={bExit} color={ORANGE} letter="2" />

      {/* Outcome badge */}
      {isProblem ? (
        <motion.g
          initial={false}
          animate={showDanger ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 320, damping: 17 }}
          style={{ x: LAND.x, y: LAND.y }}
        >
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
          <g transform="translate(0 -58)">
            <path d="M0 -16 L17 12 L-17 12 Z" fill="#dc2626" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
            <text x="0" y="9" textAnchor="middle" fontSize="15" fontWeight="800" fill="#ffffff" fontFamily="system-ui">
              !
            </text>
          </g>
          <rect x={-58} y={-38} width="116" height="22" rx="11" fill="#dc2626" />
          <text x={0} y={-23} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#ffffff" fontFamily="system-ui">
            POOL COLLISION
          </text>
        </motion.g>
      ) : (
        <motion.g
          initial={false}
          animate={reduce ? { opacity: 1 } : { opacity: [0, 0, 1, 1, 0] }}
          transition={reduce ? undefined : { duration: LOOP, times: [0, 0.84, 0.92, 0.98, 1], repeat: Infinity, ease: "easeOut" }}
        >
          <rect x="548" y="232" width="104" height="24" rx="12" fill="#16a34a" />
          <path d="M564 244 l4 4 l7 -8" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text x="606" y="248" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff" fontFamily="system-ui">
            POOL CLEAR
          </text>
        </motion.g>
      )}
    </svg>
  );
}

export function PoolExitCollision() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  return (
    <div ref={ref} className="w-full">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1 text-center">
        Clear the Pool Before the Next Rider
      </p>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mb-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-500">
          <span className="w-3 h-3 rounded-full" style={{ background: TEAL }} />
          First rider (must clear the pool)
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-500">
          <span className="w-3 h-3 rounded-full" style={{ background: ORANGE }} />
          Next rider (dispatched)
        </span>
      </div>

      <div className="space-y-4">
        {/* Problem */}
        <div className="rounded-2xl border border-red-200/60 bg-red-50/40 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-red-100 text-red-600">
              Pool not cleared
            </span>
            <p className="text-[12px] font-semibold text-stone-700">First rider lingers in the landing zone</p>
          </div>
          <Track variant="problem" active={inView} />
          <p className="text-[11px] text-stone-500 leading-snug mt-1.5">
            The first rider does not leave the splash pool in time. The next rider is dispatched, rides down and lands straight onto them in the landing zone.
          </p>
        </div>

        {/* Solution */}
        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              Pool confirmed clear
            </span>
            <p className="text-[12px] font-semibold text-stone-700">Rider exits before the next is dispatched</p>
          </div>
          <Track variant="solution" active={inView} />
          <p className="text-[11px] text-stone-500 leading-snug mt-1.5">
            The first rider clears the pool and reaches the steps. Only once the exit operator confirms the pool is empty is the next rider dispatched - landing in open water.
          </p>
        </div>
      </div>
    </div>
  );
}
