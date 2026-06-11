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
  ArrowCounterClockwise,
  Scales,
  PersonSimpleSwim,
} from "@phosphor-icons/react";
import { modules, getTotalLessons } from "@/data/training-modules";
import {
  defaultProgress,
  refreshProgress,
  getCompletionPercentage,
  isLessonUnlocked,
  getModuleCumulativeScore,
} from "@/lib/progress-store";
import { TrainPageLoader } from "@/components/TrainSkeletons";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<any>> = {
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

// Lesson durations are stored as strings like "12 min" — parse and re-format
// them so modules and the resume banner can show real time estimates.
function parseMinutes(duration: string): number {
  const n = parseInt(duration, 10);
  return Number.isFinite(n) ? n : 0;
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

// The next lesson the user should do: the first unlocked, not-yet-completed
// lesson in order. Drives the resume banner and the auto-expanded module.
function findResumeTarget(completedLessons: string[]) {
  for (const m of modules) {
    const idx = m.lessons.findIndex(
      (l) => !completedLessons.includes(l.id) && isLessonUnlocked(l.id, modules)
    );
    if (idx !== -1) {
      return { module: m, lesson: m.lessons[idx], lessonNumber: idx + 1, total: m.lessons.length };
    }
  }
  return null;
}

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
  const [dataLoaded, setDataLoaded] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [showAssessmentPrompt, setShowAssessmentPrompt] = useState(false);
  const [newlyEarned, setNewlyEarned] = useState<string[]>([]);

  // Hold the loader for a brief minimum so it reads as a deliberate transition
  // rather than a flicker, even when progress resolves instantly from cache.
  const mounted = dataLoaded && minElapsed;

  useEffect(() => {
    const minTimer = setTimeout(() => setMinElapsed(true), 750);
    refreshProgress().then((p) => {
      setProgress(p);
      setDataLoaded(true);

      // Detect badges earned since the user last saw this page, so they can be
      // celebrated with a one-time "announce" animation rather than appearing
      // silently. Seen badges are remembered in localStorage.
      try {
        const SEEN_KEY = "slidesure-seen-badges";
        const earned = (p.completedModules ?? []).filter((id) => id !== "assessment");
        const seen: string[] = JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
        const fresh = earned.filter((id) => !seen.includes(id));
        if (fresh.length > 0) setNewlyEarned(fresh);
        localStorage.setItem(SEEN_KEY, JSON.stringify(earned));
      } catch {
        /* localStorage unavailable — skip the celebration, no harm done */
      }

      // Land the user looking at exactly where they left off by opening the
      // module that holds their next lesson (assessment has no body to open).
      const rt = findResumeTarget(p.completedLessons);
      if (rt && rt.module.id !== "assessment") {
        setExpandedModule(rt.module.id);
      }
    });
    return () => clearTimeout(minTimer);
  }, []);

  const totalLessons = getTotalLessons();
  const completionPct = mounted ? getCompletionPercentage(totalLessons) : 0;
  const completedCount = mounted ? progress.completedLessons.length : 0;

  const resumeTarget = mounted ? findResumeTarget(progress.completedLessons) : null;
  const hasStarted = completedCount > 0;

  // Reading time left across every not-yet-completed lesson, for the resume banner.
  const remainingMins = mounted
    ? modules.reduce(
        (acc, m) =>
          acc +
          m.lessons.reduce(
            (a, l) =>
              a +
              (progress.completedLessons.includes(l.id) ? 0 : parseMinutes(l.duration)),
            0
          ),
        0
      )
    : 0;

  const ResumeIcon = resumeTarget
    ? iconMap[resumeTarget.module.icon] || ShieldCheck
    : ShieldCheck;

  // Hold a branded loader until progress has resolved, so the resume banner,
  // badges and completion stats animate in together instead of popping in after
  // the page has already painted.
  if (!mounted) return <TrainPageLoader />;

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
            {/* Compact progress for small screens */}
            {mounted && (
              <div className="flex md:hidden items-center gap-2">
                <div className="w-14 h-1.5 rounded-full bg-stone-200/60 overflow-hidden">
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
            <p className="text-stone-500 text-base max-w-[55ch] leading-relaxed">
              Work through each module sequentially. Complete all lessons and pass
              the final assessment to earn your certification.
            </p>
          </div>

          {/* Badge grid - 9 module badges (no assessment) */}
          <div className="hidden lg:grid grid-cols-3 gap-3 shrink-0">
            {modules.filter((m) => m.id !== "assessment").map((mod) => {
              const Icon = iconMap[mod.icon] || ShieldCheck;
              const earned = mounted && progress.completedModules?.includes(mod.id);
              const isNew = earned && newlyEarned.includes(mod.id);
              const badgeScore = earned ? getModuleCumulativeScore(mod.id, modules) : null;
              return (
                <motion.div
                  key={mod.id}
                  className="group relative"
                  style={{ perspective: "600px" }}
                  initial={isNew ? { scale: 0.4, opacity: 0 } : false}
                  animate={isNew ? { scale: 1, opacity: 1 } : undefined}
                  transition={
                    isNew
                      ? {
                          type: "spring",
                          stiffness: 320,
                          damping: 15,
                          delay: 0.3 + newlyEarned.indexOf(mod.id) * 0.14,
                        }
                      : undefined
                  }
                >
                  {isNew && (
                    <span
                      className="badge-ring"
                      style={{ border: `2px solid ${mod.color}` }}
                    />
                  )}
                  {/* Hover tooltip — badge name + module score, themed to the module.
                      Opens BELOW the badge: the fixed nav glass sits above page
                      content, so an upward tooltip would slide behind it on the
                      top row. Below always has free space and never meets the bar. */}
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-30 pointer-events-none opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    role="tooltip"
                  >
                    <div
                      className="w-2 h-2 bg-white rotate-45 mx-auto -mb-[5px] relative z-10"
                      style={{
                        borderLeft: `1px solid color-mix(in srgb, ${mod.color} 22%, transparent)`,
                        borderTop: `1px solid color-mix(in srgb, ${mod.color} 22%, transparent)`,
                      }}
                    />
                    <div
                      className="bg-white rounded-xl px-3.5 py-2.5 w-max max-w-[200px] text-center shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                      style={{
                        border: `1px solid color-mix(in srgb, ${mod.color} 22%, transparent)`,
                      }}
                    >
                      <p className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                        Module {String(mod.number).padStart(2, "0")}
                      </p>
                      <p
                        className="text-[12px] font-semibold tracking-tight mt-0.5"
                        style={{ color: mod.color }}
                      >
                        {mod.badge.label}
                      </p>
                      {earned && badgeScore && badgeScore.total > 0 ? (
                        <p className="text-[13px] font-mono font-bold text-stone-800 mt-1">
                          {badgeScore.pct}%
                          <span className="text-stone-400 font-medium text-[11px]">
                            {" "}&middot; {badgeScore.score}/{badgeScore.total}
                          </span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-stone-400 mt-1 flex items-center justify-center gap-1">
                          <Lock size={9} weight="bold" />
                          Not yet earned
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`relative w-[68px] h-[68px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      earned
                        ? "cursor-pointer [transform-style:preserve-3d] group-hover:[transform:rotateY(360deg)]"
                        : ""
                    }`}
                  >
                    {earned ? (
                      /* Earned: faceted hexagonal medal - a distinct shape, not just a recoloured square */
                      <div
                        className="absolute inset-0"
                        style={{
                          filter: `drop-shadow(0 4px 10px ${mod.color}40) drop-shadow(0 0 16px ${mod.color}33)`,
                        }}
                      >
                        {/* Coloured rim hexagon */}
                        <div
                          className="absolute inset-0"
                          style={{
                            clipPath:
                              "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                            background: `linear-gradient(145deg, ${mod.color}, ${mod.color}b0)`,
                          }}
                        />
                        {/* Inner face */}
                        <div
                          className="absolute inset-[3px] flex items-center justify-center overflow-hidden"
                          style={{
                            clipPath:
                              "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                            background: `linear-gradient(150deg, #ffffff 0%, ${mod.color}12 100%)`,
                          }}
                        >
                          {/* Top sheen */}
                          <div
                            className="absolute inset-x-0 top-0 h-1/2"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, transparent 100%)",
                            }}
                          />
                          {/* Hover shine sweep */}
                          <div
                            className="absolute -inset-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)",
                            }}
                          />
                          <Icon
                            size={26}
                            weight="fill"
                            className="relative z-10"
                            style={{
                              color: mod.color,
                              filter: `drop-shadow(0 1px 1px ${mod.color}55)`,
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      /* Locked: plain muted rounded square with a lock */
                      <div
                        className="absolute inset-0 rounded-2xl flex items-center justify-center"
                        style={{
                          background: "rgba(0,0,0,0.02)",
                          border: "2px solid rgba(0,0,0,0.05)",
                        }}
                      >
                        <Icon
                          size={26}
                          weight="fill"
                          style={{ color: "#ccc", filter: "grayscale(100%)", opacity: 0.25 }}
                        />
                        <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-stone-200 flex items-center justify-center">
                          <Lock size={9} weight="bold" className="text-stone-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
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

        {/* Resume / Start banner — drops the user straight back into their next lesson */}
        {mounted && !progress.certified && resumeTarget && (
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="mb-8"
          >
            <Link href={`/train/${resumeTarget.module.id}/${resumeTarget.lesson.id}`}>
              <div
                className="card-shell"
                style={{
                  background: `color-mix(in srgb, ${resumeTarget.module.color} 5%, transparent)`,
                  borderColor: `color-mix(in srgb, ${resumeTarget.module.color} 16%, transparent)`,
                }}
              >
                <div className="card-core p-5 flex items-center gap-4 group transition-colors duration-300 hover:bg-white/40">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `color-mix(in srgb, ${resumeTarget.module.color} 14%, transparent)` }}
                  >
                    <ResumeIcon size={24} weight="duotone" style={{ color: resumeTarget.module.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[10px] font-semibold uppercase tracking-wider mb-0.5"
                      style={{ color: resumeTarget.module.color }}
                    >
                      {hasStarted ? "Resume training" : "Start training"}
                    </p>
                    <p className="text-sm font-semibold text-stone-800 truncate">
                      {resumeTarget.module.title} &middot; {resumeTarget.lesson.title}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Lesson {resumeTarget.lessonNumber} of {resumeTarget.total} &middot; {resumeTarget.lesson.duration}
                      {remainingMins > 0 && (
                        <span className="hidden sm:inline">
                          {" "}&middot; ~{formatDuration(remainingMins)} left in course
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-white text-sm font-medium group-hover:bg-stone-800 transition-colors duration-300 shrink-0">
                    {hasStarted ? "Continue" : "Begin"}
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-0.5 transition-transform duration-300"
                    />
                  </span>
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
                            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                              Module {String(mod.number).padStart(2, "0")}
                            </span>
                            <span className="text-[10px] font-mono text-stone-300">
                              &middot;{" "}
                              {formatDuration(
                                mod.lessons.reduce((a, l) => a + parseMinutes(l.duration), 0)
                              )}
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
                          <p className={`text-sm text-stone-500 leading-relaxed max-w-[65ch] transition-all duration-500 ${isExpanded ? "opacity-100" : "opacity-70"}`}>
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
                                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                                        <Clock size={11} />
                                        {lesson.duration}
                                      </span>
                                      {quizScore && (
                                        <span className="text-[11px] text-stone-400">
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

                            {/* Module result — once every lesson is quizzed, link
                                to the result screen (pass celebration, or review +
                                retake on a fail). */}
                            {(() => {
                              const fullyQuizzed =
                                mounted &&
                                mod.lessons.every(
                                  (l) => progress.quizScores[l.id] != null
                                );
                              if (!fullyQuizzed) return null;
                              let s = 0;
                              let t = 0;
                              for (const l of mod.lessons) {
                                const qs = progress.quizScores[l.id];
                                if (qs) {
                                  s += qs.score;
                                  t += qs.total;
                                }
                              }
                              const pct = t > 0 ? Math.round((s / t) * 100) : 0;
                              const passed = pct >= 80;
                              return (
                                <Link
                                  href={`/train/${mod.id}/complete`}
                                  className="group flex items-center gap-4 px-6 md:px-8 py-4 border-t transition-colors duration-300 hover:bg-stone-50/60"
                                  style={{ borderColor: mod.color + "15" }}
                                >
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                      passed
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-red-50 text-red-500"
                                    }`}
                                  >
                                    {passed ? (
                                      <Trophy size={16} weight="fill" />
                                    ) : (
                                      <ArrowCounterClockwise size={15} weight="bold" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={`text-sm font-medium ${
                                        passed ? "text-emerald-700" : "text-red-600"
                                      }`}
                                    >
                                      {passed
                                        ? "Module passed"
                                        : "Module not passed - review & retake"}
                                    </p>
                                    <p className="text-[11px] text-stone-400 mt-0.5">
                                      Module result &middot; {pct}%
                                    </p>
                                  </div>
                                  <ArrowRight
                                    size={14}
                                    className="text-stone-300 group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all duration-300 shrink-0"
                                  />
                                </Link>
                              );
                            })()}
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
