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
} from "@phosphor-icons/react";
import { modules } from "@/data/training-modules";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<any>> = {
  blueprint: Blueprint,
  clipboard: ListChecks,
  waves: Drop,
  controls: Lightning,
  magnifier: Eye,
  droplet: Drop,
  shield: ShieldCheck,
  siren: FirstAid,
  certificate: Certificate,
  scales: Scales,
};

export default function BadgesPreview() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F7FA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {modules.map((mod) => {
          const Icon = iconMap[mod.icon] || ShieldCheck;
          return (
            <div
              key={mod.id}
              style={{
                width: 160,
                height: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                filter: "grayscale(100%)",
                opacity: 0.35,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 28,
                  background: "rgba(0,0,0,0.02)",
                  border: "2px solid rgba(0,0,0,0.04)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 10,
                  borderRadius: 20,
                  background: "linear-gradient(145deg, #fafafa, #f0f0f0)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.5), 0 1px 3px rgba(0,0,0,0.03)",
                  border: "1.5px solid rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={64} weight="fill" style={{ color: "#ccc" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
