"use client";

import { useState } from "react";
import auMap from "./au-states-paths.json";

interface Meta {
  name: string;
  act: string;
  regulator: string;
  note: string;
  exception?: boolean;
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

// bounding box of an SVG path made of M/L/Z commands
function pathBBox(d: string) {
  const nums = d.replace(/[MLZ]/g, " ").trim().split(/\s+/).map(Number);
  let a = Infinity, b = -Infinity, c = Infinity, e = -Infinity;
  for (let i = 0; i < nums.length - 1; i += 2) {
    const x = nums[i], y = nums[i + 1];
    if (x < a) a = x;
    if (x > b) b = x;
    if (y < c) c = y;
    if (y > e) e = y;
  }
  return { x: a, y: c, w: b - a, h: e - c, cx: (a + b) / 2, cy: (c + e) / 2 };
}

const INSET_MARGIN = 160; // right-hand space for the magnified ACT inset

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
          viewBox={`0 0 ${auMap.width + INSET_MARGIN} ${auMap.height}`}
          className="w-full md:w-[58%] h-auto shrink-0"
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

          {/* Code labels for every jurisdiction except ACT (shown via inset) */}
          {states.map((s) => {
            if (s.code === "ACT") return null;
            const m = META[s.code];
            if (!m) return null;
            const isActive = s.code === active;
            const color = m.exception ? "#b45309" : "#075985";
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

          {/* Magnified ACT inset (it is too small to click in place) */}
          {(() => {
            const act = states.find((s) => s.code === "ACT");
            if (!act) return null;
            const isActive = active === "ACT";
            const base = "#0891b2";
            const bb = pathBBox(act.d);
            const size = 62;
            const s = size / Math.max(bb.w, bb.h);
            const ix = auMap.width + INSET_MARGIN / 2 - 6;
            const iy = bb.cy; // keep inset roughly level with real ACT
            return (
              <g>
                {/* leader from real location to the inset */}
                <line
                  x1={act.cx}
                  y1={act.cy}
                  x2={ix}
                  y2={iy}
                  stroke="#94a3b8"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <circle cx={act.cx} cy={act.cy} r={3} fill={isActive ? base : "#475569"} />
                {/* magnification backing */}
                <circle
                  cx={ix}
                  cy={iy}
                  r={size * 0.72}
                  fill="#ffffff"
                  stroke={isActive ? base : "#cbd5e1"}
                  strokeWidth={1.25}
                />
                {/* scaled ACT shape, centred on (ix, iy) */}
                <g
                  transform={`translate(${ix} ${iy}) scale(${s}) translate(${-bb.cx} ${-bb.cy})`}
                  tabIndex={0}
                  role="button"
                  aria-label="Australian Capital Territory: Work Health and Safety Act 2011"
                  onMouseEnter={() => setActive("ACT")}
                  onFocus={() => setActive("ACT")}
                  onClick={() => setActive("ACT")}
                  style={{ cursor: "pointer", outline: "none" }}
                >
                  <path
                    d={act.d}
                    style={{
                      fill: isActive ? base : `${base}40`,
                      stroke: base,
                      strokeWidth: 1.2 / s,
                      transition: "fill 0.25s ease",
                    }}
                  />
                </g>
                <text
                  x={ix}
                  y={iy + size * 0.72 + 14}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="system-ui"
                  fill={isActive ? "#075985" : "#64748b"}
                  style={{ pointerEvents: "none" }}
                >
                  ACT
                </text>
              </g>
            );
          })()}
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
