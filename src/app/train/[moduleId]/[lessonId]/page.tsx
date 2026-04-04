"use client";

import { use, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Warning,
  WarningOctagon,
  BookOpen,
  ListChecks,
  Info,
  Check,
  X,
  Trophy,
  Certificate,
} from "@phosphor-icons/react";
import {
  modules,
  type QuizQuestion,
  type LessonSection,
} from "@/data/training-modules";
import {
  defaultProgress,
  refreshProgress,
  getProgress,
  completeLesson,
  completeModule,
  saveQuizScore,
  setCertified,
  isLessonUnlocked,
  getModuleCumulativeScore,
  isModuleFullyQuizzed,
  resetModuleProgress,
} from "@/lib/progress-store";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { Diagram } from "@/components/diagrams";

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] as const },
  },
};

export default function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = use(params);
  const mod = modules.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);

  if (!mod || !lesson) redirect("/train");

  const router = useRouter();
  const [progress, setProgress] = useState(defaultProgress);
  const [mounted, setMounted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [certName, setCertName] = useState("");

  useEffect(() => {
    refreshProgress().then((p) => {
      setProgress(p);
      setMounted(true);
      // Gate locked lessons
      if (!isLessonUnlocked(lessonId, modules)) {
        router.replace("/train");
      }
    });
  }, [lessonId, router]);

  const isCompleted = mounted && progress.completedLessons.includes(lessonId);

  const currentModIndex = modules.findIndex((m) => m.id === moduleId);
  const currentLessonIndex = mod.lessons.findIndex((l) => l.id === lessonId);

  let prevLink: string | null = null;
  let nextLink: string | null = null;

  if (currentLessonIndex > 0) {
    prevLink = `/train/${moduleId}/${mod.lessons[currentLessonIndex - 1].id}`;
  } else if (currentModIndex > 0) {
    const prevMod = modules[currentModIndex - 1];
    prevLink = `/train/${prevMod.id}/${prevMod.lessons[prevMod.lessons.length - 1].id}`;
  }

  if (currentLessonIndex < mod.lessons.length - 1) {
    nextLink = `/train/${moduleId}/${mod.lessons[currentLessonIndex + 1].id}`;
  } else if (currentModIndex < modules.length - 1) {
    const nextMod = modules[currentModIndex + 1];
    nextLink = `/train/${nextMod.id}/${nextMod.lessons[0].id}`;
  }

  const isFinalAssessment = moduleId === "assessment";
  const quizScore = mounted ? progress.quizScores[lessonId] : null;
  const alreadyQuizzed = quizScore != null;
  const [showModuleFail, setShowModuleFail] = useState(false);
  const [moduleCumulativeResult, setModuleCumulativeResult] = useState<{ score: number; total: number; pct: number } | null>(null);

  // If returning to a lesson that was already quizzed, show results immediately
  useEffect(() => {
    if (alreadyQuizzed && lesson.quiz) {
      setQuizSubmitted(true);
      // Reconstruct answers from the correct answers (for display purposes)
      const restored: Record<string, number> = {};
      for (const q of lesson.quiz) {
        // We don't store individual answers, so we can't reconstruct them
        // Quiz will show as submitted but without answer highlighting
      }
    }
  }, [alreadyQuizzed, lesson.quiz]);

  const handleQuizSubmit = useCallback(async () => {
    if (!lesson.quiz || alreadyQuizzed) return;
    const score = lesson.quiz.reduce(
      (acc, q) => acc + (quizAnswers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
    const total = lesson.quiz.length;
    let updated = await saveQuizScore(lessonId, score, total);
    updated = await completeLesson(lessonId);
    setQuizSubmitted(true);

    // Check if all lessons in this module are now quizzed
    if (moduleId !== "assessment") {
      const allQuizzed = mod.lessons.every((l) => updated.quizScores[l.id] != null);
      if (allQuizzed) {
        const cumulative = getModuleCumulativeScore(moduleId, modules);
        if (cumulative.pct >= 80) {
          await completeModule(moduleId);
          setProgress(getProgress());
          router.push(`/train/${moduleId}/complete`);
        } else {
          // Module failed - reset all progress for this module immediately
          setModuleCumulativeResult(cumulative);
          const reset = await resetModuleProgress(moduleId, modules);
          setProgress(reset);
          setShowModuleFail(true);
          return;
        }
      }
    }
    setProgress(updated);
  }, [lesson.quiz, quizAnswers, lessonId, mod, moduleId, alreadyQuizzed, router]);

  const passedFinal =
    isFinalAssessment &&
    quizScore &&
    quizScore.score >= Math.ceil((quizScore.total || 1) * 0.8);

  const handleCertify = useCallback(async () => {
    if (!certName.trim()) return;
    // Call certify API to generate verification ID, then update local progress
    try {
      const res = await fetch("/api/certify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: certName.trim() }),
      });
      if (res.ok) {
        const { certId } = await res.json();
        // Store certId locally too
        await setCertified(certName.trim());
        if (certId) {
          localStorage.setItem("slidesure-cert-id", certId);
        }
      } else {
        // Fallback if API fails (dev mode without Supabase)
        await setCertified(certName.trim());
      }
    } catch {
      // Fallback to local-only
      await setCertified(certName.trim());
    }
    router.push("/train/certified");
  }, [certName, router]);

  // Calculate lesson position
  let globalLessonIndex = 0;
  let totalGlobalLessons = 0;
  for (const m of modules) {
    for (const l of m.lessons) {
      totalGlobalLessons++;
      if (m.id === moduleId && l.id === lessonId) {
        globalLessonIndex = totalGlobalLessons;
      }
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--background)] relative">
      <div className="noise-overlay" />

      {/* Floating Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 pt-5">
        <div className="max-w-3xl mx-auto">
          <div className="nav-glass rounded-full px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/train"
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 active:scale-[0.95] transition-all duration-300"
              >
                <ArrowLeft size={14} weight="bold" className="text-stone-500" />
              </Link>
              <div className="hidden sm:block">
                <p className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                  Module {String(mod.number).padStart(2, "0")}
                </p>
                <p className="text-[13px] font-semibold tracking-tight text-stone-700 truncate max-w-[200px] md:max-w-[300px]">
                  {lesson.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {mounted && isCompleted && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <CheckCircle size={12} weight="fill" />
                  Done
                </div>
              )}
              <span className="text-[10px] font-mono text-stone-300">
                {globalLessonIndex}/{totalGlobalLessons}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {/* Lesson header */}
          <motion.div variants={fadeUp} className="mb-10">
            <div className="eyebrow bg-stone-100 border border-stone-200/60 text-stone-500 mb-5">
              Module {String(mod.number).padStart(2, "0")} &middot; Lesson{" "}
              {currentLessonIndex + 1} of {mod.lessons.length}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-stone-900 mb-2">
              {lesson.title}
            </h1>
          </motion.div>

          {/* Content sections */}
          <div className="space-y-6">
            {lesson.content.map((section, i) => (
              <motion.div key={i} variants={fadeUp}>
                <SectionRenderer section={section} />
              </motion.div>
            ))}
          </div>

          {/* Key Takeaways */}
          {lesson.keyTakeaways.length > 0 && (
            <motion.div variants={fadeUp} className="mt-12">
              <div className="card-shell" style={{ background: "rgba(11, 58, 102, 0.04)", borderColor: "rgba(11, 58, 102, 0.08)" }}>
                <div className="card-core p-6 md:p-7">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-stone-800">
                    <BookOpen size={17} weight="duotone" className="text-[var(--accent)]" />
                    Key Takeaways
                  </h3>
                  <ul className="space-y-3">
                    {lesson.keyTakeaways.map((takeaway, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-stone-600 leading-relaxed"
                      >
                        <Check
                          size={15}
                          weight="bold"
                          className="text-[var(--accent)] mt-0.5 shrink-0"
                        />
                        {takeaway}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quiz - one question at a time */}
          <motion.div variants={fadeUp} className="mt-12">
                <div className="card-shell">
                  <div className="card-core p-6 md:p-8">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold tracking-tight text-stone-900">
                        {isFinalAssessment ? "Final Assessment" : "Knowledge Check"}
                      </h3>
                      {!quizSubmitted && (
                        <span className="text-xs font-mono text-stone-400 bg-stone-100 px-3 py-1.5 rounded-full">
                          {currentQuizIndex + 1} / {lesson.quiz!.length}
                        </span>
                      )}
                    </div>
                    {isFinalAssessment && !quizSubmitted && (
                      <p className="text-sm text-stone-400 mb-6 leading-relaxed">
                        You need 80% or higher to pass and earn your
                        certification. Take your time and review each question carefully.
                      </p>
                    )}

                    {!quizSubmitted ? (
                      <>
                        {/* Progress bar */}
                        <div className="w-full h-1.5 rounded-full bg-stone-100 mb-8 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-[var(--accent)]"
                            initial={false}
                            animate={{ width: `${((currentQuizIndex + 1) / lesson.quiz!.length) * 100}%` }}
                            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                          />
                        </div>

                        {/* Single question */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentQuizIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                          >
                            <QuizQuestionCard
                              question={lesson.quiz![currentQuizIndex]}
                              index={currentQuizIndex}
                              selected={quizAnswers[lesson.quiz![currentQuizIndex].id]}
                              onSelect={(optIndex) => {
                                setQuizAnswers((prev) => ({
                                  ...prev,
                                  [lesson.quiz![currentQuizIndex].id]: optIndex,
                                }));
                              }}
                              submitted={false}
                            />
                          </motion.div>
                        </AnimatePresence>

                        {/* Next / Submit button */}
                        <div className="mt-8 flex gap-3">
                          {currentQuizIndex > 0 && (
                            <button
                              onClick={() => setCurrentQuizIndex((i) => i - 1)}
                              className="px-6 py-4 rounded-2xl bg-stone-100 text-stone-600 font-medium hover:bg-stone-200 active:scale-[0.99] transition-all duration-300"
                            >
                              <ArrowLeft size={16} weight="bold" />
                            </button>
                          )}
                          {currentQuizIndex < lesson.quiz!.length - 1 ? (
                            <button
                              onClick={() => setCurrentQuizIndex((i) => i + 1)}
                              disabled={quizAnswers[lesson.quiz![currentQuizIndex].id] == null}
                              className="flex-1 py-4 rounded-2xl bg-stone-900 text-white font-medium hover:bg-stone-800 active:scale-[0.99] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2"
                            >
                              Next Question
                              <ArrowRight size={16} weight="bold" />
                            </button>
                          ) : (
                            <button
                              onClick={handleQuizSubmit}
                              disabled={
                                alreadyQuizzed || Object.keys(quizAnswers).length !== lesson.quiz!.length
                              }
                              className="flex-1 py-4 rounded-2xl bg-[var(--cta)] text-white font-medium hover:bg-[var(--cta-dark)] active:scale-[0.99] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(240,90,40,0.25)]"
                            >
                              Submit Answers
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="mt-6">
                        {/* Results summary */}
                        <QuizResults
                          quiz={lesson.quiz!}
                          answers={quizAnswers}
                          isFinal={isFinalAssessment}
                        />

                        {/* Show all questions with answers after submit */}
                        <div className="mt-8 space-y-6">
                          {lesson.quiz!.map((q, qi) => (
                            <QuizQuestionCard
                              key={q.id}
                              question={q}
                              index={qi}
                              selected={quizAnswers[q.id]}
                              onSelect={() => {}}
                              submitted={true}
                            />
                          ))}
                        </div>

                        {passedFinal && !progress.certified && (
                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                            className="mt-6"
                          >
                            <div className="card-shell" style={{ background: "rgba(4, 120, 87, 0.04)", borderColor: "rgba(4, 120, 87, 0.1)" }}>
                              <div className="card-core p-6">
                                <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                                  <Trophy size={18} weight="fill" className="text-emerald-600" />
                                  Congratulations - You Passed
                                </h4>
                                <p className="text-sm text-emerald-700/70 mb-5 leading-relaxed">
                                  Enter your name to generate your competency certificate.
                                </p>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    value={certName}
                                    onChange={(e) => setCertName(e.target.value)}
                                    placeholder="Your full name"
                                    className="flex-1 px-4 py-3 rounded-xl border border-emerald-200/80 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-shadow"
                                  />
                                  <button
                                    onClick={handleCertify}
                                    disabled={!certName.trim()}
                                    className="px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 active:scale-[0.98] transition-all duration-300 disabled:opacity-30"
                                  >
                                    Generate
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {progress.certified && (
                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                            className="mt-6"
                          >
                            <Link
                              href="/train/certified"
                              className="group w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-emerald-600 text-white font-medium transition-all duration-500 hover:bg-emerald-700 active:scale-[0.97] shadow-[0_4px_16px_rgba(4,120,87,0.25)]"
                            >
                              <Certificate size={18} weight="bold" />
                              View Your Certificate
                            </Link>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Module Fail Popup */}
                    <AnimatePresence>
                      {showModuleFail && moduleCumulativeResult && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
                        >
                          <motion.div
                            initial={{ scale: 0.92, opacity: 0, filter: "blur(8px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                            className="card-shell max-w-md w-full"
                          >
                            <div className="card-core p-8 text-center">
                              <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-5">
                                <X size={32} weight="bold" className="text-red-500" />
                              </div>
                              <h3 className="text-xl font-bold tracking-tight text-stone-900 mb-2">
                                Module Not Passed
                              </h3>
                              <p className="text-stone-400 text-sm leading-relaxed mb-6 max-w-[38ch] mx-auto">
                                You scored {moduleCumulativeResult.pct}% across this module.
                                You need 80% or higher to pass and earn the module badge.
                              </p>
                              <div className="flex items-center justify-center gap-6 mb-6">
                                <div className="text-center">
                                  <p className="text-2xl font-bold font-mono text-red-600">{moduleCumulativeResult.score}/{moduleCumulativeResult.total}</p>
                                  <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">Your Score</p>
                                </div>
                                <div className="w-px h-10 bg-stone-200" />
                                <div className="text-center">
                                  <p className="text-2xl font-bold font-mono text-stone-800">{Math.ceil(moduleCumulativeResult.total * 0.8)}/{moduleCumulativeResult.total}</p>
                                  <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">Required</p>
                                </div>
                              </div>
                              <p className="text-sm text-stone-500 leading-relaxed mb-8">
                                Review the lesson material and try again. All quiz progress for this module will be reset.
                              </p>
                              <Link
                                href={`/train/${moduleId}/${mod.lessons[0].id}`}
                                className="w-full inline-flex items-center justify-center py-4 rounded-full bg-[var(--cta)] text-white font-medium hover:bg-[var(--cta-dark)] active:scale-[0.97] transition-all duration-500 shadow-[0_4px_16px_rgba(240,90,40,0.25)]"
                              >
                                Review & Try Again
                              </Link>
                              <Link
                                href="/train"
                                className="mt-3 w-full inline-flex items-center justify-center py-3.5 rounded-full bg-stone-100 text-stone-600 text-sm font-medium hover:bg-stone-200 active:scale-[0.97] transition-all duration-300"
                              >
                                Back to Training
                              </Link>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
          </motion.div>
          {/* Navigation */}
          <motion.div
            variants={fadeUp}
            className="mt-14 flex items-center justify-between gap-4"
          >
            {prevLink ? (
              <Link
                href={prevLink}
                className="group flex items-center gap-2 px-5 py-3 rounded-full text-sm text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-all duration-300"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-0.5 transition-transform duration-300"
                />
                Previous
              </Link>
            ) : (
              <div />
            )}
            {nextLink && isCompleted ? (
              <Link
                href={nextLink}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
              >
                Next Lesson
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform duration-300"
                />
              </Link>
            ) : nextLink ? (
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-200 text-stone-400 text-sm font-medium cursor-not-allowed">
                Next Lesson
                <ArrowRight size={14} />
              </span>
            ) : (
              <Link
                href="/train"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-dark)] active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              >
                Back to Modules
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function SectionRenderer({ section }: { section: LessonSection }) {
  if (section.type === "diagram" && section.diagramId) {
    return (
      <div>
        {section.heading && (
          <h3 className="text-lg font-semibold tracking-tight text-stone-800 mb-3">
            {section.heading}
          </h3>
        )}
        {section.body && (
          <p className="text-sm text-stone-400 leading-relaxed mb-3">{section.body}</p>
        )}
        <Diagram id={section.diagramId} />
      </div>
    );
  }

  if (section.type === "warning") {
    return (
      <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/40">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <Warning size={15} weight="fill" className="text-amber-600" />
          </div>
          <p className="text-sm text-amber-900/80 leading-relaxed">{section.body}</p>
        </div>
      </div>
    );
  }

  if (section.type === "critical") {
    return (
      <div className="p-5 rounded-2xl bg-red-50/80 border border-red-200/40">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
            <WarningOctagon size={15} weight="fill" className="text-red-600" />
          </div>
          <div>
            <p className="text-sm text-red-900/80 leading-relaxed font-medium">
              {section.body}
            </p>
            {section.source && (
              <p className="text-[11px] text-red-400 mt-2 font-mono">
                Source: {section.source}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (section.type === "oem-reference") {
    return (
      <div className="p-5 rounded-2xl bg-stone-50 border-l-[3px] border-l-[var(--teal)] border border-stone-200/30">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
            <Info size={15} weight="fill" className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-sm text-stone-600 leading-relaxed italic">
              &ldquo;{section.body}&rdquo;
            </p>
            {section.source && (
              <p className="text-[11px] text-stone-400 mt-2 font-mono">
                {section.source}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (section.type === "checklist") {
    return (
      <div>
        {section.heading && (
          <h3 className="text-lg font-semibold tracking-tight text-stone-800 mb-3">
            {section.heading}
          </h3>
        )}
        <p className="text-sm text-stone-400 mb-4 leading-relaxed">{section.body}</p>
        <ul className="space-y-2.5">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
              <ListChecks
                size={15}
                weight="duotone"
                className="text-[var(--accent)] mt-0.5 shrink-0"
              />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      {section.heading && (
        <h3 className="text-lg font-semibold tracking-tight text-stone-800 mb-3">
          {section.heading}
        </h3>
      )}
      <p className="text-base text-stone-500 leading-relaxed max-w-[65ch]">
        {section.body}
      </p>
    </div>
  );
}

function QuizQuestionCard({
  question,
  index,
  selected,
  onSelect,
  submitted,
}: {
  question: QuizQuestion;
  index: number;
  selected: number | undefined;
  onSelect: (idx: number) => void;
  submitted: boolean;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-stone-800 mb-3">
        <span className="text-stone-300 font-mono mr-2 text-xs">
          {String(index + 1).padStart(2, "0")}
        </span>
        {question.question}
      </p>
      <div className="space-y-2">
        {question.options.map((opt, oi) => {
          const isSelected = selected === oi;
          const isCorrect = question.correctIndex === oi;
          let borderClass = "border-stone-200/80 hover:border-stone-300";
          let bgClass = "bg-white";

          if (submitted) {
            if (isCorrect) {
              borderClass = "border-emerald-300/80";
              bgClass = "bg-emerald-50/60";
            } else if (isSelected && !isCorrect) {
              borderClass = "border-red-300/80";
              bgClass = "bg-red-50/60";
            }
          } else if (isSelected) {
            borderClass = "border-[var(--accent)]/40";
            bgClass = "bg-teal-50/40";
          }

          return (
            <button
              key={oi}
              onClick={() => onSelect(oi)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border ${borderClass} ${bgClass} text-sm transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center gap-3 active:scale-[0.99]`}
            >
              <span
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] font-bold transition-all duration-300 ${
                  submitted && isCorrect
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : submitted && isSelected && !isCorrect
                    ? "border-red-400 bg-red-400 text-white"
                    : isSelected
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-stone-300 text-stone-400"
                }`}
              >
                {submitted && isCorrect ? (
                  <Check size={12} weight="bold" />
                ) : submitted && isSelected && !isCorrect ? (
                  <X size={12} weight="bold" />
                ) : (
                  String.fromCharCode(65 + oi)
                )}
              </span>
              <span
                className={
                  submitted && isCorrect
                    ? "text-emerald-800"
                    : submitted && isSelected && !isCorrect
                    ? "text-red-700"
                    : "text-stone-600"
                }
              >
                {opt}
              </span>
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {submitted && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="text-xs text-stone-400 leading-relaxed pl-9"
          >
            {question.explanation}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuizResults({
  quiz,
  answers,
  isFinal,
}: {
  quiz: QuizQuestion[];
  answers: Record<string, number>;
  isFinal: boolean;
}) {
  const score = quiz.reduce(
    (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
    0
  );
  const total = quiz.length;
  const pct = Math.round((score / total) * 100);
  const good = pct >= 80;

  return (
    <div className="card-shell" style={{
      background: good ? "rgba(4, 120, 87, 0.04)" : "rgba(185, 28, 28, 0.04)",
      borderColor: good ? "rgba(4, 120, 87, 0.1)" : "rgba(185, 28, 28, 0.1)",
    }}>
      <div className="card-core p-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold font-mono ${
              good
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {pct}%
          </div>
          <div>
            <p className="font-semibold text-stone-800">
              {isFinal
                ? good ? "Assessment Passed" : "Assessment Not Passed"
                : "Quiz Complete"}
            </p>
            <p className="text-sm text-stone-400 mt-0.5">
              {score} of {total} correct
              {!isFinal && " - this score contributes to your module total"}
              {isFinal && !good && " - 80% required to pass"}
              {isFinal && good && " - congratulations!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

