"use client";

import {
  IdentificationCard,
  Eye,
  MegaphoneSimple,
  Timer,
  ArrowsClockwise,
  CaretRight,
  Warning,
} from "@phosphor-icons/react";

const STEPS = [
  {
    icon: IdentificationCard,
    label: "Rider Briefing",
    sub: "Confirm rules, position and signals",
    color: "#0891b2",
  },
  {
    icon: Eye,
    label: "Clear Check",
    sub: "Catch pool and runout clear?",
    color: "#0891b2",
  },
  {
    icon: MegaphoneSimple,
    label: "Dispatch",
    sub: "Give the clear verbal command",
    color: "#16a34a",
  },
  {
    icon: Timer,
    label: "Interval",
    sub: "Enforce minimum spacing",
    color: "#eab308",
  },
  {
    icon: ArrowsClockwise,
    label: "Next Rider",
    sub: "Repeat from step 1",
    color: "#0891b2",
  },
];

export function DispatchFlow() {
  return (
    <div className="w-full">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-5 text-center">
        Dispatch Sequence - Operational Flow
      </p>

      <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-1">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="flex items-stretch sm:flex-1 sm:flex-col">
              <div
                className="flex-1 rounded-2xl border bg-white p-3.5 flex flex-row sm:flex-col items-center sm:text-center gap-3 sm:gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
                style={{ borderColor: `${step.color}33` }}
              >
                <div
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${step.color}14` }}
                >
                  <Icon size={22} weight="duotone" style={{ color: step.color }} />
                  <span
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                    style={{ background: step.color }}
                  >
                    {i + 1}
                  </span>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-stone-700 leading-tight">
                    {step.label}
                  </p>
                  <p className="text-[11px] text-stone-400 leading-snug mt-0.5">
                    {step.sub}
                  </p>
                </div>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="flex items-center justify-center px-1 sm:py-1 sm:px-0">
                  <CaretRight
                    size={16}
                    weight="bold"
                    className="text-stone-300 rotate-90 sm:rotate-0"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Timing callout */}
      <div className="mt-4 rounded-2xl border border-amber-200/60 bg-amber-50/70 px-4 py-3 flex items-start gap-3">
        <Warning size={18} weight="fill" className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-amber-800 leading-tight">
            Minimum Dispatch Interval
          </p>
          <p className="text-[11px] text-amber-700/80 leading-snug mt-0.5">
            Based on slide length, type and visibility - never rush, and never dispatch on assumed timing alone.
          </p>
        </div>
      </div>
    </div>
  );
}
