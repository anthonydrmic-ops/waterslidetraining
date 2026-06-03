"use client";

import {
  Pulse,
  Lightning,
  StackSimple,
  ArrowsOutLineHorizontal,
  Drop,
  Target,
  Eye,
  Prohibit,
  Warning,
  type Icon,
} from "@phosphor-icons/react";

type Severity = "Monitor" | "Shut Down" | "Action Required";

const SEV_STYLE: Record<Severity, { color: string; bg: string; icon: Icon }> = {
  Monitor: { color: "#ca8a04", bg: "#fefce8", icon: Eye },
  "Shut Down": { color: "#dc2626", bg: "#fef2f2", icon: Prohibit },
  "Action Required": { color: "#ea580c", bg: "#fff7ed", icon: Warning },
};

interface Defect {
  icon: Icon;
  label: string;
  severity: Severity;
  desc: string;
  action: string;
  response: string;
}

const DEFECTS: Defect[] = [
  {
    icon: Pulse,
    label: "Hairline Crack",
    severity: "Monitor",
    desc: "Surface only, no structural risk yet",
    action: "Log in register, check each inspection",
    response: "Next scheduled inspection",
  },
  {
    icon: Lightning,
    label: "Structural Crack",
    severity: "Shut Down",
    desc: "Through-wall, water may penetrate",
    action: "Close slide, report, document",
    response: "Immediate",
  },
  {
    icon: StackSimple,
    label: "Delamination",
    severity: "Action Required",
    desc: "Layers separating, tap to detect",
    action: "Report to maintenance, monitor",
    response: "Within 24 hours",
  },
  {
    icon: ArrowsOutLineHorizontal,
    label: "Joint Lip / Gap",
    severity: "Shut Down",
    desc: "Misalignment at flume joints",
    action: "Close slide, report, document",
    response: "Immediate",
  },
  {
    icon: Drop,
    label: "Discolouration",
    severity: "Monitor",
    desc: "Chemical exposure or UV damage",
    action: "Log in register, check each inspection",
    response: "Next scheduled inspection",
  },
  {
    icon: Target,
    label: "Puncture",
    severity: "Shut Down",
    desc: "Through-wall hole, water ingress",
    action: "Close slide, report, document",
    response: "Immediate",
  },
];

export function DefectRecognition() {
  return (
    <div className="w-full">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-5 text-center">
        Defect Recognition Quick Reference
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {DEFECTS.map((d, i) => {
          const sev = SEV_STYLE[d.severity];
          const Icon = d.icon;
          const SevIcon = sev.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border bg-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
              style={{ borderColor: `${sev.color}33` }}
            >
              {/* Header strip */}
              <div
                className="flex items-center gap-2.5 px-3.5 py-2.5"
                style={{ background: sev.bg }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "#ffffff" }}
                >
                  <Icon size={19} weight="duotone" style={{ color: sev.color }} />
                </div>
                <p className="text-[13px] font-bold text-stone-800 leading-tight flex-1">
                  {d.label}
                </p>
              </div>

              <div className="p-3.5">
                {/* Severity badge */}
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full mb-2.5"
                  style={{ background: `${sev.color}1a`, color: sev.color }}
                >
                  <SevIcon size={11} weight="fill" />
                  {d.severity}
                </span>

                <p className="text-[11.5px] text-stone-500 leading-snug mb-3">{d.desc}</p>

                <div className="space-y-1.5 border-t border-stone-100 pt-2.5">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide w-16 shrink-0">
                      Action
                    </span>
                    <span className="text-[11px] text-stone-600 leading-snug">{d.action}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide w-16 shrink-0">
                      Response
                    </span>
                    <span
                      className="text-[11px] font-semibold leading-snug"
                      style={{ color: d.response === "Immediate" ? sev.color : "#57534e" }}
                    >
                      {d.response}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
