"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;

const rowVariant = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.14, ease: EASE },
  }),
};

const zoneVariant = {
  hidden: { opacity: 0, scaleX: 0.6 },
  show: (i: number) => ({
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.5, delay: 0.25 + i * 0.14, ease: EASE },
  }),
};

export function WaterChemistry() {
  const reduce = useReducedMotion();

  const params = [
    { label: "pH Level", low: "6.0", target: "7.2 - 7.8", high: "9.0", lowRisk: "Corrosive", highRisk: "Scaling", color: "#1F7A8C" },
    { label: "FAC (Indoor)", low: "0", target: "1.0 - 3.0 ppm", high: "5.0+", lowRisk: "Infection risk", highRisk: "Surface damage", color: "#22c55e" },
    { label: "FAC (Outdoor)", low: "0", target: "2.0 - 4.0 ppm", high: "5.0+", lowRisk: "Infection risk", highRisk: "Surface damage", color: "#16a34a" },
    { label: "LSI Index", low: "-2.0", target: "-0.3 to +0.3", high: "+2.0", lowRisk: "Dissolves surfaces", highRisk: "Heavy scaling", color: "#0B3A66" },
  ];

  return (
    <motion.div
      className="w-full"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Water Chemistry Balance - Key Parameters
      </p>
      <svg viewBox="0 0 700 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="700" height="450" rx="12" fill="#fafaf9" />

        {params.map((param, i) => {
          const y = 30 + i * 100;
          const barX = 155;
          const barW = 420;
          const markerY = y + 27;
          const markerHome = barX + barW * 0.5;

          return (
            <motion.g key={i} variants={rowVariant} custom={i}>
              {/* Parameter label */}
              <rect x="20" y={y + 6} width="120" height="44" rx="12" fill={param.color} opacity="0.08" />
              <text x="80" y={y + 24} textAnchor="middle" fontSize="14" fontWeight="700" fill={param.color} fontFamily="system-ui">
                {param.label}
              </text>
              <text x="80" y={y + 41} textAnchor="middle" fontSize="10" fill={param.color} opacity="0.7" fontFamily="system-ui">
                Target: {param.target}
              </text>

              {/* Scale bar */}
              <rect x={barX} y={y + 10} width={barW} height="34" rx="17" fill="#f5f5f4" />

              {/* Danger zone left */}
              <rect x={barX} y={y + 10} width={barW * 0.25} height="34" rx="17" fill="#ef4444" opacity="0.08" />

              {/* Safe zone */}
              <rect x={barX + barW * 0.3} y={y + 10} width={barW * 0.4} height="34" rx="4" fill={param.color} opacity="0.1" />

              {/* Danger zone right */}
              <clipPath id={`clip-right-${i}`}>
                <rect x={barX + barW * 0.75} y={y + 10} width={barW * 0.25} height="34" rx="17" />
              </clipPath>
              <rect x={barX + barW * 0.75} y={y + 10} width={barW * 0.25} height="34" fill="#ef4444" opacity="0.08" clipPath={`url(#clip-right-${i})`} />

              {/* Target zone highlight — grows outward from its centre */}
              <motion.g
                variants={zoneVariant}
                custom={i}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <rect x={barX + barW * 0.33} y={y + 13} width={barW * 0.34} height="28" rx="14" fill={param.color} opacity="0.15" stroke={param.color} strokeWidth="1.5" />
                <text x={barX + barW * 0.5} y={y + 32} textAnchor="middle" fontSize="11" fontWeight="600" fill={param.color} fontFamily="system-ui">
                  SAFE RANGE
                </text>
              </motion.g>

              {/* Operating point — drifts in from the corrosive end and settles
                  in the middle of the safe range: the job of daily dosing. */}
              {reduce ? (
                <circle cx={markerHome} cy={markerY} r="6.5" fill={param.color} stroke="#ffffff" strokeWidth="2.5" />
              ) : (
                <motion.circle
                  cy={markerY}
                  r="6.5"
                  fill={param.color}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  variants={{
                    hidden: { cx: barX + barW * 0.12, opacity: 0 },
                    show: {
                      cx: markerHome,
                      opacity: 1,
                      transition: {
                        cx: {
                          type: "spring",
                          stiffness: 50,
                          damping: 13,
                          delay: 0.5 + i * 0.14,
                        },
                        opacity: { duration: 0.3, delay: 0.5 + i * 0.14 },
                      },
                    },
                  }}
                />
              )}

              {/* Low value */}
              <text x={barX + 12} y={y + 32} fontSize="11" fontWeight="600" fill="#ef4444" fontFamily="system-ui">
                {param.low}
              </text>

              {/* High value */}
              <text x={barX + barW - 12} y={y + 32} textAnchor="end" fontSize="11" fontWeight="600" fill="#ef4444" fontFamily="system-ui">
                {param.high}
              </text>

              {/* Risk labels */}
              <text x={barX + barW * 0.12} y={y + 62} textAnchor="middle" fontSize="10" fill="#ef4444" fontFamily="system-ui">
                {param.lowRisk}
              </text>
              <text x={barX + barW * 0.88} y={y + 62} textAnchor="middle" fontSize="10" fill="#ef4444" fontFamily="system-ui">
                {param.highRisk}
              </text>
            </motion.g>
          );
        })}

        {/* Footer */}
        <motion.g variants={rowVariant} custom={params.length}>
          <rect x="160" y="418" width="380" height="24" rx="12" fill="#0B3A66" opacity="0.06" />
          <text x="350" y="435" textAnchor="middle" fontSize="11" fill="#78716c" fontFamily="system-ui">
            LSI (Langelier Saturation Index) = tendency to scale or corrode
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
}
