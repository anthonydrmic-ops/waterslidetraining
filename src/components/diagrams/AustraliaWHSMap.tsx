"use client";

import { useState } from "react";
import auMap from "./au-states-paths.json";

interface Meta {
  name: string;
  act: string;
  regulator: string;
  note: string;
  exception?: boolean;
  /** for tiny jurisdictions (ACT), draw a leader to an offset tag */
  callout?: { x: number; y: number };
}

const META: Record<string, Meta> = {
  WA: {
    name: "Western Australia",
    act: "Work Health and Safety Act 2020",
    regulator: "WorkSafe WA",
    note: "Adopted the model WHS laws in 2022 (its own 2020 Act). Uses PCBU.",  },
  NT: {
    name: "Northern Territory",
    act: "Work Health and Safety (National Uniform Legislation) Act 2011",
    regulator: "NT WorkSafe",
    note: "Harmonised model WHS law. Uses PCBU.",  },
  SA: {
    name: "South Australia",
    act: "Work Health and Safety Act 2012",
    regulator: "SafeWork SA",
    note: "Harmonised model WHS law. Uses PCBU.",  },
  QLD: {
    name: "Queensland",
    act: "Work Health and Safety Act 2011",
    regulator: "Workplace Health and Safety Queensland",
    note: "Harmonised model WHS law. Uses PCBU.",  },
  NSW: {
    name: "New South Wales",
    act: "Work Health and Safety Act 2011",
    regulator: "SafeWork NSW",
    note: "Harmonised model WHS law. Uses PCBU.",  },
  ACT: {
    name: "Australian Capital Territory",
    act: "Work Health and Safety Act 2011",
    regulator: "WorkSafe ACT",
    note: "Harmonised model WHS law. Uses PCBU.",
    callout: { x: 542, y: 405 },
  },
  VIC: {
    name: "Victoria",
    act: "Occupational Health and Safety Act 2004",
    regulator: "WorkSafe Victoria",
    note: "The only state that has NOT adopted the model WHS laws. Uses 'employer' rather than 'PCBU'.",
    exception: true,  },
  TAS: {
    name: "Tasmania",
    act: "Work Health and Safety Act 2012",
    regulator: "WorkSafe Tasmania",
    note: "Harmonised model WHS law. Uses PCBU.",  },
};

export function AustraliaWHSMap() {
  const [active, setActive] = useState<string>("NSW");
  const meta = META[active];
  const states = auMap.states as {
    code: string;
    name: string;
    d: string;
    cx: number;
    cy: number;
  }[];

  return (
    <div className="w-full">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Work Safety Law by Jurisdiction
      </p>

      <div className="flex flex-col md:flex-row gap-5 items-center md:items-stretch">
        {/* Real map */}
        <svg
          viewBox={`0 0 ${auMap.width} ${auMap.height}`}
          className="w-full md:w-1/2 h-auto shrink-0"
          role="group"
          aria-label="Map of Australia - select a state or territory"
        >
          {states.map((s) => {
            const m = META[s.code];
            const isActive = s.code === active;
            const base = m?.exception ? "#d97706" : "#0891b2";
            return (
              <path
                key={s.code}
                d={s.d}
                tabIndex={0}
                role="button"
                aria-label={`${m?.name ?? s.name}: ${m?.act ?? ""}`}
                onMouseEnter={() => setActive(s.code)}
                onFocus={() => setActive(s.code)}
                onClick={() => setActive(s.code)}
                style={{
                  fill: isActive ? base : `${base}26`,
                  stroke: isActive ? base : "#ffffff",
                  strokeWidth: isActive ? 1.5 : 1,
                  cursor: "pointer",
                  transition: "fill 0.25s ease, stroke 0.25s ease",
                  outline: "none",
                }}
              />
            );
          })}

          {/* Code labels + ACT leader/callout */}
          {states.map((s) => {
            const m = META[s.code];
            if (!m) return null;
            const isActive = s.code === active;
            const color = m.exception ? "#b45309" : "#075985";
            if (m.callout) {
              return (
                <g key={`lbl-${s.code}`} style={{ pointerEvents: "none" }}>
                  <line
                    x1={s.cx}
                    y1={s.cy}
                    x2={m.callout.x}
                    y2={m.callout.y}
                    stroke="#94a3b8"
                    strokeWidth={1}
                  />
                  <circle cx={s.cx} cy={s.cy} r={3} fill={isActive ? "#b45309" : "#475569"} />
                  <text
                    x={m.callout.x + 4}
                    y={m.callout.y + 4}
                    fontSize="14"
                    fontWeight="700"
                    fontFamily="system-ui"
                    fill={isActive ? color : "#64748b"}
                  >
                    {s.code}
                  </text>
                </g>
              );
            }
            return (
              <text
                key={`lbl-${s.code}`}
                x={s.cx}
                y={s.cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="700"
                fontFamily="system-ui"
                fill={isActive ? "#ffffff" : color}
                style={{ pointerEvents: "none" }}
              >
                {s.code}
              </text>
            );
          })}
        </svg>

        {/* Detail panel */}
        <div
          className="flex-1 w-full rounded-xl border p-4 md:p-5 transition-colors duration-300"
          style={{
            background: meta.exception ? "rgba(217,119,6,0.05)" : "rgba(8,145,178,0.04)",
            borderColor: meta.exception ? "rgba(217,119,6,0.2)" : "rgba(8,145,178,0.15)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: meta.exception ? "#d97706" : "#0891b2", color: "#fff" }}
            >
              {active}
            </span>
            <span className="text-sm font-semibold text-stone-800">{meta.name}</span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-0.5">Primary Act</p>
          <p className="text-sm font-medium text-stone-700 mb-3 leading-snug">{meta.act}</p>
          <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-0.5">Regulator</p>
          <p className="text-sm text-stone-700 mb-3 leading-snug">{meta.regulator}</p>
          <p className="text-xs text-stone-500 leading-relaxed">{meta.note}</p>
        </div>
      </div>

      <p className="text-[11px] text-stone-400 mt-3 text-center md:text-left">
        Hover or tap a state or territory. Victoria (amber) is the only jurisdiction outside the harmonised model WHS laws.
      </p>
    </div>
  );
}
