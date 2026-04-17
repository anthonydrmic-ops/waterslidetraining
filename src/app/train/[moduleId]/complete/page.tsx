"use client";

import { use, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Lightning,
  Eye,
  Drop,
  FirstAid,
  Certificate,
  Blueprint,
  ListChecks,
  ArrowRight,
  Trophy,
} from "@phosphor-icons/react";
import { modules } from "@/data/training-modules";
import {
  defaultProgress,
  refreshProgress,
  getProgress,
  isModuleComplete,
  completeModule,
} from "@/lib/progress-store";
import Link from "next/link";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const badgeIconMap: Record<string, React.ComponentType<any>> = {
  blueprint: Blueprint,
  clipboard: ListChecks,
  waves: Drop,
  controls: Lightning,
  magnifier: Eye,
  droplet: Drop,
  shield: ShieldCheck,
  siren: FirstAid,
  certificate: Certificate,
};

export default function ModuleCompletePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = use(params);
  const mod = modules.find((m) => m.id === moduleId);

  if (!mod) redirect("/train");
  if (moduleId === "assessment") redirect("/train");

  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(defaultProgress);

  useEffect(() => {
    refreshProgress().then(async (p) => {
      setProgress(p);
      const complete = isModuleComplete(moduleId, modules);
      if (!complete) {
        redirect(`/train/${moduleId}/${mod!.lessons[0].id}`);
        return;
      }
      await completeModule(moduleId);
      setProgress(getProgress());
      setMounted(true);
    });
  }, [moduleId, mod]);
  const fireConfetti = useCallback(() => {
    const defaults = {
      particleCount: 40,
      spread: 55,
      startVelocity: 30,
      decay: 0.94,
      gravity: 0.9,
      ticks: 120,
      colors: ["#1F7A8C", "#F05A28", "#FFD700"],
      disableForReducedMotion: true,
    };

    // Burst from the left
    confetti({
      ...defaults,
      angle: 60,
      origin: { x: 0, y: 0.65 },
    });

    // Burst from the right
    confetti({
      ...defaults,
      angle: 120,
      origin: { x: 1, y: 0.65 },
    });

    // A softer second wave after a short delay
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 25,
        angle: 75,
        origin: { x: 0.15, y: 0.55 },
      });
      confetti({
        ...defaults,
        particleCount: 25,
        angle: 105,
        origin: { x: 0.85, y: 0.55 },
      });
    }, 250);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Small delay so the card animation has started before confetti fires
      const timer = setTimeout(fireConfetti, 400);
      return () => clearTimeout(timer);
    }
  }, [mounted, fireConfetti]);

  const BadgeIcon = badgeIconMap[mod!.badge.icon] || ShieldCheck;

  // Find next module
  const currentModIndex = modules.findIndex((m) => m.id === moduleId);
  const nextMod =
    currentModIndex < modules.length - 1
      ? modules[currentModIndex + 1]
      : null;

  if (!mounted) {
    return (
      <div className="min-h-[100dvh] bg-[var(--background)]">
        <div className="noise-overlay" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--background)] relative flex items-center justify-center">
      <div className="noise-overlay" />

      <div className="relative w-full max-w-lg mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="card-shell">
            <div className="card-core p-8 md:p-12 text-center">
              {/* Trophy icon */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="flex justify-center mb-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                  <Trophy
                    size={32}
                    weight="fill"
                    className="text-emerald-500"
                  />
                </div>
              </motion.div>

              {/* Module complete text */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: [0.32, 0.72, 0, 1] }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold uppercase tracking-wider text-emerald-600 mb-5">
                  Module {String(mod!.number).padStart(2, "0")} Complete
                </div>

                <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-stone-900 mb-2">
                  {mod!.title}
                </h1>

                <p className="text-stone-400 text-sm md:text-base leading-relaxed max-w-[40ch] mx-auto mb-8">
                  You have completed all lessons and passed all knowledge checks
                  in this module.
                </p>
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7, ease: [0.32, 0.72, 0, 1] }}
                className="mb-8"
              >
                <div
                  className="inline-flex flex-col items-center gap-3 p-6 rounded-2xl border"
                  style={{
                    backgroundColor: mod!.color + "08",
                    borderColor: mod!.color + "20",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: mod!.color + "15" }}
                  >
                    <BadgeIcon
                      size={28}
                      weight="duotone"
                      style={{ color: mod!.color }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: mod!.color }}
                    >
                      {mod!.badge.label}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Badge Earned
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9, ease: [0.32, 0.72, 0, 1] }}
                className="space-y-3"
              >
                <Link
                  href="/train"
                  className="group w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[var(--cta)] text-white font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--cta-dark)] active:scale-[0.97] shadow-[0_4px_16px_rgba(240,90,40,0.25)]"
                >
                  Back to Training
                  <ArrowRight
                    size={16}
                    weight="bold"
                    className="group-hover:translate-x-0.5 transition-transform duration-300"
                  />
                </Link>

                {nextMod && (
                  <Link
                    href={`/train/${nextMod.id}/${nextMod.lessons[0].id}`}
                    className="group w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-stone-100 text-stone-600 text-sm font-medium hover:bg-stone-200 active:scale-[0.97] transition-all duration-300"
                  >
                    Continue to Module {nextMod.number}: {nextMod.title}
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-0.5 transition-transform duration-300"
                    />
                  </Link>
                )}
              </motion.div>

              {/* Progress note */}
              {mounted && (
                <p className="text-[11px] text-stone-300 mt-8">
                  {progress.completedModules.length} of {modules.length - 1}{" "}
                  training modules completed
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
