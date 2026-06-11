"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Buildings, Wrench, UsersThree } from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

const ROLES = [
  {
    icon: Buildings,
    title: "Owner / Operator",
    color: "#0B3A66",
    items: [
      "Operate and maintain to the SOP",
      "Ensure staff are trained",
      "Verify responsibilities are being met",
      "Keep documented records (warranty depends on it)",
    ],
  },
  {
    icon: Wrench,
    title: "Maintenance Team",
    color: "#1F7A8C",
    items: [
      "Daily pre-opening + closing inspections",
      "Monitor water flows and levels continuously",
      "Lighting and ventilation requirements",
      "Periodic and annual inspections + records",
    ],
  },
  {
    icon: UsersThree,
    title: "Operations Team",
    color: "#F05A28",
    items: [
      "Dispatch control and timing",
      "Rider behaviour and instruction",
      "Exit monitoring and pool clearance",
      "Top-bottom communication + emergency initiation",
    ],
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.14, ease: EASE },
  }),
};

const itemVariant = {
  hidden: { opacity: 0, x: -6 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, delay: 0.3 + i * 0.07, ease: EASE },
  }),
};

export function RolesMatrix() {
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
        Three Roles - No Gaps, No Overlap
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ROLES.map((role, i) => {
          const Icon = role.icon;
          return (
            <motion.div
              key={i}
              variants={cardVariant}
              custom={i}
              className="rounded-2xl border bg-white overflow-hidden transition-shadow duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
              style={{ borderColor: `${role.color}30` }}
            >
              <div
                className="px-4 py-3 flex items-center gap-2.5"
                style={{ background: `${role.color}0d` }}
              >
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                  <Icon size={19} weight="duotone" style={{ color: role.color }} />
                </div>
                <p className="text-[13px] font-bold text-stone-800 leading-tight">{role.title}</p>
              </div>
              <ul className="p-4 space-y-2">
                {role.items.map((item, j) => (
                  <motion.li
                    key={j}
                    variants={itemVariant}
                    custom={j}
                    className="flex items-start gap-2 text-[11.5px] text-stone-500 leading-snug"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: role.color }}
                    />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
