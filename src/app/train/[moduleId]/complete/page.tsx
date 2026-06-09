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
  ArrowCounterClockwise,
  Trophy,
  PersonSimpleSwim,
  Check,
  X,
} from "@phosphor-icons/react";
import { modules, type Module, type QuizQuestion } from "@/data/training-modules";
import {
  defaultProgress,
  refreshProgress,
  getProgress,
  completeModule,
  getModuleCumulativeScore,
  isModuleFullyQuizzed,
  resetModuleProgress,
  type UserProgress,
} from "@/lib/progress-store";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { TrainPageLoader } from "@/components/TrainSkeletons";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const badgeIconMap: Record<string, React.ComponentType<any>> = {
  blueprint: Blueprint,
  clipboard: ListChecks,
  waves: PersonSimpleSwim,
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

  const router = useRouter();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [progress, setProgress] = useState(defaultProgress);
  const [result, setResult] = useState<{ score: number; total: number; pct: number }>({
    score: 0,
    total: 0,
    pct: 0,
  });
  const [retaking, setRetaking] = useState(false);

  // Hold the loader for a brief minimum so scoring reads as a deliberate moment
  // rather than a flicker, even when the tally resolves instantly.
  const mounted = dataLoaded && minElapsed;

  useEffect(() => {
    const minTimer = setTimeout(() => setMinElapsed(true), 900);
    refreshProgress().then(async (p) => {
      // Can't grade a module until every lesson has been quizzed — send them back
      // to finish first.
      if (!isModuleFullyQuizzed(moduleId, modules)) {
        redirect(`/train/${moduleId}/${mod!.lessons[0].id}`);
        return;
      }
      const r = getModuleCumulativeScore(moduleId, modules);
      setResult(r);
      // Only a pass (>= 80%) earns the badge. A fail leaves the module un-awarded
      // so the learner can review and retake.
      if (r.pct >= 80) {
        await completeModule(moduleId);
        setProgress(getProgress());
      } else {
        setProgress(p);
      }
      setDataLoaded(true);
    });
    return () => clearTimeout(minTimer);
  }, [moduleId, mod]);

  const passed = result.pct >= 80;

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
    confetti({ ...defaults, angle: 60, origin: { x: 0, y: 0.65 } });
    confetti({ ...defaults, angle: 120, origin: { x: 1, y: 0.65 } });
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 25, angle: 75, origin: { x: 0.15, y: 0.55 } });
      confetti({ ...defaults, particleCount: 25, angle: 105, origin: { x: 0.85, y: 0.55 } });
    }, 250);
  }, []);

  useEffect(() => {
    if (mounted && passed) {
      // Small delay so the card animation has started before confetti fires
      const timer = setTimeout(fireConfetti, 400);
      return () => clearTimeout(timer);
    }
  }, [mounted, passed, fireConfetti]);

  const handleRetake = useCallback(async () => {
    setRetaking(true);
    // Clear the module's lessons + quiz scores so the retake is a clean run from
    // lesson one. (The content is short; re-confirming each Knowledge Check is the
    // point of a retake.)
    await resetModuleProgress(moduleId, modules);
    router.push(`/train/${moduleId}/${mod!.lessons[0].id}`);
  }, [moduleId, mod, router]);

  const BadgeIcon = badgeIconMap[mod!.badge.icon] || ShieldCheck;

  // Find next module
  const currentModIndex = modules.findIndex((m) => m.id === moduleId);
  const nextMod =
    currentModIndex < modules.length - 1 ? modules[currentModIndex + 1] : null;

  const required = Math.ceil(result.total * 0.8);

  if (!mounted) {
    return <TrainPageLoader label="Tallying your module score…" />;
  }

  // ---------------------------------------------------------------------------
  // PASS — celebratory badge screen
  // ---------------------------------------------------------------------------
  if (passed) {
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
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  className="flex justify-center mb-6"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                    <Trophy size={32} weight="fill" className="text-emerald-500" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5, ease: [0.32, 0.72, 0, 1] }}
                >
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold uppercase tracking-wider text-emerald-600 mb-5">
                    Module {String(mod!.number).padStart(2, "0")} Passed
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-stone-900 mb-2">
                    {mod!.title}
                  </h1>

                  <p className="text-stone-400 text-sm md:text-base leading-relaxed max-w-[40ch] mx-auto mb-6">
                    You scored{" "}
                    <span className="font-semibold text-emerald-600">{result.pct}%</span>{" "}
                    across this module&apos;s {result.total} questions - well above the 80% pass
                    mark.
                  </p>

                  {/* Score chips */}
                  <div className="flex items-center justify-center gap-6 mb-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold font-mono text-emerald-600">
                        {result.score}/{result.total}
                      </p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">
                        Your Score
                      </p>
                    </div>
                    <div className="w-px h-10 bg-stone-200" />
                    <div className="text-center">
                      <p className="text-2xl font-bold font-mono text-stone-800">
                        {required}/{result.total}
                      </p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">
                        Required
                      </p>
                    </div>
                  </div>
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
                    style={{ backgroundColor: mod!.color + "08", borderColor: mod!.color + "20" }}
                  >
                    <div
                      className="relative w-16 h-16"
                      style={{ filter: `drop-shadow(0 4px 10px ${mod!.color}40)` }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath:
                            "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                          background: `linear-gradient(145deg, ${mod!.color}, ${mod!.color}b0)`,
                        }}
                      />
                      <div
                        className="absolute inset-[3px] flex items-center justify-center"
                        style={{
                          clipPath:
                            "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                          background: `linear-gradient(150deg, #ffffff 0%, ${mod!.color}12 100%)`,
                        }}
                      >
                        <BadgeIcon
                          size={28}
                          weight="fill"
                          style={{
                            color: mod!.color,
                            filter: `drop-shadow(0 1px 1px ${mod!.color}55)`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: mod!.color }}>
                        {mod!.badge.label}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">Badge Earned</p>
                    </div>
                  </div>
                </motion.div>

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

                <p className="text-[11px] text-stone-400 mt-8">
                  {progress.completedModules.length} of {modules.length - 1} training modules
                  completed
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // FAIL — score, full module review, whole-module retake
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-[100dvh] bg-[var(--background)] relative">
      <div className="noise-overlay" />
      <div className="relative w-full max-w-3xl mx-auto px-6 pt-20 pb-16">
        {/* Result header */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="card-shell">
            <div className="card-core p-8 md:p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-5">
                <X size={32} weight="bold" className="text-red-500" />
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200/60 text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-4">
                Module {String(mod!.number).padStart(2, "0")} &middot; {mod!.title}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-stone-900 mb-2">
                Module Not Passed
              </h1>
              <p className="text-stone-400 text-sm leading-relaxed max-w-[44ch] mx-auto mb-7">
                You scored {result.pct}% across this module. You need 80% or higher to pass and
                earn the module badge. Review the questions below, then retake the module when
                ready.
              </p>

              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="text-center">
                  <p className="text-2xl font-bold font-mono text-red-600">
                    {result.score}/{result.total}
                  </p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">
                    Your Score
                  </p>
                </div>
                <div className="w-px h-10 bg-stone-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold font-mono text-stone-800">
                    {required}/{result.total}
                  </p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">
                    Required
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRetake}
                  disabled={retaking}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-full bg-[var(--cta)] text-white font-medium hover:bg-[var(--cta-dark)] active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_4px_16px_rgba(240,90,40,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowCounterClockwise size={18} weight="bold" />
                  {retaking ? "Resetting…" : "Retake Module"}
                </button>
                <Link
                  href="/train"
                  className="flex-1 inline-flex items-center justify-center py-4 rounded-full bg-stone-100 text-stone-600 font-medium hover:bg-stone-200 active:scale-[0.97] transition-all duration-300"
                >
                  Back to Training
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Full module review */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
          className="mt-10"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-400 mb-4 px-1">
            Review your answers
          </h2>
          <ModuleReview mod={mod!} progress={progress} />
        </motion.div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={handleRetake}
            disabled={retaking}
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[var(--cta)] text-white font-medium hover:bg-[var(--cta-dark)] active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_4px_16px_rgba(240,90,40,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowCounterClockwise size={18} weight="bold" />
            {retaking ? "Resetting…" : "Retake Module"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Read-only review of every question in the module, grouped by lesson, showing
 * the learner's saved answer alongside the correct one and the explanation.
 * Answers were stored as option *text* (shuffle-independent), so we match by text
 * against the canonical question data.
 */
function ModuleReview({
  mod,
  progress,
}: {
  mod: Module;
  progress: UserProgress;
}) {
  return (
    <div className="space-y-8">
      {mod.lessons.map((lesson, li) => {
        const entry = progress.quizScores[lesson.id];
        const chosen = entry?.answers ?? {};
        return (
          <div key={lesson.id} className="card-shell">
            <div className="card-core p-6 md:p-7">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold tracking-tight text-stone-800">
                  <span className="font-mono text-stone-400 mr-2 text-xs">
                    {String(mod.number).padStart(2, "0")}.{li + 1}
                  </span>
                  {lesson.title}
                </h3>
                {entry && (
                  <span className="text-[11px] font-mono text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full shrink-0">
                    {entry.score}/{entry.total}
                  </span>
                )}
              </div>
              <div className="space-y-6">
                {lesson.quiz.map((q, qi) => (
                  <ReviewQuestion
                    key={q.id}
                    question={q}
                    index={qi}
                    chosenText={chosen[q.id]}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReviewQuestion({
  question,
  index,
  chosenText,
}: {
  question: QuizQuestion;
  index: number;
  chosenText: string | undefined;
}) {
  const correctText = question.options[question.correctIndex];
  const gotItRight = chosenText != null && chosenText === correctText;

  return (
    <div>
      <p className="text-sm font-semibold text-stone-800 mb-3">
        <span className="text-stone-400 font-mono mr-2 text-xs">
          {String(index + 1).padStart(2, "0")}
        </span>
        {question.question}
      </p>
      <div className="space-y-2">
        {question.options.map((opt, oi) => {
          const isCorrect = oi === question.correctIndex;
          const isChosen = chosenText != null && opt === chosenText;
          let borderClass = "border-stone-200/80";
          let bgClass = "bg-white";
          if (isCorrect) {
            borderClass = "border-emerald-300/80";
            bgClass = "bg-emerald-50/60";
          } else if (isChosen) {
            borderClass = "border-red-300/80";
            bgClass = "bg-red-50/60";
          }
          return (
            <div
              key={oi}
              className={`w-full text-left px-4 py-3 rounded-xl border ${borderClass} ${bgClass} text-sm flex items-center gap-3`}
            >
              <span
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] font-bold ${
                  isCorrect
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : isChosen
                    ? "border-red-400 bg-red-400 text-white"
                    : "border-stone-300 text-stone-400"
                }`}
              >
                {isCorrect ? (
                  <Check size={12} weight="bold" />
                ) : isChosen ? (
                  <X size={12} weight="bold" />
                ) : (
                  String.fromCharCode(65 + oi)
                )}
              </span>
              <span
                className={
                  isCorrect ? "text-emerald-800" : isChosen ? "text-red-700" : "text-stone-600"
                }
              >
                {opt}
              </span>
            </div>
          );
        })}
      </div>
      <div className="pl-9 mt-3">
        <p
          className={`text-[11px] font-semibold uppercase tracking-wider mb-1 ${
            gotItRight ? "text-emerald-600" : chosenText != null ? "text-red-500" : "text-stone-400"
          }`}
        >
          {gotItRight ? "Correct" : chosenText != null ? "Not quite" : "Not answered"}
        </p>
        <p className="text-xs text-stone-500 leading-relaxed">{question.explanation}</p>
      </div>
    </div>
  );
}
