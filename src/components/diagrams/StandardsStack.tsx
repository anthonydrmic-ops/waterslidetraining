"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Scales, Books, GlobeHemisphereWest, Compass } from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

const TIERS = [
  {
    icon: Scales,
    tag: "The Law",
    title: "WHS Act + Regulations (OHS Act in Victoria)",
    desc: "Legal duties with penalties for breach - everything below serves this",
    color: "#0B3A66",
  },
  {
    icon: Books,
    tag: "Governing Standard",
    title: "AS 3533 - Amusement Rides and Devices",
    desc: "The Australian standard waterslides are held to",
    chips: ["Part 1 · Design", "Part 2 · Operation", "Part 3 · In-service inspection", "Part 4 · Major inspection"],
    color: "#4f46e5",
  },
  {
    icon: GlobeHemisphereWest,
    tag: "Supplementary International",
    title: "EN 1069 (Europe) · ASTM F2376 (USA)",
    desc: "Waterslide-specific detail - supplements AS 3533, never substitutes it",
    color: "#1F7A8C",
  },
  {
    icon: Compass,
    tag: "Risk Framework",
    title: "AS/NZS ISO 31000 - Risk Management",
    desc: "Identify hazards, assess risks, implement controls, review",
    color: "#16a34a",
  },
];

const rowVariant = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.18, ease: EASE },
  }),
};

const chipVariant = {
  hidden: { opacity: 0, scale: 0.85 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 360, damping: 22, delay: 0.45 + i * 0.08 },
  }),
};

export function StandardsStack() {
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
        Where Each Standard Sits
      </p>
      <div className="space-y-1.5">
        {TIERS.map((tier, i) => {
          const Icon = tier.icon;
          return (
            <div key={i}>
              <motion.div
                variants={rowVariant}
                custom={i}
                className="rounded-2xl border bg-white p-4 flex items-start gap-3.5"
                style={{
                  borderColor: `${tier.color}30`,
                  marginLeft: `${i * 4}%`,
                  background: `linear-gradient(135deg, ${tier.color}06 0%, #ffffff 55%)`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${tier.color}12` }}
                >
                  <Icon size={20} weight="duotone" style={{ color: tier.color }} />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                    style={{ color: tier.color }}
                  >
                    {tier.tag}
                  </p>
                  <p className="text-[13px] font-bold text-stone-800 leading-tight">
                    {tier.title}
                  </p>
                  <p className="text-[11px] text-stone-400 leading-snug mt-0.5">{tier.desc}</p>
                  {tier.chips && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tier.chips.map((chip, ci) => (
                        <motion.span
                          key={ci}
                          variants={chipVariant}
                          custom={ci}
                          className="text-[10px] font-medium px-2 py-1 rounded-full"
                          style={{ background: `${tier.color}10`, color: tier.color }}
                        >
                          {chip}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
              {i < TIERS.length - 1 && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scaleY: 0 },
                    show: {
                      opacity: 1,
                      scaleY: 1,
                      transition: { duration: 0.3, delay: 0.12 + i * 0.18, ease: EASE },
                    },
                  }}
                  className="w-px h-2.5 bg-stone-200 origin-top"
                  style={{ marginLeft: `calc(${(i + 0.5) * 4}% + 20px)` }}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-stone-400 text-center mt-3 leading-snug">
        Always work to the current version - an outdated standard is no defence.
      </p>
    </motion.div>
  );
}
