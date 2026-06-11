"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Broadcast } from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

// The four-part radio call, assembled piece by piece.
const SEGMENTS = [
  { tag: "WHO", text: "“This is [your name]", color: "#0B3A66" },
  { tag: "WHERE", text: "at [slide name] top station.", color: "#1F7A8C" },
  { tag: "WHAT", text: "I have stopped dispatch because [reason]. Last rider dispatched at [time].", color: "#d97706" },
  { tag: "NEED", text: "I need [specific response].”", color: "#dc2626" },
];

const CONTACTS = [
  { label: "Partner operator", note: "immediate coordination", color: "#0B3A66" },
  { label: "Supervisor on duty", note: "incident management", color: "#1F7A8C" },
  { label: "First aid / lifeguards", note: "injury suspected or confirmed", color: "#d97706" },
  { label: "Emergency services 000", note: "serious injury, entrapment, structural failure", color: "#dc2626" },
  { label: "Facility management", note: "non-immediate maintenance response", color: "#78716c" },
  { label: "Manufacturer support", note: "equipment-specific guidance", color: "#78716c" },
];

const segmentVariant = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.2 + i * 0.35, ease: EASE },
  }),
};

const contactVariant = {
  hidden: { opacity: 0, x: -10 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: 1.7 + i * 0.1, ease: EASE },
  }),
};

export function CommsProtocol() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        The Four-Part Radio Call
      </p>

      {/* Message assembly */}
      <div className="rounded-2xl border border-stone-200/80 bg-stone-900 p-5 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <Broadcast size={16} weight="duotone" className="text-emerald-400" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
            On air
          </span>
        </div>
        <p className="leading-relaxed">
          {SEGMENTS.map((seg, i) => (
            <motion.span key={i} variants={segmentVariant} custom={i} className="inline">
              <span
                className="text-[9px] font-bold uppercase tracking-wider align-middle mr-1.5 px-1.5 py-0.5 rounded"
                style={{ background: `${seg.color}33`, color: "#d6d3d1" }}
              >
                {seg.tag}
              </span>
              <span className="text-[13px] text-stone-100 font-medium mr-2">{seg.text}</span>
            </motion.span>
          ))}
        </p>
      </div>

      {/* Escalation order */}
      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 px-1">
        Who to contact, in order of severity
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {CONTACTS.map((c, i) => (
          <motion.div
            key={i}
            variants={contactVariant}
            custom={i}
            className="rounded-xl border border-stone-200/70 bg-white px-3 py-2.5 flex items-center gap-2.5"
          >
            <span
              className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0"
              style={{ background: c.color }}
            >
              {i + 1}
            </span>
            <p className="text-[11.5px] text-stone-700 font-semibold leading-tight">
              {c.label}
              <span className="text-stone-400 font-normal"> · {c.note}</span>
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
