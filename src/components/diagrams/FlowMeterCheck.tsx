"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;

const CX = 350;
const CY = 215;
const R = 150;

// Gauge sweep: -200deg (left, below horizontal) to 20deg (right). The OEM
// band occupies the middle of the dial.
const START = -200;
const END = 20;

function arcPoint(angleDeg: number, r = R) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function arcPath(fromDeg: number, toDeg: number, r = R) {
  const p1 = arcPoint(fromDeg, r);
  const p2 = arcPoint(toDeg, r);
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`;
}

// Zone boundaries along the sweep
const LOW_END = START + (END - START) * 0.34; // below OEM minimum
const HIGH_START = START + (END - START) * 0.7; // above OEM maximum
const NEEDLE_HOME = START + (END - START) * 0.52; // mid-band

export function FlowMeterCheck() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  // Needle angle in degrees past START. Rises into the OEM band on scroll,
  // then jitters randomly inside a small bounded window forever - like a real
  // analogue gauge reading live flow. The needle is drawn as a line from the
  // fixed hub to a tip whose coordinates are computed from this angle, so the
  // base physically cannot leave the pivot.
  const needle = useMotionValue(0);
  const NEEDLE_LEN = R - 28;
  const tipX = useTransform(
    needle,
    (deg) => CX + NEEDLE_LEN * Math.cos(((START + deg) * Math.PI) / 180)
  );
  const tipY = useTransform(
    needle,
    (deg) => CY + NEEDLE_LEN * Math.sin(((START + deg) * Math.PI) / 180)
  );

  useEffect(() => {
    const HOME = NEEDLE_HOME - START;
    if (reduce) {
      needle.set(HOME);
      return;
    }
    if (!inView) return;

    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const JITTER = 7; // degrees either side of home the needle may wander

    const flick = () => {
      if (!alive) return;
      const target = HOME + (Math.random() * 2 - 1) * JITTER;
      const duration = 0.3 + Math.random() * 0.5;
      animate(needle, target, { duration, ease: "easeInOut" });
      timer = setTimeout(flick, duration * 1000 + Math.random() * 400);
    };

    // The initial rise: a springy sweep up from zero into the band, then the
    // random wander begins once it has settled.
    animate(needle, HOME, { type: "spring", stiffness: 38, damping: 9, delay: 0.4 });
    timer = setTimeout(flick, 2100);

    return () => {
      alive = false;
      clearTimeout(timer);
      needle.stop();
    };
  }, [reduce, inView, needle]);

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-2 text-center">
        The Flow Meter - Verify, Never Assume
      </p>
      <svg viewBox="0 0 700 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="700" height="300" rx="12" fill="#fafaf9" />

        {/* Dial zones */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
          }}
        >
          <path d={arcPath(START, LOW_END)} stroke="#ef4444" strokeOpacity="0.25" strokeWidth="22" strokeLinecap="round" />
          <path d={arcPath(LOW_END, HIGH_START)} stroke="#16a34a" strokeOpacity="0.45" strokeWidth="22" strokeLinecap="round" />
          <path d={arcPath(HIGH_START, END)} stroke="#ef4444" strokeOpacity="0.25" strokeWidth="22" strokeLinecap="round" />
        </motion.g>

        {/* Zone labels */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.5, delay: 0.4 } },
          }}
        >
          <text x="120" y="262" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ef4444" fontFamily="system-ui">
            Below spec
          </text>
          <text x="120" y="277" textAnchor="middle" fontSize="9.5" fill="#a8a29e" fontFamily="system-ui">
            Dry spots · riders stall
          </text>
          <text x={CX} y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#16a34a" fontFamily="system-ui" letterSpacing="0.08em">
            OEM RANGE
          </text>
          <text x={CX} y="37" textAnchor="middle" fontSize="9.5" fill="#a8a29e" fontFamily="system-ui">
            From the Ride Operations Manual
          </text>
          <text x="580" y="262" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ef4444" fontFamily="system-ui">
            Above spec
          </text>
          <text x="580" y="277" textAnchor="middle" fontSize="9.5" fill="#a8a29e" fontFamily="system-ui">
            Overspeed · loss of control
          </text>
        </motion.g>

        {/* Needle — base pinned to the hub, tip position computed from the
            angle, so it pivots exactly like an odometer needle */}
        <motion.line
          x1={CX}
          y1={CY}
          x2={tipX}
          y2={tipY}
          stroke="#0B3A66"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r="10" fill="#0B3A66" />
        <circle cx={CX} cy={CY} r="4" fill="#ffffff" />

        {/* Reading plate */}
        <motion.g
          variants={{
            hidden: { opacity: 0, y: 8 },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 1.1, ease: EASE } },
          }}
        >
          <rect x="270" y="240" width="160" height="40" rx="10" fill="#ffffff" stroke="#16a34a" strokeOpacity="0.4" strokeWidth="1" />
          <text x={CX} y="257" textAnchor="middle" fontSize="9" fontWeight="600" fill="#a8a29e" fontFamily="system-ui" letterSpacing="0.1em">
            READING IN RANGE
          </text>
          <text x={CX} y="273" textAnchor="middle" fontSize="12" fontWeight="700" fill="#16a34a" fontFamily="system-ui">
            Log it, then open
          </text>
        </motion.g>
      </svg>
      <p className="text-[11px] text-stone-400 text-center mt-1 leading-snug">
        Read at opening once the system stabilises, log every reading, investigate any drift.
      </p>
    </motion.div>
  );
}
