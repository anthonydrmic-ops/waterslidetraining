"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;

// Chain geometry — links overlap so they interlock; the energy pulse and the
// cut nodes derive their positions from the same numbers.
const CY = 122;
const LW = 130;
const LH = 74;
const STEP = 96;
const X0 = 92;
const cxOf = (i: number) => X0 + i * STEP;

// A single 3D metal chain link: stacked strokes give the rounded-tube look —
// a coloured body with an inner top highlight and an inner bottom shadow.
function Ring({
  cx,
  color,
  clipId,
}: {
  cx: number;
  color: string;
  clipId?: string;
}) {
  const x = cx - LW / 2;
  const y = CY - LH / 2;
  const body = (
    <>
      {/* Coloured tube body */}
      <rect x={x} y={y} width={LW} height={LH} rx={LH / 2} fill="none" stroke={color} strokeWidth={13} />
      {/* Inner bottom shadow */}
      <rect
        x={x + 5}
        y={y + 7}
        width={LW - 10}
        height={LH - 10}
        rx={(LH - 10) / 2}
        fill="none"
        stroke="#000000"
        strokeOpacity={0.17}
        strokeWidth={3}
      />
      {/* Inner top highlight — the specular line that sells the round metal */}
      <rect
        x={x + 5}
        y={y + 3}
        width={LW - 10}
        height={LH - 10}
        rx={(LH - 10) / 2}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.55}
        strokeWidth={3}
      />
      {/* Outer rim light */}
      <rect
        x={x - 1}
        y={y - 1}
        width={LW + 2}
        height={LH + 2}
        rx={LH / 2 + 1}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.2}
        strokeWidth={1}
      />
    </>
  );
  return clipId ? <g clipPath={`url(#${clipId})`}>{body}</g> : <g>{body}</g>;
}

const linkVariant = {
  hidden: { opacity: 0, scale: 0.7 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 280, damping: 20, delay: i * 0.14 },
  }),
};

const breakVariant = {
  hidden: { opacity: 0, scale: 0.6 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 320, damping: 18, delay: 0.9 + i * 0.16 },
  }),
};

const legendVariant = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 1.6, ease: EASE } },
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

  const breaks = ["Inspection catches it", "Operator reports it", "Dispatch stopped", "Emergency response"];

  const flowStart = cxOf(0) - LW / 2 - 2;
  const flowEnd = cxOf(links.length - 1) + LW / 2 + 6;
  const flowSpan = flowEnd - flowStart;

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

        <defs>
          {/* Threading clips: a band at each joint, lower half, where the under
              link's near bar is redrawn over the next link to interlock them. */}
          {links.slice(0, -1).map((_, i) => {
            const cx = cxOf(i);
            return (
              <clipPath key={i} id={`thread-${i}`}>
                <rect x={cx + 31} y={CY + 2} width={34} height={46} />
              </clipPath>
            );
          })}
        </defs>

        {/* Soft cast shadow under the whole chain */}
        <ellipse cx={(cxOf(0) + cxOf(links.length - 1)) / 2} cy={CY + LH / 2 + 10} rx={290} ry={10} fill="#000000" opacity={0.05} />

        {/* The links — drawn left to right so each interlocks over the last */}
        {links.map((link, i) => {
          const cx = cxOf(i);
          return (
            <motion.g
              key={i}
              variants={linkVariant}
              custom={i}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <Ring cx={cx} color={link.color} />
              {/* Number, centred in the hole on a small disc */}
              <circle cx={cx} cy={CY} r={13} fill="#ffffff" />
              <circle cx={cx} cy={CY} r={13} fill={link.color} opacity={0.14} />
              <text x={cx} y={CY + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={link.color} fontFamily="system-ui">
                {i + 1}
              </text>
            </motion.g>
          );
        })}

        {/* Threading pass: redraw each under-link's near bar over the next */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.4, delay: 0.7 } },
          }}
        >
          {links.slice(0, -1).map((link, i) => (
            <Ring key={i} cx={cxOf(i)} color={link.color} clipId={`thread-${i}`} />
          ))}
        </motion.g>

        {/* The energy pulse running through the chain */}
        {!reduceMotion && (
          <g transform={`translate(${flowStart} ${CY})`}>
            <g className="chain-flow" style={{ ["--span" as string]: `${flowSpan}px` } as React.CSSProperties}>
              <g className="chain-flow-core" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <circle r={15} fill="#fbbf24" opacity={0.3} />
                <circle r={9} fill="#fde68a" opacity={0.7} />
                <circle r={4.5} fill="#ffffff" />
              </g>
            </g>
          </g>
        )}

        {/* Discharge spark off the end of the chain */}
        {!reduceMotion && (
          <g className="chain-spark" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {[20, 70, 110, 160, 250, 290, 340].map((a) => (
              <line
                key={a}
                x1={flowEnd + 6 * Math.cos((a * Math.PI) / 180)}
                y1={CY + 6 * Math.sin((a * Math.PI) / 180)}
                x2={flowEnd + 16 * Math.cos((a * Math.PI) / 180)}
                y2={CY + 16 * Math.sin((a * Math.PI) / 180)}
                stroke="#dc2626"
                strokeWidth={2.4}
                strokeLinecap="round"
              />
            ))}
          </g>
        )}

        {/* Break points — bolt-cutter nodes sitting on each joint */}
        {breaks.map((label, i) => {
          const x = cxOf(i) + 48;
          const nodeY = CY;
          return (
            <motion.g
              key={`break-${i}`}
              variants={breakVariant}
              custom={i}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <line x1={x} y1={nodeY - 22} x2={x} y2={42} stroke="#22c55e" strokeWidth={1.5} strokeDasharray="4 3" />

              <rect x={x - 55} y={8} width={110} height={34} rx={8} fill="#f0fdf4" stroke="#bbf7d0" strokeWidth={1} />
              <text x={x} y={20} textAnchor="middle" fontSize={8} fontWeight={600} fill="#16a34a" fontFamily="system-ui" letterSpacing="0.05em">
                BREAK THE CHAIN
              </text>
              <text x={x} y={33} textAnchor="middle" fontSize={9} fill="#16a34a" fontFamily="system-ui">
                {label}
              </text>

              {/* Cut node on the chain */}
              <circle cx={x} cy={nodeY} r={9} fill="#16a34a" />
              <circle cx={x} cy={nodeY} r={9} fill="none" stroke="#16a34a" strokeOpacity={0.25} strokeWidth={4} />
              {!reduceMotion && (
                <circle
                  className="svg-ping"
                  style={{ animationDelay: `${2 + i * 0.6}s` }}
                  cx={x}
                  cy={nodeY}
                  r={9}
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth={2}
                />
              )}
              <path
                d={`M${x - 3.4} ${nodeY - 3.4} L${x + 3.4} ${nodeY + 3.4} M${x + 3.4} ${nodeY - 3.4} L${x - 3.4} ${nodeY + 3.4}`}
                stroke="#ffffff"
                strokeWidth={1.7}
                strokeLinecap="round"
              />
            </motion.g>
          );
        })}

        {/* Labels under each link */}
        {links.map((link, i) => {
          const cx = cxOf(i);
          return (
            <motion.g
              key={`label-${i}`}
              variants={{
                hidden: { opacity: 0, y: 6 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.5 + i * 0.1, ease: EASE } },
              }}
            >
              <text x={cx} y={CY + 56} textAnchor="middle" fontSize={12} fontWeight={700} fill="#44403c" fontFamily="system-ui">
                {link.label}
              </text>
              <foreignObject x={cx - 64} y={CY + 62} width={128} height={40}>
                <p style={{ fontSize: 9.5, color: "#a8a29e", lineHeight: 1.35, margin: 0, textAlign: "center", fontFamily: "system-ui" }}>
                  {link.desc}
                </p>
              </foreignObject>
            </motion.g>
          );
        })}

        {/* Bottom legend */}
        <motion.g variants={legendVariant}>
          <rect x="130" y="244" width="460" height="68" rx="14" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
          <text x="360" y="267" textAnchor="middle" fontSize="13" fontWeight="600" fill="#44403c" fontFamily="system-ui">
            Your Role: Break the Chain at Every Opportunity
          </text>
          <text x="360" y="286" textAnchor="middle" fontSize="11" fill="#a8a29e" fontFamily="system-ui">
            Every inspection, observation, and decision is a chance to prevent an incident
          </text>
          <text x="360" y="303" textAnchor="middle" fontSize="10" fill="#22c55e" fontFamily="system-ui" fontWeight="500">
            The earlier you break it, the better the outcome
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
}
