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
      status: "Action Required",
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
      <svg viewBox="0 0 700 572" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="700" height="572" rx="12" fill="#fafaf9" />

        {/* 2x2 grid, severity climbing in reading order */}
        {defects.map((defect, i) => {
          const x = 22 + (i % 2) * 338;
          const y = 14 + Math.floor(i / 2) * 262;
          const isShutDown = defect.status === "Shut Down";
          return (
            <motion.g key={i} variants={tileVariant} custom={i}>
              {/* Real reference photo, severity framed in the state's colour */}
              <clipPath id={`sev-clip-${i}`}>
                <rect x={x} y={y} width="320" height="170" rx="10" />
              </clipPath>
              <image
                href={defect.photo}
                x={x}
                y={y}
                width="320"
                height="170"
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#sev-clip-${i})`}
              />
              <rect x={x} y={y} width="320" height="170" rx="10" fill="none" stroke={defect.color} strokeWidth="1.5" opacity="0.55" />
              {/* Severity step number on the photo */}
              <rect x={x + 10} y={y + 10} width="26" height="26" rx="8" fill={defect.color} />
              <text x={x + 23} y={y + 28} textAnchor="middle" fontSize="14" fontWeight="700" fill="#ffffff" fontFamily="system-ui">
                {i + 1}
              </text>
              {/* Status pill — the Shut Down pill breathes gently so the most
                  serious state keeps drawing the eye. */}
              {isShutDown && !reduce ? (
                <rect
                  className="breathe"
                  style={{ animationDelay: "1.2s" }}
                  x={x + 85}
                  y={y + 180}
                  width="150"
                  height="26"
                  rx="13"
                  fill={defect.color}
                />
              ) : (
                <rect x={x + 85} y={y + 180} width="150" height="26" rx="13" fill={defect.color} opacity="0.12" />
              )}
              <text x={x + 160} y={y + 197} textAnchor="middle" fontSize="12" fontWeight="600" fill={defect.color} fontFamily="system-ui">
                {defect.status}
              </text>
              {/* Label */}
              <text x={x + 160} y={y + 227} textAnchor="middle" fontSize="15" fontWeight="700" fill="#44403c" fontFamily="system-ui">
                {defect.label}
              </text>
              {/* Description */}
              <text x={x + 160} y={y + 246} textAnchor="middle" fontSize="11" fill="#a8a29e" fontFamily="system-ui">
                {defect.desc}
              </text>
            </motion.g>
          );
        })}

        {/* Severity arrow — draws left to right beneath the grid */}
        <motion.line
          x1="40"
          y1="540"
          x2="652"
          y2="540"
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
          <path d="M647 534 L660 540 L647 546" fill="#d6d3d1" />
        </motion.g>
        <motion.text
          x="350"
          y="560"
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
          1 TO 4 - INCREASING SEVERITY
        </motion.text>
      </svg>
    </motion.div>
  );
}
