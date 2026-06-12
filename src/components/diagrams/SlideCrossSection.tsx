"use client";

import { motion, useReducedMotion } from "framer-motion";

const FLUME_D =
  "M100 100 C130 100, 150 120, 202 210 C240 280, 300 300, 352 305 C395 308, 440 318, 502 338 C540 348, 590 352, 640 355";
const RETURN_D = "M722 418 L722 455 L80 455 L80 85";

// Flow arrows along the flume: position + rotation following the descent.
const FLOW_ARROWS = [
  { x: 140, y: 112, angle: 18 },
  { x: 243, y: 250, angle: 48 },
  { x: 400, y: 314, angle: 10 },
  { x: 560, y: 350, angle: 6 },
];

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
            loop. Dash period is 26, and each cycle shifts exactly one period,
            so the loop is seamless. */}
        <motion.path
          d={FLUME_D}
          stroke="#1F7A8C"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
          strokeDasharray="4 22"
          initial={false}
          animate={reduce ? undefined : { strokeDashoffset: [0, -26] }}
          transition={
            reduce
              ? undefined
              : { duration: 1.1, repeat: Infinity, ease: "linear" }
          }
        />

        {/* Water flow arrows — pulse in sequence down the slide, tracing the
            direction of travel over and over */}
        {FLOW_ARROWS.map((a, i) => (
          <motion.path
            key={i}
            d="M-9 -8 L9 0 L-9 8 L-4 0 Z"
            fill="#1F7A8C"
            transform={`translate(${a.x} ${a.y}) rotate(${a.angle})`}
            initial={false}
            animate={reduce ? { opacity: 0.4 } : { opacity: [0.18, 0.85, 0.18] }}
            transition={
              reduce
                ? undefined
                : {
                    duration: 2,
                    times: [0, 0.25, 1],
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: i * 0.4,
                  }
            }
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
        <motion.path
          d="M635 364 Q650 360 665 364 Q680 368 695 364 Q710 360 725 364 Q740 368 748 364"
          stroke="#1F7A8C"
          strokeWidth="1"
          fill="none"
          initial={false}
          animate={reduce ? { opacity: 0.4 } : { opacity: [0.25, 0.5, 0.25] }}
          transition={
            reduce
              ? undefined
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
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
        <motion.path
          d={RETURN_D}
          stroke="#1F7A8C"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
          strokeDasharray="3 13"
          initial={false}
          animate={reduce ? undefined : { strokeDashoffset: [0, -16] }}
          transition={
            reduce
              ? undefined
              : { duration: 0.8, repeat: Infinity, ease: "linear" }
          }
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
