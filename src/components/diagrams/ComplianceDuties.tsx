"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Wrench, MagnifyingGlass, Notebook, Megaphone, Seal } from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

const DUTIES = [
  {
    icon: Wrench,
    label: "Maintain",
    desc: "Per the manufacturer's schedule, every operating day",
    color: "#1F7A8C",
  },
  {
    icon: MagnifyingGlass,
    label: "Inspect",
    desc: "Including a thorough inspection by a competent person at least every 12 months",
    color: "#4f46e5",
  },
  {
    icon: Notebook,
    label: "Keep records",
    desc: "Inspection documentation is a legal requirement, available for audit",
    color: "#d97706",
  },
  {
    icon: Megaphone,
    label: "Notify incidents",
    desc: "Serious injuries and dangerous incidents go to the regulator immediately",
    color: "#b91c1c",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.25 + i * 0.12, ease: EASE },
  }),
};

export function ComplianceDuties() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [active, setActive] = useState(-1);

  // Walk a highlight through the four duties on a loop - the duties never stop
  // applying, registration exclusion or not.
  useEffect(() => {
    if (reduce || !inView) return;
    let i = -1;
    const id = setInterval(() => {
      i = (i + 1) % (DUTIES.length + 1);
      setActive(i === DUTIES.length ? -1 : i);
    }, 1500);
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
        Registration Excluded - Duties Never Are
      </p>

      {/* The exclusion */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 10 },
          show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
        }}
        className="rounded-2xl border border-stone-200/80 bg-stone-50/80 p-4 flex items-start gap-3 mb-3"
      >
        <div className="w-10 h-10 rounded-xl bg-white border border-stone-200/60 flex items-center justify-center shrink-0">
          <Seal size={20} weight="duotone" className="text-stone-400" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-stone-700 leading-tight">
            Gravity waterslides: generally NOT registrable plant
          </p>
          <p className="text-[11px] text-stone-400 leading-snug mt-0.5">
            Schedule 5 of the model WHS Regulations excludes gravity water slides from design and
            item registration. Confirm your device&apos;s class with your regulator.
          </p>
        </div>
      </motion.div>

      {/* The duties that remain */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {DUTIES.map((duty, i) => {
          const Icon = duty.icon;
          const isActive = active === i;
          return (
            <motion.div
              key={i}
              variants={cardVariant}
              custom={i}
              className="rounded-2xl border bg-white p-3.5 flex items-start gap-3 transition-all duration-500"
              style={{
                borderColor: isActive ? `${duty.color}55` : `${duty.color}28`,
                boxShadow: isActive ? `0 4px 18px ${duty.color}1c` : undefined,
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500"
                style={{ background: isActive ? `${duty.color}1f` : `${duty.color}10` }}
              >
                <Icon size={18} weight="duotone" style={{ color: duty.color }} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-stone-800 leading-tight">{duty.label}</p>
                <p className="text-[11px] text-stone-400 leading-snug mt-0.5">{duty.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
