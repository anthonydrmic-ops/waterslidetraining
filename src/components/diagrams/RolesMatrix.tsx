"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Buildings, Wrench, UsersThree } from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

const ROLES = [
  {
    icon: Buildings,
    title: "Owner / Operator",
    mandate: "Sets the system",
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
    mandate: "Keeps it safe to open",
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
    mandate: "Keeps it safe while running",
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
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [active, setActive] = useState(-1);

  // The spotlight visits one role at a time - every task has exactly one
  // owner, and the highlight never sits on two cards at once.
  useEffect(() => {
    if (reduce || !inView) return;
    let i = -1;
    const id = setInterval(() => {
      i = (i + 1) % (ROLES.length + 1);
      setActive(i === ROLES.length ? -1 : i);
    }, 2200);
    return () => clearInterval(id);
  }, [reduce, inView]);

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
          const isActive = active === i;
          return (
            <motion.div
              key={i}
              variants={cardVariant}
              custom={i}
              className="rounded-2xl border bg-white overflow-hidden transition-all duration-500"
              style={{
                borderColor: isActive ? `${role.color}55` : `${role.color}2e`,
                boxShadow: isActive ? `0 8px 28px ${role.color}1f` : undefined,
              }}
            >
              {/* Gradient identity bar */}
              <div
                aria-hidden
                className="h-[3px] w-full"
                style={{
                  background: `linear-gradient(90deg, ${role.color}, ${role.color}55)`,
                }}
              />
              <div
                className="px-4 py-3 flex items-center gap-3 transition-colors duration-500"
                style={{ background: isActive ? `${role.color}10` : `${role.color}08` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500"
                  style={{ background: isActive ? `${role.color}22` : `${role.color}12` }}
                >
                  <Icon size={20} weight="duotone" style={{ color: role.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-stone-800 leading-tight">{role.title}</p>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wider mt-0.5"
                    style={{ color: role.color }}
                  >
                    {role.mandate}
                  </p>
                </div>
              </div>
              <ul className="p-4 space-y-2.5">
                {role.items.map((item, j) => (
                  <motion.li
                    key={j}
                    variants={itemVariant}
                    custom={j}
                    className="flex items-start gap-2.5 text-[12px] text-stone-600 leading-snug"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-[6px] shrink-0 transition-opacity duration-500"
                      style={{ background: role.color, opacity: isActive ? 1 : 0.45 }}
                    />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
      <p className="text-[11px] text-stone-400 text-center mt-3 leading-snug">
        Every critical task belongs to exactly one of these lists - if it isn&apos;t on one, it falls through.
      </p>
    </motion.div>
  );
}
