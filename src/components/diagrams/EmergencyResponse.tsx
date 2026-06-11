"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;

// Levels cascade in top-to-bottom, mirroring how an incident escalates.
const levelVariant = {
  hidden: { opacity: 0, x: -14 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: 0.15 + i * 0.18, ease: EASE },
  }),
};

const arrowVariant = {
  hidden: { opacity: 0 },
  show: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.4, delay: 0.45 + i * 0.18, ease: EASE },
  }),
};

export function EmergencyResponse() {
  // Explicit in-view trigger — see IncidentChain for why inherited whileInView
  // is unreliable inside the lesson page's animation context.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const levels = [
    {
      label: "Level 1 - Operator",
      color: "#22c55e",
      actions: ["Stop dispatch", "Clear the area", "Basic first aid"],
      when: "Minor injury, operational issue",
    },
    {
      label: "Level 2 - Supervisor",
      color: "#eab308",
      actions: ["Assess severity", "Coordinate team", "Contact management"],
      when: "Significant injury, mechanical failure",
    },
    {
      label: "Level 3 - Management",
      color: "#f97316",
      actions: ["Facility shutdown", "External notification", "Investigation"],
      when: "Serious injury, structural failure",
    },
    {
      label: "Level 4 - Emergency Services",
      color: "#ef4444",
      actions: ["Call 000", "Secure scene", "Preserve evidence"],
      when: "Life-threatening, spinal, drowning",
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
        Emergency Escalation Hierarchy
      </p>
      <svg viewBox="0 0 700 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="700" height="420" rx="12" fill="#fafaf9" />

        {/* Pyramid background */}
        <path d="M350 25 L590 385 L110 385 Z" fill="#f5f5f4" stroke="#e7e5e4" strokeWidth="1" />

        {levels.map((level, i) => {
          const y = 50 + i * 88;
          const indent = 15 + i * 32;
          const width = 480 - indent * 2;
          const x = 110 + indent;

          return (
            <g key={i}>
              <motion.g variants={levelVariant} custom={i}>
                {/* Level bar */}
                <rect x={x} y={y} width={width} height="72" rx="10" fill="white" stroke={level.color} strokeWidth="1.5" />
                <rect x={x} y={y} width="6" height="72" rx="3" fill={level.color} />

                {/* Level label */}
                <text x={x + 22} y={y + 22} fontSize="13" fontWeight="700" fill={level.color} fontFamily="system-ui">
                  {level.label}
                </text>

                {/* When text */}
                <text x={x + 22} y={y + 38} fontSize="10" fill="#a8a29e" fontFamily="system-ui" fontStyle="italic">
                  When: {level.when}
                </text>

                {/* Actions */}
                {level.actions.map((action, j) => {
                  const actionX = x + 22 + j * (width / 3 - 5);
                  return (
                    <g key={j}>
                      <circle cx={actionX} cy={y + 56} r="3.5" fill={level.color} opacity="0.25" />
                      <text x={actionX + 8} y={y + 60} fontSize="10" fill="#57534e" fontFamily="system-ui">
                        {action}
                      </text>
                    </g>
                  );
                })}
              </motion.g>

              {/* Down arrow */}
              {i < levels.length - 1 && (
                <motion.g variants={arrowVariant} custom={i}>
                  <line x1="350" y1={y + 74} x2="350" y2={y + 86} stroke={level.color} strokeWidth="1.5" opacity="0.4" />
                  <path d={`M345 ${y + 83} L350 ${y + 90} L355 ${y + 83}`} fill={level.color} opacity="0.4" />
                </motion.g>
              )}
            </g>
          );
        })}

        {/* Severity arrow — draws downward as the levels land */}
        <motion.line
          x1="88"
          y1="60"
          x2="88"
          y2="385"
          stroke="#ef4444"
          strokeWidth="1.5"
          opacity="0.2"
          variants={{
            hidden: { pathLength: 0 },
            show: { pathLength: 1, transition: { duration: 1, delay: 0.3, ease: EASE } },
          }}
        />
        <motion.g variants={arrowVariant} custom={4}>
          <path d="M83 380 L88 390 L93 380" fill="#ef4444" opacity="0.3" />
        </motion.g>
        <motion.text
          x="80"
          y="230"
          textAnchor="middle"
          fontSize="10"
          fill="#a8a29e"
          fontFamily="system-ui"
          fontWeight="500"
          transform="rotate(-90 80 230)"
          letterSpacing="0.1em"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.5, delay: 0.8 } },
          }}
        >
          INCREASING SEVERITY
        </motion.text>
      </svg>
    </motion.div>
  );
}
