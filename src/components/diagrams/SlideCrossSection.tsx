"use client";

export function SlideCrossSection() {
  return (
    <div className="w-full">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Waterslide System - Component Overview
      </p>
      <svg viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0891b2" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="flumeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e7e5e4" />
            <stop offset="100%" stopColor="#d6d3d1" />
          </linearGradient>
        </defs>

        <rect width="800" height="450" rx="12" fill="url(#skyGrad)" />

        {/* Ground */}
        <rect x="0" y="370" width="800" height="80" fill="#f5f5f4" />
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
          d="M100 100 C130 100, 150 120, 202 210 C240 280, 300 300, 352 305 C395 308, 440 318, 502 338 C540 348, 590 352, 640 355"
          stroke="url(#flumeGrad)"
          strokeWidth="26"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M100 100 C130 100, 150 120, 202 210 C240 280, 300 300, 352 305 C395 308, 440 318, 502 338 C540 348, 590 352, 640 355"
          stroke="#0891b2"
          strokeWidth="26"
          strokeLinecap="round"
          fill="none"
          opacity="0.08"
        />

        {/* Water flow arrows */}
        <path d="M140 105 L158 112 L140 119" fill="#0891b2" opacity="0.4" />
        <path d="M240 240 L258 248 L240 256" fill="#0891b2" opacity="0.4" />
        <path d="M400 310 L418 316 L400 322" fill="#0891b2" opacity="0.4" />
        <path d="M560 350 L578 354 L560 358" fill="#0891b2" opacity="0.4" />

        {/* Joint markers */}
        <circle cx="202" cy="210" r="7" fill="white" stroke="#f05a28" strokeWidth="2.5" />
        <circle cx="352" cy="305" r="7" fill="white" stroke="#f05a28" strokeWidth="2.5" />
        <circle cx="502" cy="338" r="7" fill="white" stroke="#f05a28" strokeWidth="2.5" />

        {/* Start platform */}
        <rect x="65" y="72" width="70" height="34" rx="4" fill="#78716c" />
        <rect x="58" y="66" width="84" height="12" rx="4" fill="#a8a29e" />

        {/* Catch pool */}
        <rect x="620" y="355" width="140" height="28" rx="6" fill="url(#waterGrad)" stroke="#0891b2" strokeWidth="1.5" opacity="0.8" />
        <path d="M635 364 Q650 360 665 364 Q680 368 695 364 Q710 360 725 364 Q740 368 748 364" stroke="#0891b2" strokeWidth="1" opacity="0.4" />

        {/* Pump house */}
        <rect x="695" y="380" width="55" height="38" rx="3" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="1" />
        <circle cx="722" cy="398" r="6" fill="none" stroke="#0891b2" strokeWidth="1.5" />
        <path d="M722 394 L722 402 M718 398 L726 398" stroke="#0891b2" strokeWidth="1" />

        {/* Return pipe */}
        <path
          d="M722 418 L722 435 L80 435 L80 85"
          stroke="#0891b2"
          strokeWidth="2"
          strokeDasharray="6 4"
          opacity="0.3"
          fill="none"
        />

        {/* Labels - all sized for readability */}
        {/* Launch Platform */}
        <line x1="100" y1="58" x2="100" y2="40" stroke="#78716c" strokeWidth="1" />
        <text x="100" y="32" textAnchor="middle" fontSize="13" fontWeight="600" fill="#57534e" fontFamily="system-ui">
          Launch Platform
        </text>

        {/* Flume label */}
        <rect x="228" y="248" width="100" height="24" rx="12" fill="#0891b2" opacity="0.1" />
        <text x="278" y="265" textAnchor="middle" fontSize="13" fontWeight="600" fill="#0891b2" fontFamily="system-ui">
          Flume Body
        </text>

        {/* Joint label */}
        <line x1="202" y1="195" x2="202" y2="174" stroke="#f05a28" strokeWidth="1" />
        <rect x="172" y="156" width="60" height="22" rx="11" fill="#f05a28" opacity="0.1" />
        <text x="202" y="171" textAnchor="middle" fontSize="12" fontWeight="600" fill="#f05a28" fontFamily="system-ui">
          Joint
        </text>

        {/* Support label */}
        <line x1="170" y1="290" x2="192" y2="290" stroke="#78716c" strokeWidth="1" />
        <rect x="100" y="280" width="72" height="22" rx="11" fill="#78716c" opacity="0.1" />
        <text x="136" y="295" textAnchor="middle" fontSize="12" fontWeight="600" fill="#78716c" fontFamily="system-ui">
          Support
        </text>

        {/* Catch pool label */}
        <text x="690" y="348" textAnchor="middle" fontSize="13" fontWeight="600" fill="#0891b2" fontFamily="system-ui">
          Catch Pool
        </text>

        {/* Pump label */}
        <text x="722" y="432" textAnchor="middle" fontSize="11" fontWeight="500" fill="#a8a29e" fontFamily="system-ui">
          Pump System
        </text>

        {/* Water return label */}
        <rect x="330" y="422" width="110" height="22" rx="11" fill="#0891b2" opacity="0.08" />
        <text x="385" y="437" textAnchor="middle" fontSize="11" fontWeight="500" fill="#0891b2" fontFamily="system-ui">
          Water Return
        </text>

        {/* Flow arrow on return pipe */}
        <path d="M280 438 L268 432 L268 444 Z" fill="#0891b2" opacity="0.3" />
      </svg>
    </div>
  );
}
