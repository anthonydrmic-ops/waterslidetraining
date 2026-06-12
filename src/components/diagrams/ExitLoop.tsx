"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { RiderGlyph } from "./RiderGlyph";

const EASE = [0.32, 0.72, 0, 1] as const;

// ---- Right side: the closed communication loop ----
const CX = 470;
const CY = 200;
const R = 105;

// Stations around the loop, clockwise from the top. The rider travels down one
// side (top -> exit); the clearance signal travels back up the other. One loop,
// both directions of information. Station order matches the dispatch phases.
const NODES = [
  { angle: -90, title: "Top operator", sub: ["Dispatches only on confirmed clearance"], color: "#0B3A66" },
  { angle: 0, title: "Rider in the flume", sub: ["Travelling - possibly", "out of sight"], color: "#1F7A8C" },
  { angle: 90, title: "Exit operator", sub: ["Pool COMPLETELY clear? In, climbing out, at the edge"], color: "#F05A28" },
  { angle: 180, title: "Clearance signal", sub: ["No signal = no dispatch.", "No workaround."], color: "#16a34a" },
];

function pos(angleDeg: number, radius = R) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
}

// ---- Left side: the slide in operation ----
// Same pseudo-3D helix construction as the inspection diagram, scaled to the
// narrower scene. Water is ON here - this slide is running.
const HELIX = (() => {
  const HCX = 100;
  const RX = 32;
  const Y_TOP = 64;
  const DROP = 272;
  const TURNS = 3;
  const RY = 9;
  const N = 200;
  const point = (t: number) => {
    const th = t * TURNS * Math.PI * 2;
    return {
      x: HCX + RX * Math.sin(th),
      y: Y_TOP + DROP * t + RY * Math.cos(th),
      back: Math.cos(th) < 0,
    };
  };
  const front: string[] = [];
  const back: string[] = [];
  let d = "";
  let wasFront: boolean | null = null;
  let px = 0;
  let py = 0;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const p = point(t);
    const x = +p.x.toFixed(1);
    const y = +p.y.toFixed(1);
    const isFront = !p.back;
    if (wasFront === null) {
      d = `M ${x} ${y}`;
    } else if (isFront !== wasFront) {
      (wasFront ? front : back).push(d);
      d = `M ${px} ${py} L ${x} ${y}`;
    } else {
      d += ` L ${x} ${y}`;
    }
    wasFront = isFront;
    px = x;
    py = y;
  }
  if (d && wasFront !== null) (wasFront ? front : back).push(d);
  return { front, back, point };
})();

// One dispatch cycle - both halves of the diagram run off this clock.
const DISPATCH_MS = 1700;
const RIDE_MS = 3400;
const EXIT_MS = 1900;
const SIGNAL_MS = 2000;
const WRAP_MS = 560;

/** A hi-vis operator with a two-way radio - raised when transmitting. */
function Worker({ radio, helmet }: { radio: boolean; helmet: string }) {
  return (
    <g>
      {/* Legs */}
      <line x1="-1.5" y1="1.5" x2="-2.5" y2="8" stroke="#0B3A66" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="1.5" y1="1.5" x2="2.5" y2="8" stroke="#0B3A66" strokeWidth="2.2" strokeLinecap="round" />
      {/* Hi-vis vest */}
      <rect x="-3.2" y="-6.5" width="6.4" height="9" rx="2.6" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
      <line x1="-3.2" y1="-2.6" x2="3.2" y2="-2.6" stroke="#ffffff" strokeWidth="1.1" />
      {/* Radio arm - raised to the ear when transmitting, at the hip otherwise */}
      {radio ? (
        <g>
          <line x1="2.6" y1="-4.5" x2="5.8" y2="-9.5" stroke="#0B3A66" strokeWidth="2" strokeLinecap="round" />
          <rect x="4.7" y="-13.6" width="2.6" height="5" rx="0.8" fill="#1c1917" />
          <line x1="6" y1="-13.9" x2="6" y2="-15.8" stroke="#1c1917" strokeWidth="1" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <line x1="2.6" y1="-4.5" x2="5.2" y2="-0.6" stroke="#0B3A66" strokeWidth="2" strokeLinecap="round" />
          <rect x="4.1" y="-1.2" width="2.4" height="4.6" rx="0.8" fill="#1c1917" />
        </g>
      )}
      {/* Head + helmet */}
      <circle cx="0" cy="-9.5" r="3.2" fill="#e7b98a" />
      <path d="M -3.4 -10.2 A 3.4 3.4 0 0 1 3.4 -10.2 Z" fill={helmet} />
    </g>
  );
}

const nodeVariant = {
  hidden: { opacity: 0, scale: 0.7 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 20, delay: 0.2 + i * 0.15 },
  }),
};

export function ExitLoop() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // Phase of the dispatch cycle: 0 dispatch, 1 ride, 2 exit check, 3 signal.
  // Indexes straight into NODES so the loop ring highlights in lockstep.
  const [phase, setPhase] = useState(-1);

  // The token on the loop ring
  const angle = useMotionValue(-90);
  const tx = useTransform(angle, (a) => pos(a).x);
  const ty = useTransform(angle, (a) => pos(a).y);

  // The rider on the helix
  const rv = useMotionValue(0);
  const rx = useMotionValue(HELIX.point(0).x);
  const ry = useMotionValue(HELIX.point(0).y - 4);
  const ro = useMotionValue(0);
  const rot = useMotionValue(0);
  const [behind, setBehind] = useState(false);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (reduce || !inView) return;
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => {
        timers.push(setTimeout(res, ms));
      });

    // Rider position derives from the helix parameter - behind the column on
    // the far side, tilted to the local slope of the lane and mirrored when
    // travelling right-to-left, so the figure genuinely rides the flume.
    const place = (t: number) => {
      const p = HELIX.point(t);
      rx.set(p.x);
      ry.set(p.y - 5);
      setBehind(p.back);
      const q = HELIX.point(Math.min(1, t + 0.004));
      let a = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
      let mirrored = false;
      if (a > 90) {
        a -= 180;
        mirrored = true;
      } else if (a < -90) {
        a += 180;
        mirrored = true;
      }
      rot.set(Math.max(-50, Math.min(50, a)));
      setFlip(mirrored);
    };
    const unsub = rv.on("change", place);

    (async () => {
      await wait(800);
      while (alive) {
        // 1. Dispatch: rider appears beside the top operator, cleared to go
        setPhase(0);
        rv.set(0);
        place(0);
        animate(ro, 1, { duration: 0.45, delay: 0.2 });
        await wait(DISPATCH_MS);
        if (!alive) return;

        // 2. The ride: down the helix, one constant run, top to pool
        setPhase(1);
        animate(angle, 0, { duration: 0.55, ease: EASE });
        animate(rv, 1, { duration: RIDE_MS / 1000, ease: "easeInOut" });
        await wait(RIDE_MS);
        if (!alive) return;

        // 3. Exit check: rider lands and climbs out while the exit operator
        //    confirms the pool is completely clear
        setPhase(2);
        animate(angle, 90, { duration: 0.55, ease: EASE });
        animate(ro, 0, { duration: 0.6, delay: 0.5 });
        await wait(EXIT_MS);
        if (!alive) return;

        // 4. Clearance signal: exit operator radios the top - only now may
        //    the next rider go
        setPhase(3);
        animate(angle, 180, { duration: 0.55, ease: EASE });
        await wait(SIGNAL_MS);
        if (!alive) return;

        // Token completes the lap back to the top operator
        animate(angle, 270, { duration: WRAP_MS / 1000, ease: EASE });
        await wait(WRAP_MS + 60);
        if (!alive) return;
        angle.set(-90);
      }
    })();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      unsub();
      [angle, rv, rx, ry, ro, rot].forEach((v) => v.stop());
      setPhase(-1);
    };
  }, [reduce, inView, angle, rv, rx, ry, ro]);

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-2 text-center">
        The Closed Loop - Both Ends Must Participate
      </p>
      <svg viewBox="0 0 760 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="760" height="420" rx="12" fill="#fafaf9" />

        {/* ---- The slide in operation ---- */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.6, ease: EASE, delay: 0.15 } },
          }}
        >
          {/* Back halves of each loop - muted, behind the column */}
          {HELIX.back.map((d, i) => (
            <g key={i}>
              <path d={d} stroke="#e2e8f0" strokeWidth="11" strokeLinecap="round" fill="none" />
              <path d={d} stroke="#f1f5f9" strokeWidth="7" strokeLinecap="round" fill="none" />
            </g>
          ))}

          {/* Centre support column */}
          <rect x="96.5" y="52" width="7" height="332" rx="3.5" fill="#d6d3d1" />
          <rect x="96.5" y="52" width="3" height="332" rx="1.5" fill="#e7e5e4" />

          {/* Rider while on the far side of the column */}
          {!reduce && (
            <motion.g
              style={{ x: rx, y: ry, opacity: ro, visibility: behind ? "visible" : "hidden" }}
            >
              <motion.g style={{ rotate: rot }}>
                <g transform={`${flip ? "scale(-1, 1) " : ""}scale(0.66)`} opacity="0.6">
                  <RiderGlyph color="#1F7A8C" />
                </g>
              </motion.g>
            </motion.g>
          )}

          {/* Catch pool */}
          <ellipse cx="100" cy="358" rx="44" ry="11" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1" />
          {!reduce && <ellipse className="shimmer-fade" cx="100" cy="358" rx="32" ry="7" fill="#ffffff" />}

          {/* Front halves - water running, slide live */}
          {HELIX.front.map((d, i) => (
            <g key={i}>
              <path d={d} stroke="#93c5fd" strokeWidth="13" strokeLinecap="round" fill="none" />
              <path d={d} stroke="#dbeafe" strokeWidth="8.5" strokeLinecap="round" fill="none" />
              {!reduce && (
                <path
                  d={d}
                  className="flow-dash"
                  stroke="#60a5fa"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeDasharray="10 16"
                  fill="none"
                  opacity="0.8"
                />
              )}
            </g>
          ))}

          {/* Launch platform */}
          <rect x="64" y="54" width="62" height="9" rx="3" fill="#e7e5e4" />
          <line x1="68" y1="54" x2="68" y2="43" stroke="#d6d3d1" strokeWidth="2" />
          <line x1="122" y1="54" x2="122" y2="43" stroke="#d6d3d1" strokeWidth="2" />
          <line x1="67" y1="42" x2="123" y2="42" stroke="#d6d3d1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Top operator on the platform */}
          <g transform="translate(78 46)">
            <Worker radio={phase === 3} helmet="#0B3A66" />
          </g>
          {/* Acting highlight while dispatching */}
          {!reduce && phase === 0 && (
            <circle className="svg-ping" cx="78" cy="42" r="13" fill="none" stroke="#0B3A66" strokeWidth="1.5" />
          )}
          {/* Receiving the clearance call */}
          {!reduce && phase === 3 && (
            <circle
              className="svg-ping"
              style={{ animationDelay: "0.5s" }}
              cx="84"
              cy="32"
              r="5"
              fill="none"
              stroke="#16a34a"
              strokeWidth="1.5"
            />
          )}

          {/* Exit operator at the catch pool, facing the water */}
          <g transform="translate(160 347) scale(-1, 1)">
            <Worker radio={phase === 3} helmet="#F05A28" />
          </g>
          {/* Acting highlight while checking the pool */}
          {!reduce && phase === 2 && (
            <circle className="svg-ping" cx="160" cy="343" r="13" fill="none" stroke="#F05A28" strokeWidth="1.5" />
          )}
          {/* Transmitting the clearance call */}
          {!reduce && phase === 3 && (
            <circle className="svg-ping" cx="154" cy="333" r="5" fill="none" stroke="#16a34a" strokeWidth="1.5" />
          )}

          {/* The rider, near side */}
          {reduce ? (
            <g transform={`translate(${HELIX.point(0).x} ${HELIX.point(0).y - 5})`}>
              <g transform="scale(0.78)">
                <RiderGlyph color="#1F7A8C" />
              </g>
            </g>
          ) : (
            <motion.g
              style={{ x: rx, y: ry, opacity: ro, visibility: behind ? "hidden" : "visible" }}
            >
              <motion.g style={{ rotate: rot }}>
                <g transform={`${flip ? "scale(-1, 1) " : ""}scale(0.78)`}>
                  <RiderGlyph color="#1F7A8C" animated />
                </g>
              </motion.g>
            </motion.g>
          )}
        </motion.g>

        {/* ---- The loop ring ---- */}
        <motion.circle
          cx={CX}
          cy={CY}
          r={R}
          stroke="#d6d3d1"
          strokeWidth="2.5"
          strokeDasharray="6 5"
          fill="none"
          variants={{
            hidden: { pathLength: 0 },
            show: { pathLength: 1, transition: { duration: 1.1, ease: EASE } },
          }}
        />

        {/* Direction arrows on the ring */}
        {[-45, 45, 135, 225].map((a) => {
          const p = pos(a);
          return (
            <motion.path
              key={a}
              d="M -4 -5 L 5 0 L -4 5"
              fill="none"
              stroke="#a8a29e"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform={`translate(${p.x} ${p.y}) rotate(${a + 90})`}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { duration: 0.4, delay: 1 } },
              }}
            />
          );
        })}

        {/* Centre label */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.5, delay: 0.8 } },
          }}
        >
          <text x={CX} y={CY - 7} textAnchor="middle" fontSize="13.5" fontWeight="700" fill="#44403c" fontFamily="system-ui">
            No confirmation,
          </text>
          <text x={CX} y={CY + 13} textAnchor="middle" fontSize="14" fontWeight="800" fill="#dc2626" fontFamily="system-ui">
            no dispatch
          </text>
        </motion.g>

        {/* Stations */}
        {NODES.map((node, i) => {
          const p = pos(node.angle);
          const isLeft = node.angle === 180;
          const isRight = node.angle === 0;
          const labelX = isLeft ? p.x - 28 : isRight ? p.x + 28 : p.x;
          const anchor = isLeft ? "end" : isRight ? "start" : "middle";
          const labelY = node.angle === -90 ? p.y - 38 : node.angle === 90 ? p.y + 40 : p.y - 10;
          const active = phase === i;
          return (
            <motion.g
              key={i}
              variants={nodeVariant}
              custom={i}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {/* Soft halo - swells while this station holds the cycle */}
              <motion.circle
                cx={p.x}
                cy={p.y}
                r="21"
                fill={node.color}
                initial={false}
                animate={{ opacity: active ? 0.22 : 0.08 }}
                transition={{ duration: 0.4, ease: EASE }}
              />
              <circle cx={p.x} cy={p.y} r="14" fill="white" stroke={node.color} strokeWidth="2.5" />
              <circle cx={p.x} cy={p.y} r="5.5" fill={node.color} />
              {!reduce && active && (
                <circle className="svg-ping" cx={p.x} cy={p.y} r="14" fill="none" stroke={node.color} strokeWidth="1.5" />
              )}
              <text x={labelX} y={labelY} textAnchor={anchor} fontSize="13" fontWeight="700" fill="#44403c" fontFamily="system-ui">
                {node.title}
              </text>
              {node.sub.map((line, j) => (
                <text
                  key={j}
                  x={labelX}
                  y={labelY + 16 + j * 13}
                  textAnchor={anchor}
                  fontSize="10.5"
                  fill="#78716c"
                  fontFamily="system-ui"
                >
                  {line}
                </text>
              ))}
            </motion.g>
          );
        })}

        {/* Travelling token */}
        {!reduce && (
          <motion.g style={{ x: tx, y: ty }}>
            <circle r="8" fill="#0B3A66" stroke="#ffffff" strokeWidth="2.5" />
            <circle r="3" fill="#ffffff" opacity="0.85" />
          </motion.g>
        )}
      </svg>
      <p className="text-[11px] text-stone-400 text-center mt-1 leading-snug">
        If the loop breaks anywhere - even momentarily - dispatch stops until it is restored.
      </p>
    </motion.div>
  );
}
