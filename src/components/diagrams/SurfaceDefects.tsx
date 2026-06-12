"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;

// Tiles land left to right, matching the severity progression the arrow draws.
const tileVariant = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.16, ease: EASE },
  }),
};

export function SurfaceDefects() {
  const reduce = useReducedMotion();
  // Explicit in-view trigger — see IncidentChain for why inherited whileInView
  // is unreliable inside the lesson page's animation context.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  const defects = [
    {
      label: "Smooth Surface",
      status: "Normal",
      color: "#22c55e",
      desc: "Gelcoat intact, consistent friction",
      photo: "/lesson-images/severity/smooth.jpg",
    },
    {
      label: "Roughening",
      status: "Monitor",
      color: "#eab308",
      desc: "UV degradation, more friction",
      photo: "/lesson-images/severity/roughening.jpg",
    },
    {
      label: "Gelcoat Peeling",
      status: "Action Req.",
      color: "#f97316",
      desc: "Exposed fibreglass, abrasion risk",
      photo: "/lesson-images/severity/peeling.jpg",
    },
    {
      label: "Cracking",
      status: "Shut Down",
      color: "#ef4444",
      desc: "Structural risk, close immediately",
      photo: "/lesson-images/severity/cracking.jpg",
    },
  ];

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Surface Condition Severity Scale
      </p>
      <svg viewBox="0 0 700 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="700" height="220" rx="12" fill="#fafaf9" />

        {/* Severity arrow — draws left to right beneath the landing tiles */}
        <motion.line
          x1="40"
          y1="195"
          x2="660"
          y2="195"
          stroke="#e7e5e4"
          strokeWidth="2"
          variants={{
            hidden: { pathLength: 0 },
            show: { pathLength: 1, transition: { duration: 0.9, delay: 0.1, ease: EASE } },
          }}
        />
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.3, delay: 0.9 } },
          }}
        >
          <path d="M655 189 L668 195 L655 201" fill="#d6d3d1" />
        </motion.g>
        <motion.text
          x="350"
          y="213"
          textAnchor="middle"
          fontSize="10"
          fill="#a8a29e"
          fontFamily="system-ui"
          fontWeight="500"
          letterSpacing="0.1em"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.4, delay: 0.7 } },
          }}
        >
          INCREASING SEVERITY
        </motion.text>

        {defects.map((defect, i) => {
          const x = 22 + i * 168;
          const isShutDown = defect.status === "Shut Down";
          return (
            <motion.g key={i} variants={tileVariant} custom={i}>
              {/* Real reference photo, severity framed in the state's colour */}
              <clipPath id={`sev-clip-${i}`}>
                <rect x={x} y={10} width="140" height="70" rx="8" />
              </clipPath>
              <image
                href={defect.photo}
                x={x}
                y={10}
                width="140"
                height="70"
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#sev-clip-${i})`}
              />
              <rect x={x} y={10} width="140" height="70" rx="8" fill="none" stroke={defect.color} strokeWidth="1.5" opacity="0.55" />
              {/* Status pill — the Shut Down pill breathes gently so the most
                  serious state keeps drawing the eye. */}
              {isShutDown && !reduce ? (
                <rect
                  className="breathe"
                  style={{ animationDelay: "1.2s" }}
                  x={x}
                  y={90}
                  width="140"
                  height="24"
                  rx="12"
                  fill={defect.color}
                />
              ) : (
                <rect x={x} y={90} width="140" height="24" rx="12" fill={defect.color} opacity="0.12" />
              )}
              <text x={x + 70} y={106} textAnchor="middle" fontSize="11" fontWeight="600" fill={defect.color} fontFamily="system-ui">
                {defect.status}
              </text>
              {/* Label */}
              <text x={x + 70} y={132} textAnchor="middle" fontSize="13" fontWeight="700" fill="#44403c" fontFamily="system-ui">
                {defect.label}
              </text>
              {/* Description */}
              <text x={x + 70} y={150} textAnchor="middle" fontSize="10" fill="#a8a29e" fontFamily="system-ui">
                {defect.desc}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
}
