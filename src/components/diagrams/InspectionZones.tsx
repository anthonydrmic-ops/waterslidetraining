"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;

// Zones reveal top-to-bottom in inspection order — the same way you walk the
// slide. Dot pops first, then the card slides in beside it.
const dotVariant = {
  hidden: { opacity: 0, scale: 0 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 340,
      damping: 20,
      delay: i * 0.22,
    },
  }),
};

const cardVariant = {
  hidden: { opacity: 0, x: -10 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: 0.08 + i * 0.22, ease: EASE },
  }),
};

export function InspectionZones() {
  const reduce = useReducedMotion();
  // Explicit in-view trigger — see IncidentChain for why inherited whileInView
  // is unreliable inside the lesson page's animation context.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const zones = [
    { label: "Launch Area", color: "#ef4444", items: ["Platform condition", "Non-slip surface", "Handrails secure"], y: 20 },
    { label: "Upper Flume", color: "#f97316", items: ["Joint seals intact", "Water flow rate", "Surface smoothness"], y: 100 },
    { label: "Mid Section", color: "#eab308", items: ["Support stability", "Flume alignment", "No debris"], y: 180 },
    { label: "Run-out / Exit", color: "#22c55e", items: ["Deceleration clear", "Splash padding", "Exit path open"], y: 260 },
    { label: "Catch Pool", color: "#1F7A8C", items: ["Water depth correct", "Drain covers secure", "Water clarity OK"], y: 340 },
  ];

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Pre-Opening Inspection Zones
      </p>
      <svg viewBox="0 0 700 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="700" height="420" rx="12" fill="#fafaf9" />

        {/* Slide silhouette */}
        <path
          d="M70 40 C90 40, 100 60, 105 100 C115 180, 108 220, 100 260 C92 300, 88 330, 90 360 L90 400"
          stroke="#e7e5e4"
          strokeWidth="18"
          strokeLinecap="round"
          fill="none"
        />

        {zones.map((zone, i) => (
          <g key={i}>
            {/* Dot on slide */}
            <motion.g
              variants={dotVariant}
              custom={i}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <circle cx="95" cy={zone.y + 30} r="9" fill="white" stroke={zone.color} strokeWidth="2.5" />
              <circle cx="95" cy={zone.y + 30} r="3.5" fill={zone.color} />
            </motion.g>

            {/* Perpetual sonar ping running down the checkpoints in order —
                the inspection sweep, repeating. Off under reduced motion. */}
            {!reduce && (
              <motion.circle
                cx="95"
                cy={zone.y + 30}
                r="9"
                fill="none"
                stroke={zone.color}
                strokeWidth="2"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 1.6 + i * 0.5,
                  repeatDelay: 2.6,
                }}
              />
            )}

            <motion.g variants={cardVariant} custom={i}>
              {/* Connector */}
              <line x1="108" y1={zone.y + 30} x2="148" y2={zone.y + 30} stroke={zone.color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />

              {/* Zone card */}
              <rect x="148" y={zone.y} width="530" height="62" rx="10" fill="white" stroke={zone.color} strokeWidth="1" opacity="0.25" />
              <rect x="148" y={zone.y} width="530" height="62" rx="10" fill={zone.color} opacity="0.03" />

              {/* Zone number */}
              <rect x="160" y={zone.y + 13} width="36" height="36" rx="8" fill={zone.color} opacity="0.12" />
              <text x="178" y={zone.y + 37} textAnchor="middle" fontSize="16" fontWeight="700" fill={zone.color} fontFamily="system-ui">
                {i + 1}
              </text>

              {/* Zone label */}
              <text x="210" y={zone.y + 26} fontSize="14" fontWeight="700" fill="#44403c" fontFamily="system-ui">
                {zone.label}
              </text>

              {/* Checklist items */}
              {zone.items.map((item, j) => (
                <g key={j}>
                  <circle cx={215 + j * 170} cy={zone.y + 46} r="3.5" fill="none" stroke={zone.color} strokeWidth="1.5" />
                  <text x={224 + j * 170} y={zone.y + 50} fontSize="11" fill="#78716c" fontFamily="system-ui">
                    {item}
                  </text>
                </g>
              ))}
            </motion.g>
          </g>
        ))}
      </svg>
    </motion.div>
  );
}
