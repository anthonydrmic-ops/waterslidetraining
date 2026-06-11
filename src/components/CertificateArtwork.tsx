"use client";

import {
  ShieldCheck,
  Lightning,
  Eye,
  Drop,
  FirstAid,
  Blueprint,
  ListChecks,
  Scales,
  PersonSimpleSwim,
} from "@phosphor-icons/react";
import { modules } from "@/data/training-modules";

/**
 * Certificate decoration, built entirely from inline SVG + solid rgba colours so
 * it rasterises reliably through html2canvas-pro when the PDF is generated.
 * Deliberately avoids conic-gradient / color-mix / oklch / clip-path, which the
 * rasteriser cannot reproduce.
 */

const NAVY = "#0B3A66";
const GOLD = "#C9A13B";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MEDAL_ICONS: Record<string, React.ComponentType<any>> = {
  blueprint: Blueprint,
  clipboard: ListChecks,
  waves: PersonSimpleSwim,
  controls: Lightning,
  magnifier: Eye,
  droplet: Drop,
  shield: ShieldCheck,
  siren: FirstAid,
  scales: Scales,
};

// Hexagon point sets for a 40x40 viewBox (outer rim + inset face).
const HEX_OUTER = "20,1 36.5,10.5 36.5,29.5 20,39 3.5,29.5 3.5,10.5";
const HEX_INNER = "20,4 33.9,12 33.9,28 20,36 6.1,28 6.1,12";

/**
 * The nine earned module medals, rendered as pure SVG hexagons (PDF-safe).
 * Shown on the certificate as proof of the full competency set.
 */
export function ModuleMedals({ size = 38 }: { size?: number }) {
  const mods = modules.filter((m) => m.id !== "assessment");
  return (
    <div className="flex justify-center gap-2 md:gap-2.5 flex-wrap">
      {mods.map((m) => {
        const Icon = MEDAL_ICONS[m.icon] || ShieldCheck;
        return (
          <div
            key={m.id}
            className="relative shrink-0"
            style={{ width: size, height: size }}
            title={m.badge.label}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 40 40"
              className="absolute inset-0"
              aria-hidden
            >
              <defs>
                <linearGradient id={`medal-${m.id}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={m.color} stopOpacity="0.85" />
                  <stop offset="100%" stopColor={m.color} stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <polygon points={HEX_OUTER} fill={`url(#medal-${m.id})`} />
              <polygon points={HEX_INNER} fill="#ffffff" />
              <polygon points={HEX_INNER} fill={m.color} opacity="0.06" />
              {/* Parchment veil — settles the colours into the certificate ground */}
              <polygon points={HEX_OUTER} fill="#fbf8f1" opacity="0.14" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon
                size={Math.round(size * 0.42)}
                weight="fill"
                style={{ color: m.color, opacity: 0.82 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Full-cover backdrop: engine-turned rosette, double-line frame, corner motifs. */
export function GuillocheBackdrop() {
  // A classic guilloché rosette — many rotated ellipses around a shared centre.
  const ellipses = Array.from({ length: 40 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
      {/* Rosette, faint, centred */}
      <svg
        viewBox="0 0 400 400"
        className="absolute left-1/2 top-1/2 w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <g opacity="0.05">
          {ellipses.map((_, i) => (
            <ellipse
              key={i}
              cx="200"
              cy="200"
              rx="165"
              ry="58"
              fill="none"
              stroke={NAVY}
              strokeWidth="0.5"
              transform={`rotate(${(i * 360) / ellipses.length} 200 200)`}
            />
          ))}
        </g>
      </svg>

      {/* Double-line frame */}
      <div
        className="absolute inset-[10px] rounded-[1.1rem]"
        style={{ border: `1.5px solid rgba(11,58,102,0.20)` }}
      />
      <div
        className="absolute inset-[16px] rounded-[0.9rem]"
        style={{ border: `1px solid rgba(201,161,59,0.45)` }}
      />

      {/* Corner flourishes */}
      {[
        "top-[18px] left-[18px]",
        "top-[18px] right-[18px] rotate-90",
        "bottom-[18px] right-[18px] rotate-180",
        "bottom-[18px] left-[18px] -rotate-90",
      ].map((pos, i) => (
        <svg
          key={i}
          width="26"
          height="26"
          viewBox="0 0 26 26"
          className={`absolute ${pos}`}
          aria-hidden
        >
          <path
            d="M1 1 L1 12 M1 1 L12 1"
            stroke={GOLD}
            strokeWidth="1.25"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="6" cy="6" r="1.6" fill={NAVY} opacity="0.5" />
        </svg>
      ))}
    </div>
  );
}

/** A foil-style seal medallion. `size` in px. */
export function FoilSeal({ size = 76 }: { size?: number }) {
  const r = size / 2;
  // 24-point scalloped rim built from alternating radii.
  const teeth = 36;
  const points: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * Math.PI * 2;
    const rad = i % 2 === 0 ? r : r * 0.9;
    points.push(`${r + rad * Math.cos(angle)},${r + rad * Math.sin(angle)}`);
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      style={{ filter: "drop-shadow(0 2px 4px rgba(140,100,20,0.35))" }}
    >
      <defs>
        <radialGradient id="foil-grad" cx="38%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#fbf1c8" />
          <stop offset="42%" stopColor="#e6c25a" />
          <stop offset="78%" stopColor="#bd8f2c" />
          <stop offset="100%" stopColor="#9a6f1e" />
        </radialGradient>
      </defs>
      {/* Scalloped rim */}
      <polygon points={points.join(" ")} fill="url(#foil-grad)" />
      {/* Inner disc */}
      <circle cx={r} cy={r} r={r * 0.74} fill="none" stroke="#fff4cf" strokeWidth="1" opacity="0.7" />
      <circle cx={r} cy={r} r={r * 0.66} fill="none" stroke="#8a6418" strokeWidth="0.75" opacity="0.5" />
      {/* Star emblem */}
      <Star cx={r} cy={r} R={r * 0.42} />
    </svg>
  );
}

function Star({ cx, cy, R }: { cx: number; cy: number; R: number }) {
  const r = R * 0.42;
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    pts.push(`${cx + rad * Math.cos(angle)},${cy + rad * Math.sin(angle)}`);
  }
  return <polygon points={pts.join(" ")} fill="#7a571a" opacity="0.85" />;
}
