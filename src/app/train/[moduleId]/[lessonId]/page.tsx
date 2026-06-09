"use client";

import { use, useState, useEffect, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  animate,
  useReducedMotion,
} from "framer-motion";
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
  Clock,
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
  resetModuleQuizzes,
} from "@/lib/progress-store";
import Link from "next/link";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { Diagram } from "@/components/diagrams";
import { TrainPageLoader } from "@/components/TrainSkeletons";

// Deterministic, seeded shuffling so the server and client render the same
// question/option order (avoids React hydration mismatches). Re-shuffles only
// when the seed changes (different lesson, or a new quiz attempt).
function hashSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

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
  const [quizAttempt, setQuizAttempt] = useState(0);
  // True while handing off from the last lesson straight to the module score
  // screen — shows a transition instead of flashing this lesson's own results.
  const [navigating, setNavigating] = useState(false);

  // Scroll-linked reading progress, themed in the module's colour.
  const { scrollYProgress } = useScroll();
  const readingProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const shuffledQuiz = useMemo(() => {
    if (!lesson.quiz) return [];
    const rng = mulberry32(hashSeed(`${moduleId}:${lessonId}:${quizAttempt}`));
    let pool = [...lesson.quiz];
    // For final assessment, select 20 random questions from the pool
    if (moduleId === "assessment" && pool.length > 20) {
      pool = seededShuffle(pool, rng).slice(0, 20);
    }
    return pool.map((q) => {
      const indices = seededShuffle(
        q.options.map((_, i) => i),
        rng
      );
      return {
        ...q,
        options: indices.map((i) => q.options[i]),
        correctIndex: indices.indexOf(q.correctIndex),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.quiz, quizAttempt]);

  useEffect(() => {
    refreshProgress().then((p) => {
      setProgress(p);
      setMounted(true);
      // Gate locked lessons
      if (!isLessonUnlocked(lessonId, modules)) {
        router.replace("/train");
        return;
      }
      // If this lesson's quiz was already taken, show it in its submitted state
      // and restore which option the learner picked so they can review misses.
      const entry = p.quizScores[lessonId];
      if (entry) {
        setQuizSubmitted(true);
        if (entry.answers) {
          const restored: Record<string, number> = {};
          for (const sq of shuffledQuiz) {
            const chosenText = entry.answers[sq.id];
            if (chosenText == null) continue;
            const idx = sq.options.indexOf(chosenText);
            if (idx >= 0) restored[sq.id] = idx;
          }
          setQuizAnswers(restored);
        }
      }
    });
    // shuffledQuiz is the attempt-0 shuffle at mount, which matches the order the
    // stored answers are reconstructed against — intentionally not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // A preview of what comes after this lesson, used by the "Up next" card so
  // finishing one lesson flows straight into the next without a detour home.
  let nextLessonInfo:
    | { title: string; duration: string; moduleTitle: string; color: string; isNewModule: boolean }
    | null = null;

  if (currentLessonIndex < mod.lessons.length - 1) {
    const nl = mod.lessons[currentLessonIndex + 1];
    nextLink = `/train/${moduleId}/${nl.id}`;
    nextLessonInfo = { title: nl.title, duration: nl.duration, moduleTitle: mod.title, color: mod.color, isNewModule: false };
  } else if (currentModIndex < modules.length - 1) {
    const nextMod = modules[currentModIndex + 1];
    const nl = nextMod.lessons[0];
    nextLink = `/train/${nextMod.id}/${nl.id}`;
    nextLessonInfo = { title: nl.title, duration: nl.duration, moduleTitle: nextMod.title, color: nextMod.color, isNewModule: true };
  }

  // Keyboard navigation: ← previous lesson, → next (only when this one is done,
  // mirroring the on-screen gating). Ignored while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) {
        return;
      }
      if (e.key === "ArrowLeft" && prevLink) {
        router.push(prevLink);
      } else if (e.key === "ArrowRight" && nextLink && isCompleted) {
        router.push(nextLink);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevLink, nextLink, isCompleted, router]);

  const isFinalAssessment = moduleId === "assessment";
  const quizScore = mounted ? progress.quizScores[lessonId] : null;
  const alreadyQuizzed = quizScore != null;
  const [showModuleFail, setShowModuleFail] = useState(false);
  const [showFinalPass, setShowFinalPass] = useState(false);
  const [moduleCumulativeResult, setModuleCumulativeResult] = useState<{ score: number; total: number; pct: number } | null>(null);

  const fireConfetti = useCallback(() => {
    const burst = (opts: confetti.Options) =>
      confetti({ ...opts, disableForReducedMotion: true });
    burst({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors: ["#1F7A8C", "#F05A28", "#FFD700"] });
    burst({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors: ["#1F7A8C", "#F05A28", "#FFD700"] });
    setTimeout(() => {
      burst({ particleCount: 25, angle: 60, spread: 70, origin: { x: 0.15, y: 0.7 }, colors: ["#1F7A8C", "#F05A28", "#FFD700"], decay: 0.94 });
      burst({ particleCount: 25, angle: 120, spread: 70, origin: { x: 0.85, y: 0.7 }, colors: ["#1F7A8C", "#F05A28", "#FFD700"], decay: 0.94 });
    }, 250);
  }, []);

  const handleQuizSubmit = useCallback(async () => {
    if (!lesson.quiz || alreadyQuizzed) return;
    const score = shuffledQuiz.reduce(
      (acc, q) => acc + (quizAnswers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
    const total = shuffledQuiz.length;

    // Record the option *text* the learner chose for each question, so a later
    // revisit can show their picks regardless of how the quiz re-shuffles.
    const chosenAnswers: Record<string, string> = {};
    for (const q of shuffledQuiz) {
      const sel = quizAnswers[q.id];
      if (sel != null && q.options[sel] != null) {
        chosenAnswers[q.id] = q.options[sel];
      }
    }

    // Finishing the last lesson of a content module: skip this lesson's own
    // answer review and transition straight to the module score / pass-fail
    // screen, so there's no flash of per-lesson results first.
    const finishesContentModule =
      !isFinalAssessment &&
      mod.lessons.every((l) => l.id === lessonId || progress.quizScores[l.id] != null);
    if (finishesContentModule) {
      setNavigating(true);
      await saveQuizScore(lessonId, score, total, chosenAnswers);
      await completeLesson(lessonId);
      router.push(`/train/${moduleId}/complete`);
      return;
    }

    await saveQuizScore(lessonId, score, total, chosenAnswers);
    setQuizSubmitted(true);
    const updated = await completeLesson(lessonId);

    // The final assessment is a single lesson, so it's graded inline right here:
    // pass -> certificate flow, fail -> review + retake the whole assessment.
    if (isFinalAssessment) {
      const cumulative = getModuleCumulativeScore(moduleId, modules);
      setModuleCumulativeResult(cumulative);
      if (cumulative.pct >= 80) {
        await completeModule(moduleId);
        setProgress(getProgress());
        setShowFinalPass(true);
        fireConfetti();
      } else {
        // Clear the score so it can be retaken; the review below stays on screen.
        const reset = await resetModuleQuizzes(moduleId, modules);
        setProgress(reset);
        setShowModuleFail(true);
      }
      return;
    }

    // A non-final lesson within the module: save, mark done, surface "Up next".
    setProgress(updated);
  }, [
    lesson.quiz,
    shuffledQuiz,
    quizAnswers,
    lessonId,
    mod,
    moduleId,
    alreadyQuizzed,
    isFinalAssessment,
    progress.quizScores,
    fireConfetti,
    router,
  ]);

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

  // The first text section reads as a "lede" — larger, darker opening paragraph.
  const ledeIndex = lesson.content.findIndex((s) => s.type === "text");

  // Show the rich "Up next" preview once this lesson is done and another follows,
  // making it the single forward action (the plain Next button steps aside).
  const showUpNext =
    mounted && isCompleted && !!nextLink && !!nextLessonInfo && !moduleCumulativeResult;

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

  // Transitioning from the final lesson into the module score screen.
  if (navigating) return <TrainPageLoader label="Tallying your module score…" />;

  return (
    <div
      className="min-h-[100dvh] bg-[var(--background)] relative"
      style={{ "--mod": mod.color } as React.CSSProperties}
    >
      <div className="noise-overlay" />

      {/* Scroll-linked reading progress — themed to this module */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[55]"
        style={{ scaleX: readingProgress, background: mod.color }}
      />

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
              <span className="text-[10px] font-mono text-stone-400">
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
            <div className="flex items-center gap-1.5 text-[13px] text-stone-400 font-medium">
              <Clock size={14} weight="duotone" style={{ color: mod.color }} />
              <span>{lesson.duration} read</span>
            </div>
          </motion.div>

          {/* Content sections */}
          <div className="space-y-6">
            {lesson.content.map((section, i) => (
              <motion.div key={i} variants={fadeUp}>
                <SectionRenderer
                  section={section}
                  accent={mod.color}
                  isLede={i === ledeIndex}
                />
              </motion.div>
            ))}
          </div>

          {/* Key Takeaways */}
          {lesson.keyTakeaways.length > 0 && (
            <motion.div variants={fadeUp} className="mt-12">
              <div
                className="card-shell"
                style={{
                  background: `color-mix(in srgb, ${mod.color} 5%, transparent)`,
                  borderColor: `color-mix(in srgb, ${mod.color} 14%, transparent)`,
                }}
              >
                <div className="card-core p-6 md:p-7">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-stone-800">
                    <BookOpen size={17} weight="duotone" style={{ color: mod.color }} />
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
                          className="mt-0.5 shrink-0"
                          style={{ color: mod.color }}
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
                          {currentQuizIndex + 1} / {shuffledQuiz.length}
                        </span>
                      )}
                    </div>
                    {isFinalAssessment && !quizSubmitted && (
                      <p className="text-sm text-stone-400 mb-6 leading-relaxed">
                        20 questions drawn randomly from across all modules. You need 80% or higher to pass and earn your
                        certification. Take your time and review each question carefully.
                      </p>
                    )}

                    {!quizSubmitted ? (
                      <>
                        {/* Progress bar */}
                        <div className="w-full h-1.5 rounded-full bg-stone-100 mb-8 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: "var(--mod)" }}
                            initial={false}
                            animate={{ width: `${((currentQuizIndex + 1) / shuffledQuiz.length) * 100}%` }}
                            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                          />
                        </div>

                        {/* Single question with smooth height transition */}
                        <motion.div layout transition={{ layout: { duration: 0.35, ease: [0.32, 0.72, 0, 1] } }}>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentQuizIndex}
                              layout
                              initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                              exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                            >
                              <QuizQuestionCard
                                question={shuffledQuiz[currentQuizIndex]}
                                index={currentQuizIndex}
                                accent={mod.color}
                                selected={quizAnswers[shuffledQuiz[currentQuizIndex].id]}
                                onSelect={(optIndex) => {
                                  setQuizAnswers((prev) => ({
                                    ...prev,
                                    [shuffledQuiz[currentQuizIndex].id]: optIndex,
                                  }));
                                }}
                                submitted={false}
                              />
                            </motion.div>
                          </AnimatePresence>
                        </motion.div>

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
                          {currentQuizIndex < shuffledQuiz.length - 1 ? (
                            <button
                              onClick={() => setCurrentQuizIndex((i) => i + 1)}
                              disabled={quizAnswers[shuffledQuiz[currentQuizIndex].id] == null}
                              className="flex-1 py-4 rounded-2xl bg-stone-900 text-white font-medium hover:bg-stone-800 active:scale-[0.99] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2"
                            >
                              Next Question
                              <ArrowRight size={16} weight="bold" />
                            </button>
                          ) : (
                            <button
                              onClick={handleQuizSubmit}
                              disabled={
                                alreadyQuizzed || Object.keys(quizAnswers).length !== shuffledQuiz.length
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
                          quiz={shuffledQuiz}
                          answers={quizAnswers}
                          isFinal={isFinalAssessment}
                        />

                        {/* Show all questions with answers after submit */}
                        <div className="mt-8 space-y-6">
                          {shuffledQuiz.map((q, qi) => (
                            <QuizQuestionCard
                              key={q.id}
                              question={q}
                              index={qi}
                              accent={mod.color}
                              selected={quizAnswers[q.id]}
                              onSelect={() => {}}
                              submitted={true}
                            />
                          ))}
                        </div>

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

                  </div>
                </div>
          </motion.div>
          {/* Up next — a peek at the following lesson so momentum carries over */}
          {showUpNext && nextLessonInfo && nextLink && (
            <motion.div variants={fadeUp} className="mt-14">
              <Link href={nextLink} className="group block">
                <div
                  className="card-shell"
                  style={{
                    background: `color-mix(in srgb, ${nextLessonInfo.color} 5%, transparent)`,
                    borderColor: `color-mix(in srgb, ${nextLessonInfo.color} 16%, transparent)`,
                  }}
                >
                  <div className="card-core p-5 flex items-center gap-4 transition-colors duration-300 group-hover:bg-white/40">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `color-mix(in srgb, ${nextLessonInfo.color} 14%, transparent)` }}
                    >
                      <ArrowRight size={20} weight="bold" style={{ color: nextLessonInfo.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[10px] font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: nextLessonInfo.color }}
                      >
                        {nextLessonInfo.isNewModule ? "Next module" : "Up next"}
                      </p>
                      <p className="text-sm font-semibold text-stone-800 truncate">
                        {nextLessonInfo.title}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5 truncate">
                        {nextLessonInfo.moduleTitle} &middot; {nextLessonInfo.duration}
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors duration-300 shrink-0">
                      Continue
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

          {/* Navigation */}
          <motion.div
            variants={fadeUp}
            className={`${showUpNext ? "mt-4" : "mt-14"} flex items-center justify-between gap-4`}
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
            {moduleCumulativeResult && !showModuleFail ? (
              <button
                onClick={() => {
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                  setCurrentQuizIndex(0);
                  setModuleCumulativeResult(null);
                  setQuizAttempt((a) => a + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--cta)] text-white text-sm font-medium hover:bg-[var(--cta-dark)] active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_4px_16px_rgba(240,90,40,0.25)]"
              >
                {isFinalAssessment ? "Retake Final Assessment" : "Retry Module"}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform duration-300"
                />
              </button>
            ) : showUpNext ? (
              /* Forward action lives in the Up next card above */
              <div />
            ) : nextLink && isCompleted ? (
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

          {/* Keyboard navigation hint (desktop only) */}
          {(prevLink || nextLink) && (
            <p className="hidden md:flex items-center justify-center gap-1.5 mt-6 text-[11px] text-stone-400">
              Tip: use
              <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 font-mono text-[10px] text-stone-500">←</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 font-mono text-[10px] text-stone-500">→</kbd>
              to move between lessons
            </p>
          )}
        </motion.div>
      </div>

      {/* Module Fail Popup - fixed to viewport */}
      <AnimatePresence>
        {showModuleFail && moduleCumulativeResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.92, opacity: 0, filter: "blur(8px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="card-shell max-w-md w-full relative"
            >
              <div className="card-core p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-5">
                  <X size={32} weight="bold" className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-stone-900 mb-2">
                  {isFinalAssessment ? "Assessment Not Passed" : "Module Not Passed"}
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-6 max-w-[38ch] mx-auto">
                  You scored {moduleCumulativeResult.pct}% across {isFinalAssessment ? "the final assessment" : "this module"}.
                  You need 80% or higher to pass{isFinalAssessment ? " and earn your certification" : " and earn the module badge"}.
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
                  {isFinalAssessment
                    ? "Review your answers below then retake the assessment when ready."
                    : "Review your answers below, then retake the quizzes when ready - your lesson progress is saved, so there's no need to read everything again."}
                </p>
                <button
                  onClick={() => setShowModuleFail(false)}
                  className="w-full inline-flex items-center justify-center py-4 rounded-full bg-[var(--cta)] text-white font-medium hover:bg-[var(--cta-dark)] active:scale-[0.97] transition-all duration-500 shadow-[0_4px_16px_rgba(240,90,40,0.25)]"
                >
                  Review My Answers
                </button>
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

      {/* Final Assessment Pass Popup */}
      <AnimatePresence>
        {showFinalPass && moduleCumulativeResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.92, opacity: 0, filter: "blur(8px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="card-shell max-w-md w-full relative"
            >
              <div className="card-core p-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                  className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto mb-5"
                >
                  <Trophy size={40} weight="fill" className="text-emerald-500" />
                </motion.div>
                <h3 className="text-xl font-bold tracking-tight text-stone-900 mb-2">
                  Congratulations!
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-2 max-w-[38ch] mx-auto">
                  You scored {moduleCumulativeResult.pct}% and passed the final assessment.
                </p>
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold font-mono text-emerald-600">{moduleCumulativeResult.score}/{moduleCumulativeResult.total}</p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">Your Score</p>
                  </div>
                  <div className="w-px h-10 bg-stone-200" />
                  <div className="text-center">
                    <p className="text-2xl font-bold font-mono text-stone-800">{Math.ceil(moduleCumulativeResult.total * 0.8)}/{moduleCumulativeResult.total}</p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">Required</p>
                  </div>
                </div>
                <p className="text-sm text-stone-500 leading-relaxed mb-5">
                  Enter your name to generate your competency certificate.
                </p>
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                    placeholder="Your full name"
                    className="flex-1 px-4 py-3.5 rounded-xl border border-stone-200/80 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-shadow"
                  />
                </div>
                <button
                  onClick={handleCertify}
                  disabled={!certName.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:scale-[0.97] transition-all duration-500 shadow-[0_4px_16px_rgba(4,120,87,0.25)] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Certificate size={18} weight="bold" />
                  Generate Certificate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Section heading with a short module-coloured accent tick for visual rhythm. */
function SectionHeading({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <h3 className="text-lg font-semibold tracking-tight text-stone-800 mb-3 flex items-center gap-2.5">
      <span
        aria-hidden
        className="inline-block w-[3px] h-[1.05em] rounded-full shrink-0"
        style={{ backgroundColor: accent }}
      />
      <span>{children}</span>
    </h3>
  );
}

/** Animated count-up for a percentage, honouring reduced-motion. */
function CountUpPct({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (reduce) return; // reduced motion renders the final value directly below
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.32, 0.72, 0, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, reduce]);
  return <>{reduce ? value : display}%</>;
}

function SectionRenderer({
  section,
  accent,
  isLede = false,
}: {
  section: LessonSection;
  accent: string;
  isLede?: boolean;
}) {
  if (section.type === "image" && section.imageSrc) {
    const ratio =
      section.aspect === "16:9"
        ? "aspect-video"
        : section.aspect === "1:1"
        ? "aspect-square"
        : "aspect-[4/3]";
    return (
      <figure className="w-full max-w-full">
        {section.heading && (
          <SectionHeading accent={accent}>{section.heading}</SectionHeading>
        )}
        <div
          className={`relative w-full ${ratio} overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-stone-200/60`}
        >
          <Image
            src={section.imageSrc}
            alt={section.alt ?? section.heading ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover"
          />
        </div>
        {section.body && (
          <figcaption className="text-xs text-stone-500 leading-relaxed mt-2">
            {section.body}
          </figcaption>
        )}
      </figure>
    );
  }

  if (section.type === "diagram" && section.diagramId) {
    return (
      <div className="w-full max-w-full">
        {section.heading && (
          <SectionHeading accent={accent}>{section.heading}</SectionHeading>
        )}
        {section.body && (
          <p className="text-sm text-stone-500 leading-relaxed mb-3">{section.body}</p>
        )}
        <Diagram id={section.diagramId} />
      </div>
    );
  }

  if (section.type === "case-study") {
    return (
      <div className="p-5 rounded-2xl bg-sky-50/80 border border-sky-200/40 overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen size={15} weight="fill" className="text-sky-600" />
          </div>
          <div className="break-words">
            {section.heading && (
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-500 mb-1">
                {section.heading}
              </p>
            )}
            <p className="text-sm text-sky-900/80 leading-relaxed">{section.body}</p>
            {section.source && (
              <p className="text-[11px] text-sky-400 mt-2 font-mono">
                {section.source}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (section.type === "warning") {
    return (
      <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/40 overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <Warning size={15} weight="fill" className="text-amber-600" />
          </div>
          <p className="text-sm text-amber-900/80 leading-relaxed break-words">{section.body}</p>
        </div>
      </div>
    );
  }

  if (section.type === "critical") {
    return (
      <div className="p-5 rounded-2xl bg-red-50/80 border border-red-200/40 overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
            <WarningOctagon size={15} weight="fill" className="text-red-600" />
          </div>
          <div>
            <p className="text-sm text-red-900/80 leading-relaxed font-medium break-words">
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
      <div className="p-5 rounded-2xl bg-stone-50 border-l-[3px] border-l-[var(--teal)] border border-stone-200/30 overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
            <Info size={15} weight="fill" className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-sm text-stone-600 leading-relaxed break-words">
              {section.body}
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
          <SectionHeading accent={accent}>{section.heading}</SectionHeading>
        )}
        <p className="text-sm text-stone-500 mb-4 leading-relaxed">{section.body}</p>
        <ul className="space-y-2.5">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
              <ListChecks
                size={15}
                weight="duotone"
                className="mt-0.5 shrink-0"
                style={{ color: accent }}
              />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (section.type === "numbered") {
    return (
      <div>
        {section.heading && (
          <SectionHeading accent={accent}>{section.heading}</SectionHeading>
        )}
        {section.body && (
          <p className="text-sm text-stone-500 mb-4 leading-relaxed">{section.body}</p>
        )}
        <ol className="space-y-2.5">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5"
                style={{
                  backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
                  color: accent,
                }}
              >
                {i + 1}
              </span>
              <span className="leading-relaxed pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div>
      {section.heading && (
        <SectionHeading accent={accent}>{section.heading}</SectionHeading>
      )}
      <p
        className={
          isLede
            ? "text-lg text-stone-700 leading-relaxed max-w-[65ch]"
            : "text-base text-stone-600 leading-relaxed max-w-[65ch]"
        }
      >
        {section.body}
      </p>
    </div>
  );
}

function QuizQuestionCard({
  question,
  index,
  accent,
  selected,
  onSelect,
  submitted,
}: {
  question: QuizQuestion;
  index: number;
  accent: string;
  selected: number | undefined;
  onSelect: (idx: number) => void;
  submitted: boolean;
}) {
  const answered = selected != null;
  const gotItRight = answered && selected === question.correctIndex;

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
          const isSelected = selected === oi;
          const isCorrect = question.correctIndex === oi;
          const dotSelected = isSelected && !submitted;
          let borderClass = "border-stone-200/80 hover:border-stone-300";
          let bgClass = "bg-white";
          let optStyle: React.CSSProperties | undefined;

          if (submitted) {
            if (isCorrect) {
              borderClass = "border-emerald-300/80";
              bgClass = "bg-emerald-50/60";
            } else if (isSelected && !isCorrect) {
              borderClass = "border-red-300/80";
              bgClass = "bg-red-50/60";
            }
          } else if (isSelected) {
            borderClass = "";
            bgClass = "";
            optStyle = {
              borderColor: `color-mix(in srgb, ${accent} 45%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${accent} 7%, transparent)`,
            };
          }

          return (
            <button
              key={oi}
              onClick={() => onSelect(oi)}
              style={optStyle}
              className={`w-full text-left px-4 py-3.5 rounded-xl border ${borderClass} ${bgClass} ${
                submitted && isSelected && !isCorrect ? "shake" : ""
              } text-sm transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center gap-3 active:scale-[0.99]`}
            >
              <span
                style={
                  dotSelected
                    ? { borderColor: accent, backgroundColor: accent, color: "#fff" }
                    : undefined
                }
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] font-bold transition-all duration-300 ${
                  submitted && isCorrect
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : submitted && isSelected && !isCorrect
                    ? "border-red-400 bg-red-400 text-white"
                    : dotSelected
                    ? ""
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
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="pl-9 overflow-hidden"
          >
            <p
              className={`text-[11px] font-semibold uppercase tracking-wider mb-1 ${
                gotItRight ? "text-emerald-600" : answered ? "text-red-500" : "text-stone-400"
              }`}
            >
              {gotItRight ? "Correct" : answered ? "Not quite" : "Explanation"}
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              {question.explanation}
            </p>
          </motion.div>
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
            <CountUpPct value={pct} />
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

