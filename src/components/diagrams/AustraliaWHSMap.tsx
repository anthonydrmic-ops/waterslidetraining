"use client";

import { useState } from "react";

interface Jurisdiction {
  code: string;
  name: string;
  act: string;
  regulator: string;
  note: string;
  /** Victoria is the odd one out - flagged for emphasis. */
  exception?: boolean;
  gridColumn: string;
  gridRow: string;
}

const JURISDICTIONS: Jurisdiction[] = [
  {
    code: "WA",
    name: "Western Australia",
    act: "Work Health and Safety Act 2020",
    regulator: "WorkSafe WA",
    note: "Adopted the model WHS laws in 2022 (its own 2020 Act). Uses PCBU.",
    gridColumn: "1",
    gridRow: "2",
  },
  {
    code: "NT",
    name: "Northern Territory",
    act: "Work Health and Safety (National Uniform Legislation) Act 2011",
    regulator: "NT WorkSafe",
    note: "Harmonised model WHS law. Uses PCBU.",
    gridColumn: "2",
    gridRow: "1",
  },
  {
    code: "QLD",
    name: "Queensland",
    act: "Work Health and Safety Act 2011",
    regulator: "Workplace Health and Safety Queensland",
    note: "Harmonised model WHS law. Uses PCBU.",
    gridColumn: "3",
    gridRow: "1",
  },
  {
    code: "SA",
    name: "South Australia",
    act: "Work Health and Safety Act 2012",
    regulator: "SafeWork SA",
    note: "Harmonised model WHS law. Uses PCBU.",
    gridColumn: "2",
    gridRow: "2",
  },
  {
    code: "NSW",
    name: "New South Wales",
    act: "Work Health and Safety Act 2011",
    regulator: "SafeWork NSW",
    note: "Harmonised model WHS law. Uses PCBU.",
    gridColumn: "3",
    gridRow: "2",
  },
  {
    code: "ACT",
    name: "Australian Capital Territory",
    act: "Work Health and Safety Act 2011",
    regulator: "WorkSafe ACT",
    note: "Harmonised model WHS law. Uses PCBU.",
    gridColumn: "4",
    gridRow: "2",
  },
  {
    code: "VIC",
    name: "Victoria",
    act: "Occupational Health and Safety Act 2004",
    regulator: "WorkSafe Victoria",
    note: "The only state that has NOT adopted the model WHS laws. Uses 'employer' rather than 'PCBU'.",
    exception: true,
    gridColumn: "3",
    gridRow: "3",
  },
  {
    code: "TAS",
    name: "Tasmania",
    act: "Work Health and Safety Act 2012",
    regulator: "WorkSafe Tasmania",
    note: "Harmonised model WHS law. Uses PCBU.",
    gridColumn: "3",
    gridRow: "4",
  },
];

export function AustraliaWHSMap() {
  const [activeCode, setActiveCode] = useState<string>("NSW");
  const active = JURISDICTIONS.find((j) => j.code === activeCode)!;

  return (
    <div className="w-full">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Work Safety Law by Jurisdiction
      </p>

      <div className="flex flex-col sm:flex-row gap-5 items-stretch">
        {/* Tile map */}
        <div
          className="grid gap-2 shrink-0 mx-auto sm:mx-0"
          style={{
            gridTemplateColumns: "repeat(4, minmax(46px, 1fr))",
            gridTemplateRows: "repeat(4, 46px)",
            width: "min(100%, 240px)",
          }}
        >
          {JURISDICTIONS.map((j) => {
            const isActive = j.code === activeCode;
            const base = j.exception ? "#d97706" : "#0891b2";
            return (
              <button
                key={j.code}
                onMouseEnter={() => setActiveCode(j.code)}
                onFocus={() => setActiveCode(j.code)}
                onClick={() => setActiveCode(j.code)}
                aria-label={`${j.name}: ${j.act}`}
                style={{
                  gridColumn: j.gridColumn,
                  gridRow: j.gridRow,
                  background: isActive ? base : `${base}14`,
                  borderColor: isActive ? base : `${base}33`,
                  color: isActive ? "#ffffff" : base,
                }}
                className="rounded-lg border text-xs font-bold flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.04] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-cyan-400/50"
              >
                {j.code}
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div
          className="flex-1 rounded-xl border p-4 md:p-5 transition-colors duration-300"
          style={{
            background: active.exception ? "rgba(217,119,6,0.05)" : "rgba(8,145,178,0.04)",
            borderColor: active.exception ? "rgba(217,119,6,0.2)" : "rgba(8,145,178,0.15)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: active.exception ? "#d97706" : "#0891b2",
                color: "#fff",
              }}
            >
              {active.code}
            </span>
            <span className="text-sm font-semibold text-stone-800">{active.name}</span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-0.5">
            Primary Act
          </p>
          <p className="text-sm font-medium text-stone-700 mb-3 leading-snug">{active.act}</p>
          <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-0.5">
            Regulator
          </p>
          <p className="text-sm text-stone-700 mb-3 leading-snug">{active.regulator}</p>
          <p className="text-xs text-stone-500 leading-relaxed">{active.note}</p>
        </div>
      </div>

      <p className="text-[11px] text-stone-400 mt-3 text-center sm:text-left">
        Hover or tap a state or territory. Victoria (amber) is the only jurisdiction outside the harmonised model WHS laws.
      </p>
    </div>
  );
}
