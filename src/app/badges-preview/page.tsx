"use client";

import {
  ShieldCheck,
  Lightning,
  Eye,
  Drop,
  FirstAid,
  Certificate,
  Blueprint,
  ListChecks,
  Lock,
  Scales,
  PersonSimpleSwim,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";
import { modules } from "@/data/training-modules";

const iconMap: Record<string, PhosphorIcon> = {
  blueprint: Blueprint,
  clipboard: ListChecks,
  waves: PersonSimpleSwim,
  controls: Lightning,
  magnifier: Eye,
  droplet: Drop,
  shield: ShieldCheck,
  siren: FirstAid,
  certificate: Certificate,
  scales: Scales,
};

const HEX = "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)";

function EarnedBadge({ Icon, color }: { Icon: PhosphorIcon; color: string }) {
  return (
    <div
      className="relative w-[68px] h-[68px]"
      style={{ filter: `drop-shadow(0 4px 10px ${color}40) drop-shadow(0 0 16px ${color}33)` }}
    >
      <div
        className="absolute inset-0"
        style={{ clipPath: HEX, background: `linear-gradient(145deg, ${color}, ${color}b0)` }}
      />
      <div
        className="absolute inset-[3px] flex items-center justify-center overflow-hidden"
        style={{ clipPath: HEX, background: `linear-gradient(150deg, #ffffff 0%, ${color}12 100%)` }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1/2"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, transparent 100%)" }}
        />
        <Icon
          size={26}
          weight="fill"
          className="relative z-10"
          style={{ color, filter: `drop-shadow(0 1px 1px ${color}55)` }}
        />
      </div>
    </div>
  );
}

function LockedBadge({ Icon }: { Icon: PhosphorIcon }) {
  return (
    <div
      className="relative w-[68px] h-[68px] rounded-2xl flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.02)", border: "2px solid rgba(0,0,0,0.05)" }}
    >
      <Icon size={26} weight="fill" style={{ color: "#ccc", filter: "grayscale(100%)", opacity: 0.25 }} />
      <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-stone-200 flex items-center justify-center">
        <Lock size={9} weight="bold" className="text-stone-400" />
      </div>
    </div>
  );
}

export default function BadgesPreview() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 mb-1 text-center">
          Module Badges - Earned vs Locked
        </h1>
        <p className="text-sm text-stone-400 text-center mb-10">
          Earned badges are now a distinct hexagonal medal; locked badges stay a muted square with a lock.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {modules
            .filter((m) => m.id !== "assessment")
            .map((mod) => {
              const Icon = iconMap[mod.icon] || ShieldCheck;
              return (
                <div
                  key={mod.id}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-stone-200/60"
                >
                  <div className="flex items-end gap-5">
                    <div className="flex flex-col items-center gap-1.5">
                      <EarnedBadge Icon={Icon} color={mod.color} />
                      <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: mod.color }}>
                        Earned
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <LockedBadge Icon={Icon} />
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
                        Locked
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-stone-600 text-center leading-tight">
                    {mod.badge.label}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
