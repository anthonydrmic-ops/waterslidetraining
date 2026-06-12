"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Scales } from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

const BARS = [
  {
    label: "Single rider",
    sub: "Min and max set by the OEM per slide",
    lowRisk: "Under minimum - may stall mid-flume",
    highRisk: "Over maximum - overspeed, overshoot",
    bandStart: 0.3,
    bandEnd: 0.72,
    marker: 0.5,
    color: "#0B3A66",
  },
  {
    label: "Multi-rider raft - combined",
    sub: "The whole raft must land inside a narrower window",
    lowRisk: "Raft too light - stall risk",
    highRisk: "Raft too heavy - airborne risk",
    bandStart: 0.38,
    bandEnd: 0.64,
    marker: 0.52,
    color: "#1F7A8C",
  },
];

const rowVariant = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.18, ease: EASE },
  }),
};

export function WeightWindow() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        The Weight Window - Too Light Is As Unsafe As Too Heavy
      </p>
      <svg viewBox="0 0 700 290" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="700" height="290" rx="12" fill="#fafaf9" />

        {BARS.map((bar, i) => {
          const y = 42 + i * 110;
          const barX = 60;
          const barW = 580;
          const bandX = barX + barW * bar.bandStart;
          const bandW = barW * (bar.bandEnd - bar.bandStart);
          const markerHome = barX + barW * bar.marker;

          return (
            <motion.g key={i} variants={rowVariant} custom={i}>
              <text x={barX} y={y - 10} fontSize="12" fontWeight="700" fill="#44403c" fontFamily="system-ui">
                {bar.label}
              </text>
              <text x={barX + barW} y={y - 10} textAnchor="end" fontSize="10" fill="#a8a29e" fontFamily="system-ui">
                {bar.sub}
              </text>

              {/* Scale bar */}
              <rect x={barX} y={y} width={barW} height="30" rx="15" fill="#f5f5f4" />
              <rect x={barX} y={y} width={barW * bar.bandStart} height="30" rx="15" fill="#ef4444" opacity="0.08" />
              <rect x={barX + barW * bar.bandEnd} y={y} width={barW * (1 - bar.bandEnd)} height="30" rx="15" fill="#ef4444" opacity="0.08" />

              {/* OEM window */}
              <motion.g
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                variants={{
                  hidden: { opacity: 0, scaleX: 0.6 },
                  show: {
                    opacity: 1,
                    scaleX: 1,
                    transition: { duration: 0.5, delay: 0.25 + i * 0.18, ease: EASE },
                  },
                }}
              >
                <rect x={bandX} y={y + 2.5} width={bandW} height="25" rx="12" fill={bar.color} opacity="0.16" stroke={bar.color} strokeWidth="1.5" />
                <text x={bandX + bandW / 2} y={y + 19} textAnchor="middle" fontSize="10.5" fontWeight="600" fill={bar.color} fontFamily="system-ui">
                  OEM WINDOW
                </text>
              </motion.g>

              {/* Min / Max ticks */}
              <text x={bandX} y={y + 47} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={bar.color} fontFamily="system-ui">
                MIN
              </text>
              <text x={bandX + bandW} y={y + 47} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={bar.color} fontFamily="system-ui">
                MAX
              </text>

              {/* Risk labels */}
              <text x={barX + (barW * bar.bandStart) / 2} y={y + 47} textAnchor="middle" fontSize="9.5" fill="#ef4444" fontFamily="system-ui">
                {bar.lowRisk}
              </text>
              <text x={barX + barW * bar.bandEnd + (barW * (1 - bar.bandEnd)) / 2} y={y + 47} textAnchor="middle" fontSize="9.5" fill="#ef4444" fontFamily="system-ui">
                {bar.highRisk}
              </text>

              {/* Verified weight marker — slides in from the heavy end and settles */}
              {reduce ? (
                <circle cx={markerHome} cy={y + 15} r="6.5" fill={bar.color} stroke="#ffffff" strokeWidth="2.5" />
              ) : (
                <motion.g
                  variants={{
                    hidden: { x: barX + barW * 0.9 - markerHome, opacity: 0 },
                    show: {
                      x: 0,
                      opacity: 1,
                      transition: {
                        x: { type: "spring", stiffness: 50, damping: 13, delay: 0.55 + i * 0.18 },
                        opacity: { duration: 0.3, delay: 0.55 + i * 0.18 },
                      },
                    },
                  }}
                >
                  <circle cx={markerHome} cy={y + 15} r="6.5" fill={bar.color} stroke="#ffffff" strokeWidth="2.5" />
                </motion.g>
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* Scales rule */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 8 },
          show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.9, ease: EASE } },
        }}
        className="rounded-2xl border border-[#0B3A66]/20 bg-[#0B3A66]/5 px-4 py-3 flex items-center justify-center gap-2.5 max-w-xl mx-auto"
      >
        <Scales size={17} weight="duotone" className="text-[#0B3A66] shrink-0" />
        <p className="text-[12px] font-semibold text-stone-700 leading-snug">
          Combined raft weights are confirmed on calibrated scales at dispatch - never estimated by eye
        </p>
      </motion.div>
    </motion.div>
  );
}
