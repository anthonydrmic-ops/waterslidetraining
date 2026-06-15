"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;

// Funnel tiers, widest (most incidents) at the top, narrowing as severity
// rises. Geometry is fixed so the dripping-incident animation lines up with
// each level's neck.
const LEVELS = [
  {
    n: 1,
    role: "Operator",
    when: "Minor injury, operational issue",
    actions: ["Stop dispatch", "Clear the area", "Basic first aid"],
    color: "#16a34a",
    w: 684,
  },
  {
    n: 2,
    role: "Supervisor",
    when: "Significant injury, mechanical failure",
    actions: ["Assess severity", "Coordinate team", "Contact management"],
    color: "#ca8a04",
    w: 588,
  },
  {
    n: 3,
    role: "Management",
    when: "Serious injury, structural failure",
    actions: ["Facility shutdown", "External notification", "Investigation"],
    color: "#ea580c",
    w: 492,
  },
  {
    n: 4,
    role: "Emergency Services",
    when: "Life-threatening, spinal, drowning",
    actions: ["Call 000", "Secure scene", "Preserve evidence"],
    color: "#dc2626",
    w: 396,
  },
];

const CX = 360;
const TIER_H = 78;
const GAP = 16;
const Y0 = 28;
const tierY = (i: number) => Y0 + i * (TIER_H + GAP);
const neckY = (i: number) => tierY(i) + TIER_H + GAP / 2; // gap between tier i and i+1

// Incident tokens: most are resolved at the upper necks, fewer escalate. Each
// token's --drop is the distance from the inflow to the neck where it fades.
const INFLOW_Y = Y0 - 2;
const TOKENS = [
  // 3 resolved at Level 1
  { drop: neckY(0) - INFLOW_Y, delay: 0 },
  { drop: neckY(0) - INFLOW_Y, delay: 1.1 },
  { drop: neckY(0) - INFLOW_Y, delay: 2.2 },
  // 2 escalate, resolved at Level 2
  { drop: neckY(1) - INFLOW_Y, delay: 0.6 },
  { drop: neckY(1) - INFLOW_Y, delay: 2.7 },
  // 1 resolved at Level 3
  { drop: neckY(2) - INFLOW_Y, delay: 1.7 },
  // 1 reaches Level 4 (rare)
  { drop: tierY(3) + TIER_H / 2 - INFLOW_Y, delay: 3.0 },
];

const tierVariant = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1 + i * 0.16, ease: EASE },
  }),
};

// Approximate an SVG chip's width from its text length (no auto-sizing in SVG).
function chipWidth(text: string) {
  return text.length * 5.4 + 20;
}

const NECK_NOTE = ["Most close here", "Fewer escalate", "Only the most serious"];

export function EmergencyResponse() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const totalH = tierY(LEVELS.length - 1) + TIER_H + 28;

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold mb-3 text-center">
        Emergency Escalation - The Funnel Narrows By Design
      </p>

      <svg viewBox={`0 0 720 ${totalH}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="720" height={totalH} rx="12" fill="#fafaf9" />

        {/* Funnel walls connecting the narrowing tiers */}
        {LEVELS.slice(0, -1).map((lvl, i) => {
          const yA = tierY(i) + TIER_H;
          const yB = tierY(i + 1);
          const next = LEVELS[i + 1];
          const ax1 = CX - lvl.w / 2;
          const ax2 = CX + lvl.w / 2;
          const bx1 = CX - next.w / 2;
          const bx2 = CX + next.w / 2;
          return (
            <g key={`wall-${i}`} stroke="#e7e5e4" strokeWidth="1.5" strokeLinecap="round">
              <line x1={ax1} y1={yA} x2={bx1} y2={yB} />
              <line x1={ax2} y1={yA} x2={bx2} y2={yB} />
            </g>
          );
        })}

        {/* Inflow marker */}
        <text x={CX} y={16} textAnchor="middle" fontSize="9" fontWeight="700" fill="#a8a29e" letterSpacing="0.12em" fontFamily="system-ui">
          INCIDENTS IN
        </text>

        {/* Incident tokens dripping down the centre, fading where resolved */}
        {!reduce &&
          TOKENS.map((t, i) => (
            <circle
              key={`tok-${i}`}
              className="incident-token"
              style={{ ["--drop" as string]: `${t.drop}px`, animationDelay: `${t.delay}s` } as React.CSSProperties}
              cx={CX}
              cy={INFLOW_Y}
              r={4}
              fill="#0ea5e9"
            />
          ))}

        {/* Tiers */}
        {LEVELS.map((lvl, i) => {
          const y = tierY(i);
          const x1 = CX - lvl.w / 2;
          const isApex = i === LEVELS.length - 1;
          let chipX = x1 + 58;
          return (
            <motion.g key={i} variants={tierVariant} custom={i} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              {/* Tier body (opaque so tokens read as passing behind, through the necks) */}
              <rect x={x1} y={y} width={lvl.w} height={TIER_H} rx={16} fill="#ffffff" stroke={lvl.color} strokeOpacity={0.34} strokeWidth={1.5} />
              <rect x={x1} y={y} width={lvl.w} height={TIER_H} rx={16} fill={lvl.color} opacity={0.04} />
              <rect x={x1} y={y + 10} width={4} height={TIER_H - 20} rx={2} fill={lvl.color} />

              {/* Level badge */}
              <circle cx={x1 + 32} cy={y + 39} r={15} fill={lvl.color} />
              <text x={x1 + 32} y={y + 44} textAnchor="middle" fontSize={15} fontWeight={800} fill="#ffffff" fontFamily="system-ui">
                {lvl.n}
              </text>
              {isApex && !reduce && (
                <circle className="svg-ping" cx={x1 + 32} cy={y + 39} r={15} fill="none" stroke={lvl.color} strokeWidth={2} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              )}

              {/* Label + when */}
              <text x={x1 + 56} y={y + 28} fontSize={13.5} fontWeight={800} fill={lvl.color} fontFamily="system-ui">
                Level {lvl.n} - {lvl.role}
              </text>
              <text x={x1 + 56} y={y + 44} fontSize={10.5} fontStyle="italic" fill="#a8a29e" fontFamily="system-ui">
                When: {lvl.when}
              </text>

              {/* Action chips */}
              {lvl.actions.map((action, j) => {
                const w = chipWidth(action);
                const cxStart = chipX;
                chipX += w + 8;
                return (
                  <g key={j}>
                    <rect x={cxStart} y={y + 54} width={w} height={18} rx={9} fill={lvl.color} opacity={0.1} />
                    <circle cx={cxStart + 9} cy={y + 63} r={2} fill={lvl.color} opacity={0.6} />
                    <text x={cxStart + 15} y={y + 67} fontSize={10.5} fontWeight={500} fill={lvl.color} fontFamily="system-ui">
                      {action}
                    </text>
                  </g>
                );
              })}
            </motion.g>
          );
        })}

        {/* Resolved ticks sitting in each neck — where most incidents close out */}
        {LEVELS.slice(0, -1).map((lvl, i) => {
          const y = neckY(i);
          return (
            <motion.g
              key={`neck-${i}`}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { duration: 0.4, delay: 0.7 + i * 0.15 } },
              }}
            >
              <circle cx={CX} cy={y} r={8} fill="#16a34a" />
              <path d={`M${CX - 3.4} ${y} l2.6 2.8 l4.4 -5`} stroke="#ffffff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {!reduce && (
                <circle className="svg-ping" cx={CX} cy={y} r={8} fill="none" stroke="#16a34a" strokeWidth={1.6} style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: `${1.2 + i * 0.5}s` }} />
              )}
              <text x={CX + 16} y={y + 3.5} fontSize={9.5} fontStyle="italic" fill="#16a34a" fontFamily="system-ui">
                {NECK_NOTE[i]}
              </text>
            </motion.g>
          );
        })}
      </svg>

      <motion.p
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.5, delay: 0.9 } },
        }}
        className="text-[11px] text-stone-400 text-center mt-3 leading-snug [text-wrap:balance]"
      >
        Severity rises as the funnel narrows - a well-run facility resolves most incidents at
        Level 1, and almost none should ever reach Level 4.
      </motion.p>
    </motion.div>
  );
}
