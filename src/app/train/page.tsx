"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Trophy,
  CaretDown,
  Scales,
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
  scales: Scales,
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
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [showAssessmentPrompt, setShowAssessmentPrompt] = useState(false);

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
        {/* Header with badges */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="mb-10 flex items-start justify-between gap-8"
        >
          <div>
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
          </div>

          {/* Badge grid - 9 module badges (no assessment) */}
          <div className="hidden lg:grid grid-cols-3 gap-3 shrink-0">
            {modules.filter((m) => m.id !== "assessment").map((mod) => {
              const Icon = iconMap[mod.icon] || ShieldCheck;
              const earned = mounted && progress.completedModules?.includes(mod.id);
              return (
                <div
                  key={mod.id}
                  className="group"
                  title={`${mod.badge.label}${earned ? " - Earned" : " - Locked"}`}
                  style={{ perspective: "600px" }}
                >
                  <div
                    className={`relative w-[68px] h-[68px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      earned
                        ? "cursor-pointer [transform-style:preserve-3d] group-hover:[transform:rotateY(360deg)]"
                        : ""
                    }`}
                  >
                    {/* Outer hexagon-ish shield shape */}
                    <div
                      className={`absolute inset-0 rounded-2xl transition-all duration-700 ${
                        earned
                          ? "shadow-[0_4px_20px_rgba(0,0,0,0.12),0_0_40px_var(--badge-glow)] group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.18),0_0_60px_var(--badge-glow)]"
                          : "shadow-none"
                      }`}
                      style={{
                        "--badge-glow": earned ? mod.color + "30" : "transparent",
                        background: earned
                          ? `linear-gradient(145deg, ${mod.color}18, ${mod.color}08)`
                          : "rgba(0,0,0,0.02)",
                        border: earned
                          ? `2px solid ${mod.color}30`
                          : "2px solid rgba(0,0,0,0.04)",
                      } as React.CSSProperties}
                    />

                    {/* Inner medal disc */}
                    <div
                      className={`absolute inset-[5px] rounded-xl flex items-center justify-center transition-all duration-700 ${
                        earned
                          ? ""
                          : ""
                      }`}
                      style={{
                        background: earned
                          ? `linear-gradient(145deg, #ffffff, ${mod.color}08)`
                          : "linear-gradient(145deg, #fafafa, #f0f0f0)",
                        boxShadow: earned
                          ? `inset 0 1px 2px rgba(255,255,255,0.8), inset 0 -1px 2px ${mod.color}15, 0 2px 8px rgba(0,0,0,0.06)`
                          : "inset 0 1px 2px rgba(255,255,255,0.5), 0 1px 3px rgba(0,0,0,0.03)",
                      }}
                    >
                      {/* Metallic rim accent */}
                      <div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          border: earned
                            ? `1.5px solid ${mod.color}25`
                            : "1.5px solid rgba(0,0,0,0.04)",
                          background: earned
                            ? `linear-gradient(180deg, ${mod.color}10 0%, transparent 40%, ${mod.color}08 100%)`
                            : "none",
                        }}
                      />

                      <Icon
                        size={28}
                        weight="fill"
                        className="relative z-10"
                        style={{
                          color: earned ? mod.color : "#ccc",
                          filter: earned
                            ? `drop-shadow(0 1px 2px ${mod.color}40)`
                            : "grayscale(100%)",
                          opacity: earned ? 1 : 0.3,
                        }}
                      />
                    </div>

                    {/* Shine overlay for earned badges */}
                    {earned && (
                      <div
                        className="absolute inset-[5px] rounded-xl overflow-hidden pointer-events-none"
                      >
                        <div
                          className="absolute -inset-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                          style={{
                            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
                            animation: "none",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Certificate banner - shown when user is certified */}
        {mounted && progress.certified && (
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="mb-8"
          >
            <Link href="/train/certified">
              <div className="card-shell" style={{ background: "rgba(4, 120, 87, 0.04)", borderColor: "rgba(4, 120, 87, 0.1)" }}>
                <div className="card-core p-5 flex items-center gap-4 hover:bg-emerald-50/30 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Trophy size={24} weight="fill" className="text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-emerald-800">
                      Course Complete - You&apos;re Certified
                    </p>
                    <p className="text-xs text-emerald-600/60 mt-0.5">
                      View your certificate, download PDF, or share on social media
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1.5 leading-relaxed">
                      All modules and lessons remain accessible - revisit anytime for a refresher or reference.
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-emerald-400 shrink-0" />
                </div>
              </div>
            </Link>
          </motion.div>
        )}

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

            // Assessment module locked until all other modules completed
            const isAssessmentLocked = mod.id === "assessment" && mounted &&
              !modules.filter((m) => m.id !== "assessment").every((m) =>
                progress.completedModules?.includes(m.id)
              );

            const isExpanded = expandedModule === mod.id;

            return (
              <motion.div key={mod.id} variants={fadeUp}>
                <div
                  className={`card-shell transition-all duration-500 ${isAssessmentLocked ? "opacity-50" : ""}`}
                  style={{
                    boxShadow: isExpanded
                      ? `0 8px 40px rgba(0,0,0,0.08), 0 0 0 1px ${mod.color}15, 0 0 60px ${mod.color}08`
                      : undefined,
                  }}
                >
                  <div className="card-core overflow-hidden">
                    {/* Module header - clickable accordion trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isAssessmentLocked) return;
                        if (mod.id === "assessment") {
                          setShowAssessmentPrompt(true);
                          return;
                        }
                        setExpandedModule(isExpanded ? null : mod.id);
                      }}
                      className={`w-full text-left p-6 md:p-8 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] relative overflow-hidden ${
                        isAssessmentLocked ? "cursor-not-allowed" : "cursor-pointer"
                      } ${isExpanded ? "" : "hover:bg-stone-50/40"}`}
                    >
                      {/* Subtle gradient accent on expand */}
                      <div
                        className="absolute inset-0 opacity-0 transition-opacity duration-700 pointer-events-none"
                        style={{
                          opacity: isExpanded ? 1 : 0,
                          background: `linear-gradient(135deg, ${mod.color}04 0%, transparent 60%)`,
                        }}
                      />

                      {/* Animated left accent bar */}
                      <div
                        className="absolute left-0 top-[12%] bottom-[12%] w-[3px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                        style={{
                          backgroundColor: mod.color,
                          opacity: isExpanded ? 1 : 0,
                          transform: isExpanded ? "scaleY(1)" : "scaleY(0.3)",
                        }}
                      />

                      <div className="flex items-start gap-4 relative">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500"
                          style={{
                            backgroundColor: isExpanded ? mod.color + "18" : mod.color + "10",
                            boxShadow: isExpanded ? `0 4px 16px ${mod.color}20` : "none",
                          }}
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
                          <p className={`text-sm text-stone-400 leading-relaxed max-w-[65ch] transition-all duration-500 ${isExpanded ? "opacity-100" : "opacity-70"}`}>
                            {mod.description}
                          </p>
                          {isAssessmentLocked && (
                            <div className="flex items-center gap-2 mt-3 text-xs text-stone-400 bg-stone-100/80 px-3 py-1.5 rounded-full w-fit">
                              <Lock size={12} weight="bold" />
                              Complete all modules to unlock
                            </div>
                          )}
                        </div>
                        <div className="hidden md:flex items-center gap-4 shrink-0">
                          {mounted && mod.id !== "assessment" && (
                            <div className="flex items-center gap-2.5">
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
                          {mod.id === "assessment" && !isAssessmentLocked && (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: mod.color + "12" }}
                            >
                              <ArrowRight
                                size={14}
                                weight="bold"
                                style={{ color: mod.color }}
                              />
                            </div>
                          )}
                          {mod.id !== "assessment" && !isAssessmentLocked && (
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                              className="w-8 h-8 rounded-full bg-stone-100/80 flex items-center justify-center"
                              style={{
                                backgroundColor: isExpanded ? mod.color + "12" : undefined,
                              }}
                            >
                              <CaretDown
                                size={14}
                                weight="bold"
                                className="transition-colors duration-300"
                                style={{ color: isExpanded ? mod.color : "#a8a29e" }}
                              />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Lessons - accordion body (skip for assessment) */}
                    <AnimatePresence initial={false}>
                      {isExpanded && mod.id !== "assessment" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
                            opacity: { duration: 0.3, delay: 0.1 },
                          }}
                          className="overflow-hidden"
                        >
                          <div
                            className="border-t transition-colors duration-500"
                            style={{ borderColor: mod.color + "15" }}
                          >
                            {mod.lessons.map((lesson, lessonIndex) => {
                              const isCompleted =
                                mounted && progress.completedLessons.includes(lesson.id);
                              const isLocked =
                                mounted && !isLessonUnlocked(lesson.id, modules);
                              const quizScore =
                                mounted ? progress.quizScores[lesson.id] : null;

                              const content = (
                                <motion.div
                                  initial={{ opacity: 0, x: -12 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.35,
                                    delay: lessonIndex * 0.06,
                                    ease: [0.32, 0.72, 0, 1],
                                  }}
                                  className={`group px-6 md:px-8 py-4 flex items-center gap-4 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] border-b last:border-b-0 border-stone-50 ${
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
                                </motion.div>
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Assessment confirmation popup */}
      <AnimatePresence>
        {showAssessmentPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6"
            onClick={() => setShowAssessmentPrompt(false)}
          >
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="relative w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-shell" style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(5,150,105,0.1)" }}>
                <div className="card-core p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5">
                    <Certificate size={32} weight="duotone" className="text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-stone-900 mb-2">
                    Final Assessment
                  </h3>
                  <p className="text-sm text-stone-400 leading-relaxed mb-2 max-w-[38ch] mx-auto">
                    20 questions drawn randomly from across all modules. You need 80% or higher to pass and earn your certification.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-stone-400 mb-6">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      ~20 min
                    </span>
                    <span className="w-1 h-1 rounded-full bg-stone-200" />
                    <span>20 Questions</span>
                    <span className="w-1 h-1 rounded-full bg-stone-200" />
                    <span>80% to pass</span>
                  </div>
                  <div className="space-y-3">
                    <Link
                      href="/train/assessment/9-1"
                      className="w-full inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:scale-[0.97] transition-all duration-300 shadow-[0_4px_20px_rgba(5,150,105,0.3)]"
                    >
                      Start Assessment
                      <ArrowRight size={16} weight="bold" />
                    </Link>
                    <button
                      onClick={() => setShowAssessmentPrompt(false)}
                      className="w-full py-3.5 rounded-full bg-stone-100 text-stone-500 text-sm font-medium hover:bg-stone-200 active:scale-[0.97] transition-all duration-300"
                    >
                      Not Yet
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
