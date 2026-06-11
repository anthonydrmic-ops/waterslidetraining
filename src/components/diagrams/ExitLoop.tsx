"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;

const CX = 350;
const CY = 170;
const R = 108;

// Stations around the loop, clockwise from the top. The rider travels down one
// side (top -> exit); the clearance signal travels back up the other. One loop,
// both directions of information.
const NODES = [
  { angle: -90, title: "Top operator", sub: "Dispatches only on confirmed clearance", color: "#0B3A66" },
  { angle: 0, title: "Rider in the flume", sub: "Travelling - possibly out of sight", color: "#1F7A8C" },
  { angle: 90, title: "Exit operator", sub: "Pool COMPLETELY clear? In, climbing out, at the edge", color: "#F05A28" },
  { angle: 180, title: "Clearance signal", sub: "No signal = no dispatch. No workaround.", color: "#16a34a" },
];

function pos(angleDeg: number, radius = R) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
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

  // The token: one full clockwise lap with a dwell at each station.
  const angle = useMotionValue(-90);
  const tx = useTransform(angle, (a) => pos(a).x);
  const ty = useTransform(angle, (a) => pos(a).y);

  useEffect(() => {
    if (reduce || !inView) return;
    const ctrl = animate(
      angle,
      [-90, -8, 0, 82, 90, 172, 180, 262, 270],
      {
        duration: 8,
        times: [0, 0.16, 0.25, 0.41, 0.5, 0.66, 0.75, 0.91, 1],
        repeat: Infinity,
        ease: "linear",
        delay: 0.9,
      }
    );
    return () => ctrl.stop();
  }, [reduce, inView, angle]);

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
      <svg viewBox="0 0 700 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="700" height="340" rx="12" fill="#fafaf9" />

        {/* Loop ring */}
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
          <text x={CX} y={CY - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="#44403c" fontFamily="system-ui">
            No confirmation,
          </text>
          <text x={CX} y={CY + 12} textAnchor="middle" fontSize="12" fontWeight="700" fill="#dc2626" fontFamily="system-ui">
            no dispatch
          </text>
        </motion.g>

        {/* Stations */}
        {NODES.map((node, i) => {
          const p = pos(node.angle);
          const isLeft = node.angle === 180;
          const isRight = node.angle === 0;
          const labelX = isLeft ? p.x - 22 : isRight ? p.x + 22 : p.x;
          const anchor = isLeft ? "end" : isRight ? "start" : "middle";
          const labelY = node.angle === -90 ? p.y - 30 : node.angle === 90 ? p.y + 36 : p.y - 2;
          return (
            <motion.g
              key={i}
              variants={nodeVariant}
              custom={i}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <circle cx={p.x} cy={p.y} r="13" fill="white" stroke={node.color} strokeWidth="2.5" />
              <circle cx={p.x} cy={p.y} r="5" fill={node.color} />
              <text x={labelX} y={labelY} textAnchor={anchor} fontSize="12" fontWeight="700" fill="#44403c" fontFamily="system-ui">
                {node.title}
              </text>
              <text x={labelX} y={labelY + 15} textAnchor={anchor} fontSize="9.5" fill="#a8a29e" fontFamily="system-ui">
                {node.sub}
              </text>
            </motion.g>
          );
        })}

        {/* Travelling token */}
        {!reduce && (
          <motion.g style={{ x: tx, y: ty }}>
            <circle r="7" fill="#0B3A66" stroke="#ffffff" strokeWidth="2" />
          </motion.g>
        )}
      </svg>
      <p className="text-[11px] text-stone-400 text-center mt-1 leading-snug">
        If the loop breaks anywhere - even momentarily - dispatch stops until it is restored.
      </p>
    </motion.div>
  );
}
