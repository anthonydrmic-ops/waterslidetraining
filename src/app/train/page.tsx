"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Lightning,
  Eye,
  Drop,
  FirstAid,
  Certificate,
  Blueprint,
  ListChecks,
  Lock,
} from "@phosphor-icons/react";
import { modules, getTotalLessons } from "@/data/training-modules";
import { defaultProgress, refreshProgress, getProgress, getCompletionPercentage, isLessonUnlocked } from "@/lib/progress-store";
import Link from "next/link";

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
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] as const },
  },
};

export default function TrainPage() {
  const [progress, setProgress] = useState(defaultProgress);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    refreshProgress().then((p) => {
      setProgress(p);
      setMounted(true);
    });
  }, []);

  const totalLessons = getTotalLessons();
  const completionPct = mounted ? getCompletionPercentage(totalLessons) : 0;
  const completedCount = mounted ? progress.completedLessons.length : 0;

  return (
    <div className="min-h-[100dvh] bg-[var(--background)] relative">
      <div className="noise-overlay" />

      {/* Floating Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 pt-5">
        <div className="max-w-[1400px] mx-auto">
          <div className="nav-glass rounded-full px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 active:scale-[0.95] transition-all duration-300"
              >
                <ArrowLeft size={14} weight="bold" className="text-stone-500" />
              </Link>
              <div className="flex items-center gap-2.5">
                <img src="/rest-group-logo.png" alt="REST Group" width={28} height={28} className="rounded-lg" />
                <span className="text-sm font-semibold tracking-tight text-stone-700">
                  Training Modules
                </span>
              </div>
            </div>
            {mounted && (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-[11px] text-stone-400 font-mono">
                  {completedCount}/{totalLessons}
                </span>
                <div className="w-20 h-1.5 rounded-full bg-stone-200/60 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[var(--accent)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPct}%` }}
                    transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                  />
                </div>
                <span className="text-[11px] font-mono font-semibold text-stone-600">
                  {completionPct}%
                </span>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="mb-10"
        >
          <div className="eyebrow bg-stone-100 border border-stone-200/60 text-stone-500 mb-5">
            {modules.length} Modules
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-stone-900 mb-2">
            Your Training Path
          </h1>
          <p className="text-stone-400 text-base max-w-[55ch] leading-relaxed">
            Work through each module sequentially. Complete all lessons and pass
            the final assessment to earn your certification.
          </p>
        </motion.div>

        {/* Module list */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-5"
        >
          {modules.map((mod, modIndex) => {
            const Icon = iconMap[mod.icon] || ShieldCheck;
            const moduleLessonIds = mod.lessons.map((l) => l.id);
            const completedInModule = mounted
              ? moduleLessonIds.filter((id) =>
                  progress.completedLessons.includes(id)
                ).length
              : 0;
            const isModuleComplete =
              completedInModule === moduleLessonIds.length &&
              moduleLessonIds.length > 0;

            return (
              <motion.div key={mod.id} variants={fadeUp}>
                <div className="card-shell">
                  <div className="card-core overflow-hidden">
                    {/* Module header */}
                    <div className="p-6 md:p-8 border-b border-stone-100/80">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: mod.color + "10" }}
                        >
                          <Icon
                            size={24}
                            weight="duotone"
                            style={{ color: mod.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-300">
                              Module {String(mod.number).padStart(2, "0")}
                            </span>
                            {isModuleComplete && (
                              <CheckCircle
                                size={16}
                                weight="fill"
                                className="text-emerald-500"
                              />
                            )}
                            {mounted && progress.completedModules?.includes(mod.id) && (
                              <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: mod.color + "12",
                                  color: mod.color,
                                }}
                              >
                                {mod.badge.label}
                              </span>
                            )}
                          </div>
                          <h2 className="text-lg md:text-xl font-bold tracking-tight text-stone-800 mb-1">
                            {mod.title}
                          </h2>
                          <p className="text-sm text-stone-400 leading-relaxed max-w-[65ch]">
                            {mod.description}
                          </p>
                        </div>
                        {mounted && (
                          <div className="hidden md:flex items-center gap-2.5 shrink-0">
                            <span className="text-[11px] font-mono text-stone-400">
                              {completedInModule}/{moduleLessonIds.length}
                            </span>
                            <div className="w-16 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${(completedInModule / moduleLessonIds.length) * 100}%`,
                                  backgroundColor: mod.color,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lessons */}
                    <div className="divide-y divide-stone-50">
                      {mod.lessons.map((lesson, lessonIndex) => {
                        const isCompleted =
                          mounted && progress.completedLessons.includes(lesson.id);
                        const isLocked =
                          mounted && !isLessonUnlocked(lesson.id, modules);
                        const quizScore =
                          mounted ? progress.quizScores[lesson.id] : null;

                        const content = (
                          <div
                            className={`group px-6 md:px-8 py-4 flex items-center gap-4 transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                              isLocked
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:bg-stone-50/60"
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold transition-all duration-300 ${
                                isCompleted
                                  ? "bg-emerald-50 text-emerald-600"
                                  : isLocked
                                  ? "bg-stone-100 text-stone-300"
                                  : "bg-stone-100 text-stone-400 group-hover:bg-[var(--accent-muted)] group-hover:text-[var(--accent)]"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle size={18} weight="fill" />
                              ) : isLocked ? (
                                <Lock size={14} weight="bold" />
                              ) : (
                                `${modIndex + 1}.${lessonIndex + 1}`
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium transition-colors duration-300 ${
                                  isCompleted
                                    ? "text-stone-400"
                                    : isLocked
                                    ? "text-stone-400"
                                    : "text-stone-700 group-hover:text-[var(--accent)]"
                                }`}
                              >
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-[11px] text-stone-300 flex items-center gap-1">
                                  <Clock size={11} />
                                  {lesson.duration}
                                </span>
                                {quizScore && (
                                  <span className="text-[11px] text-stone-300">
                                    Quiz: {quizScore.score}/{quizScore.total}
                                  </span>
                                )}
                              </div>
                            </div>
                            {!isLocked && (
                              <ArrowRight
                                size={14}
                                className="text-stone-200 group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] shrink-0"
                              />
                            )}
                          </div>
                        );

                        return isLocked ? (
                          <div key={lesson.id}>{content}</div>
                        ) : (
                          <Link
                            key={lesson.id}
                            href={`/train/${mod.id}/${lesson.id}`}
                          >
                            {content}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
