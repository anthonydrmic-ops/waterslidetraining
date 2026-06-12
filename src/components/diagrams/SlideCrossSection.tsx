"use client";

import { motion, useReducedMotion } from "framer-motion";

const FLUME_D =
  "M100 100 C130 100, 150 120, 202 210 C240 280, 300 300, 352 305 C395 308, 440 318, 502 338 C540 348, 590 352, 640 355";
const RETURN_D = "M722 418 L722 455 L80 455 L80 85";

// The flume path's four cubic segments, so arrow positions and angles can be
// computed exactly ON the curve instead of hand-placed.
type Pt = [number, number];
const FLUME_SEGS: [Pt, Pt, Pt, Pt][] = [
  [[100, 100], [130, 100], [150, 120], [202, 210]],
  [[202, 210], [240, 280], [300, 300], [352, 305]],
  [[352, 305], [395, 308], [440, 318], [502, 338]],
  [[502, 338], [540, 348], [590, 352], [640, 355]],
];

function bezAt(seg: [Pt, Pt, Pt, Pt], u: number) {
  const m = 1 - u;
  const c = (i: 0 | 1) =>
    m * m * m * seg[0][i] + 3 * m * m * u * seg[1][i] + 3 * m * u * u * seg[2][i] + u * u * u * seg[3][i];
  // Derivative for the tangent (direction of travel)
  const d = (i: 0 | 1) =>
    3 * m * m * (seg[1][i] - seg[0][i]) + 6 * m * u * (seg[2][i] - seg[1][i]) + 3 * u * u * (seg[3][i] - seg[2][i]);
  return { x: c(0), y: c(1), angle: (Math.atan2(d(1), d(0)) * 180) / Math.PI };
}

// Flow arrows: evenly spread down the descent, each sitting exactly on the
// path centreline and rotated to its local slope.
const FLOW_ARROWS = [
  { seg: 0, u: 0.35 },
  { seg: 0, u: 0.8 },
  { seg: 1, u: 0.4 },
  { seg: 1, u: 0.8 },
  { seg: 2, u: 0.45 },
  { seg: 2, u: 0.9 },
  { seg: 3, u: 0.55 },
].map(({ seg, u }) => bezAt(FLUME_SEGS[seg], u));

export function SlideCrossSection() {
  const reduce = useReducedMotion();

  return (
    <div className="w-full">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Waterslide System - Component Overview
      </p>
      <svg viewBox="0 0 800 470" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F7A8C" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1F7A8C" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="flumeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5f5f4" />
            <stop offset="55%" stopColor="#e7e5e4" />
            <stop offset="100%" stopColor="#c9c5c1" />
          </linearGradient>
          <filter id="flumeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0B3A66" floodOpacity="0.12" />
          </filter>
        </defs>

        <rect width="800" height="470" rx="12" fill="url(#skyGrad)" />

        {/* Ground */}
        <rect x="0" y="370" width="800" height="100" fill="#f5f5f4" />
        <line x1="0" y1="370" x2="800" y2="370" stroke="#d6d3d1" strokeWidth="1" />

        {/* Support columns */}
        <rect x="195" y="210" width="14" height="160" rx="2" fill="#a8a29e" />
        <rect x="345" y="260" width="14" height="110" rx="2" fill="#a8a29e" />
        <rect x="495" y="300" width="14" height="70" rx="2" fill="#a8a29e" />

        {/* Support bases */}
        <rect x="186" y="362" width="32" height="10" rx="2" fill="#78716c" />
        <rect x="336" y="362" width="32" height="10" rx="2" fill="#78716c" />
        <rect x="486" y="362" width="32" height="10" rx="2" fill="#78716c" />

        {/* Flume body */}
        <path
          d={FLUME_D}
          stroke="url(#flumeGrad)"
          strokeWidth="26"
          strokeLinecap="round"
          fill="none"
          filter="url(#flumeShadow)"
        />
        {/* Inner highlight for a tube-like sheen */}
        <path
          d={FLUME_D}
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
          transform="translate(0,-5)"
        />
        <path
          d={FLUME_D}
          stroke="#1F7A8C"
          strokeWidth="26"
          strokeLinecap="round"
          fill="none"
          opacity="0.08"
        />

        {/* Flowing water - droplets travelling down the flume in a constant
            seamless loop (CSS keyframes - dash period 26, one period per cycle) */}
        <path
          className={reduce ? undefined : "flow-dash"}
          d={FLUME_D}
          stroke="#1F7A8C"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
          strokeDasharray="4 22"
        />

        {/* Water flow arrows — sitting exactly on the flume centreline, pulsing
            in sequence down the descent (CSS keyframes, staggered delays) */}
        {FLOW_ARROWS.map((a, i) => (
          <path
            key={i}
            className={reduce ? undefined : "flow-arrow"}
            d="M-8 -7 L9 0 L-8 7 L-3.5 0 Z"
            fill="#ffffff"
            opacity={reduce ? 0.85 : undefined}
            transform={`translate(${a.x} ${a.y}) rotate(${a.angle})`}
            style={reduce ? undefined : { animationDelay: `${i * 0.26}s` }}
          />
        ))}

        {/* Joint markers */}
        <circle cx="202" cy="210" r="7" fill="white" stroke="#f05a28" strokeWidth="2.5" />
        <circle cx="352" cy="305" r="7" fill="white" stroke="#f05a28" strokeWidth="2.5" />
        <circle cx="502" cy="338" r="7" fill="white" stroke="#f05a28" strokeWidth="2.5" />

        {/* Start platform */}
        <rect x="65" y="72" width="70" height="34" rx="4" fill="#78716c" />
        <rect x="58" y="66" width="84" height="12" rx="4" fill="#a8a29e" />

        {/* Catch pool */}
        <rect x="620" y="355" width="140" height="28" rx="6" fill="url(#waterGrad)" stroke="#1F7A8C" strokeWidth="1.5" opacity="0.8" />
        <path
          className={reduce ? undefined : "shimmer-fade"}
          d="M635 364 Q650 360 665 364 Q680 368 695 364 Q710 360 725 364 Q740 368 748 364"
          stroke="#1F7A8C"
          strokeWidth="1"
          fill="none"
          opacity={reduce ? 0.4 : undefined}
        />

        {/* Pump house */}
        <rect x="695" y="380" width="55" height="38" rx="3" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="1" />
        <circle cx="722" cy="398" r="6" fill="none" stroke="#1F7A8C" strokeWidth="1.5" />
        <path d="M722 394 L722 402 M718 398 L726 398" stroke="#1F7A8C" strokeWidth="1" />

        {/* Return pipe */}
        <path
          d={RETURN_D}
          stroke="#1F7A8C"
          strokeWidth="2"
          strokeDasharray="6 4"
          opacity="0.3"
          fill="none"
        />
        {/* Flowing water - pumped back up the return loop to the launch platform */}
        <path
          className={reduce ? undefined : "flow-dash-return"}
          d={RETURN_D}
          stroke="#1F7A8C"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
          strokeDasharray="3 13"
        />

        {/* Labels — solid white plates so no line or object ever strikes
            through the text, each tied to its component with a short leader */}
        {/* Launch Platform */}
        <line x1="100" y1="58" x2="100" y2="40" stroke="#78716c" strokeWidth="1" />
        <rect x="42" y="18" width="116" height="22" rx="11" fill="#ffffff" stroke="#d6d3d1" strokeWidth="1" />
        <text x="100" y="33" textAnchor="middle" fontSize="12" fontWeight="600" fill="#57534e" fontFamily="system-ui">
          Launch Platform
        </text>

        {/* Flume label — parked in open sky, leader down to the flume */}
        <line x1="430" y1="244" x2="430" y2="300" stroke="#1F7A8C" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        <rect x="380" y="220" width="100" height="24" rx="12" fill="#ffffff" stroke="#1F7A8C" strokeOpacity="0.35" strokeWidth="1" />
        <text x="430" y="237" textAnchor="middle" fontSize="13" fontWeight="600" fill="#1F7A8C" fontFamily="system-ui">
          Flume Body
        </text>

        {/* Joint label */}
        <line x1="202" y1="195" x2="202" y2="170" stroke="#f05a28" strokeWidth="1" />
        <rect x="172" y="146" width="60" height="22" rx="11" fill="#ffffff" stroke="#f05a28" strokeOpacity="0.4" strokeWidth="1" />
        <text x="202" y="161" textAnchor="middle" fontSize="12" fontWeight="600" fill="#f05a28" fontFamily="system-ui">
          Joint
        </text>

        {/* Support label */}
        <line x1="174" y1="291" x2="192" y2="291" stroke="#78716c" strokeWidth="1" />
        <rect x="100" y="280" width="72" height="22" rx="11" fill="#ffffff" stroke="#a8a29e" strokeOpacity="0.5" strokeWidth="1" />
        <text x="136" y="295" textAnchor="middle" fontSize="12" fontWeight="600" fill="#78716c" fontFamily="system-ui">
          Support
        </text>

        {/* Catch pool label — clear of the flume's end cap */}
        <rect x="668" y="328" width="88" height="22" rx="11" fill="#ffffff" stroke="#1F7A8C" strokeOpacity="0.35" strokeWidth="1" />
        <text x="712" y="343" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1F7A8C" fontFamily="system-ui">
          Catch Pool
        </text>

        {/* Pump label — split either side of the vertical return pipe so the
            line passes cleanly between the two words */}
        <text x="714" y="434" textAnchor="end" fontSize="11" fontWeight="500" fill="#78716c" fontFamily="system-ui">
          Pump
        </text>
        <text x="730" y="434" textAnchor="start" fontSize="11" fontWeight="500" fill="#78716c" fontFamily="system-ui">
          System
        </text>

        {/* Water return label — solid plate over the dashed return run */}
        <rect x="330" y="444" width="110" height="22" rx="11" fill="#ffffff" stroke="#1F7A8C" strokeOpacity="0.3" strokeWidth="1" />
        <text x="385" y="459" textAnchor="middle" fontSize="11" fontWeight="500" fill="#1F7A8C" fontFamily="system-ui">
          Water Return
        </text>

        {/* Flow arrow on return pipe — pointing back toward the platform */}
        <path d="M262 455 L274 449 L274 461 Z" fill="#1F7A8C" opacity="0.35" />
      </svg>
    </div>
  );
}
