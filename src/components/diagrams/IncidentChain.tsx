"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;

// Each chain link fades up in sequence — the hazard "travelling" left to right.
const linkVariant = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.16, ease: EASE },
  }),
};

// Break-the-chain callouts pop in after the links, with a little spring.
const breakVariant = {
  hidden: { opacity: 0, scale: 0.6 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 320,
      damping: 18,
      delay: 0.9 + i * 0.16,
    },
  }),
};

const legendVariant = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 1.6, ease: EASE },
  },
};

export function IncidentChain() {
  const reduceMotion = useReducedMotion();
  // Own the in-view trigger explicitly: lesson pages wrap sections in their own
  // animation context, and an inherited whileInView can be pre-empted by the
  // page firing "show" at mount (entrance plays off-screen, looks broken).
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const links = [
    { label: "Hazard", desc: "Rough surface, worn joint, chemical imbalance", color: "#a8a29e" },
    { label: "No Detection", desc: "Missed in inspection, not reported", color: "#eab308" },
    { label: "Kept Open", desc: "Slide stays open despite defect", color: "#f97316" },
    { label: "Exposure", desc: "Rider encounters the hazard", color: "#ef4444" },
    { label: "Incident", desc: "Injury, near-miss, or failure", color: "#dc2626" },
  ];

  const breaks = [
    "Inspection catches it",
    "Operator reports it",
    "Dispatch stopped",
    "Emergency response",
  ];

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Incident Chain - Every Link is a Chance to Intervene
      </p>
      <svg viewBox="0 0 720 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="720" height="320" rx="12" fill="#fafaf9" />

        {/* Chain links */}
        {links.map((link, i) => {
          const x = 16 + i * 140;
          const y = 120;

          return (
            <motion.g key={i} variants={linkVariant} custom={i}>
              <rect x={x} y={y} width="126" height="80" rx="12" fill="white" stroke={link.color} strokeWidth="2" />
              <rect x={x} y={y} width="126" height="80" rx="12" fill={link.color} opacity="0.04" />

              {/* Number */}
              <circle cx={x + 22} cy={y + 20} r="12" fill={link.color} opacity="0.15" />
              <text x={x + 22} y={y + 25} textAnchor="middle" fontSize="12" fontWeight="700" fill={link.color} fontFamily="system-ui">
                {i + 1}
              </text>

              {/* Label */}
              <text x={x + 40} y={y + 24} fontSize="12" fontWeight="700" fill="#44403c" fontFamily="system-ui">
                {link.label}
              </text>

              {/* Description */}
              <foreignObject x={x + 10} y={y + 36} width="106" height="38">
                <p style={{ fontSize: 10, color: "#a8a29e", lineHeight: 1.4, margin: 0, fontFamily: "system-ui" }}>
                  {link.desc}
                </p>
              </foreignObject>

              {/* Chain connector — two interlocked links bridging the gap */}
              {i < links.length - 1 && (
                <g>
                  <ellipse cx={x + 130.5} cy={y + 40} rx="4.6" ry="3.2" fill="none" stroke={link.color} strokeWidth="1.8" />
                  <ellipse cx={x + 136.5} cy={y + 40} rx="4.6" ry="3.2" fill="none" stroke={links[i + 1].color} strokeWidth="1.8" />
                </g>
              )}

              {/* Border current — splits both ways from the left-centre,
                  merges at the right, hops to the next card */}
              {!reduceMotion && (
                <>
                  <path
                    d={`M ${x} ${y + 40} L ${x} ${y + 12} Q ${x} ${y} ${x + 12} ${y} L ${x + 114} ${y} Q ${x + 126} ${y} ${x + 126} ${y + 12} L ${x + 126} ${y + 40}`}
                    pathLength={100}
                    className="chain-card-current"
                    style={{ animationDelay: `${i * 0.87}s` }}
                    stroke={link.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d={`M ${x} ${y + 40} L ${x} ${y + 68} Q ${x} ${y + 80} ${x + 12} ${y + 80} L ${x + 114} ${y + 80} Q ${x + 126} ${y + 80} ${x + 126} ${y + 68} L ${x + 126} ${y + 40}`}
                    pathLength={100}
                    className="chain-card-current"
                    style={{ animationDelay: `${i * 0.87}s` }}
                    stroke={link.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {i < links.length - 1 && (
                    <path
                      d={`M ${x + 126} ${y + 40} L ${x + 140} ${y + 40}`}
                      pathLength={100}
                      className="chain-link-current"
                      style={{ animationDelay: `${i * 0.87 + 0.75}s` }}
                      stroke={links[i + 1].color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  )}
                </>
              )}
            </motion.g>
          );
        })}

        {/* Spark — the current discharging off the end of the chain */}
        {!reduceMotion && (
          <g className="chain-spark">
            {[20, 70, 110, 160, 250, 290, 340].map((a) => (
              <line
                key={a}
                x1={702 + 6 * Math.cos((a * Math.PI) / 180)}
                y1={160 + 6 * Math.sin((a * Math.PI) / 180)}
                x2={702 + 15 * Math.cos((a * Math.PI) / 180)}
                y2={160 + 15 * Math.sin((a * Math.PI) / 180)}
                stroke="#dc2626"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            ))}
          </g>
        )}

        {/* Break points */}
        {breaks.map((label, i) => {
          const x = 16 + i * 140 + 126 + 5;
          const y = 115;

          return (
            <motion.g
              key={`break-${i}`}
              variants={breakVariant}
              custom={i}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <line x1={x} y1={y - 8} x2={x} y2={y - 42} stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" />

              <rect x={x - 55} y={y - 72} width="110" height="34" rx="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
              <text x={x} y={y - 60} textAnchor="middle" fontSize="8" fontWeight="600" fill="#16a34a" fontFamily="system-ui" letterSpacing="0.05em">
                BREAK THE CHAIN
              </text>
              <text x={x} y={y - 47} textAnchor="middle" fontSize="9" fill="#16a34a" fontFamily="system-ui">
                {label}
              </text>

              {/* Cut point — a clean intervention node sitting on the chain */}
              <circle cx={x} cy={y - 4} r="9" fill="#16a34a" />
              <circle cx={x} cy={y - 4} r="9" fill="none" stroke="#16a34a" strokeOpacity="0.25" strokeWidth="4" />
              {/* Perpetual soft ripple — "intervention is always available here" */}
              {!reduceMotion && (
                <circle
                  className="svg-ping"
                  style={{ animationDelay: `${2 + i * 0.6}s` }}
                  cx={x}
                  cy={y - 4}
                  r="9"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                />
              )}
              <path
                d={`M${x - 3.4} ${y - 7.4} L${x + 3.4} ${y - 0.6} M${x + 3.4} ${y - 7.4} L${x - 3.4} ${y - 0.6}`}
                stroke="#ffffff"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </motion.g>
          );
        })}

        {/* Bottom legend */}
        <motion.g variants={legendVariant}>
          <rect x="130" y="230" width="460" height="70" rx="14" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
          <text x="360" y="254" textAnchor="middle" fontSize="13" fontWeight="600" fill="#44403c" fontFamily="system-ui">
            Your Role: Break the Chain at Every Opportunity
          </text>
          <text x="360" y="274" textAnchor="middle" fontSize="11" fill="#a8a29e" fontFamily="system-ui">
            Every inspection, observation, and decision is a chance to prevent an incident
          </text>
          <text x="360" y="292" textAnchor="middle" fontSize="10" fill="#22c55e" fontFamily="system-ui" fontWeight="500">
            The earlier you break it, the better the outcome
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
}
