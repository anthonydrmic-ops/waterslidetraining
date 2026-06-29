"use client";

import type { Module } from "@/data/training-modules";

export interface UserProgress {
  userId: string | null;
  completedLessons: string[];
  completedModules: string[];
  // `answers` records the option *text* the user chose for each question id, so
  // a revisited quiz can show exactly what they picked. Storing text (not an
  // index) keeps it correct across re-shuffles and retries, and it lives inside
  // the existing quiz_scores JSONB column — no schema change required.
  quizScores: Record<
    string,
    { score: number; total: number; date: string; answers?: Record<string, string> }
  >;
  currentModule: string | null;
  currentLesson: string | null;
  certified: boolean;
  certificationDate: string | null;
  userName: string | null;
}

const STORAGE_KEY = "waterslide-training-progress";

export const defaultProgress: UserProgress = {
  userId: null,
  completedLessons: [],
  completedModules: [],
  quizScores: {},
  currentModule: null,
  currentLesson: null,
  certified: false,
  certificationDate: null,
  userName: null,
};

// ---------------------------------------------------------------------------
// Storage backend abstraction
// Tries API (Supabase via /api/progress) first, falls back to localStorage.
// ---------------------------------------------------------------------------

function apiAvailable(): boolean {
  if (typeof window === "undefined") return false;
  // API mode is active when env vars are set (Clerk + Supabase configured)
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
}

function readLocal(): UserProgress | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return { ...defaultProgress, ...JSON.parse(stored) };
  } catch {
    return null;
  }
}

/**
 * Merge a server snapshot with the locally-cached one so progress can never
 * regress. Completions are monotonic (they only ever grow, except via an
 * explicit reset — which clears localStorage too, so the floor goes with it).
 * Without this floor a stale or read-after-write-lagged GET could blank out a
 * lesson the user just finished, which showed up as "completed lesson 2 of 3
 * but the overview won't confirm it's done." Scalars (certified, position,
 * name) take the server value; sets are unioned; per-lesson quiz scores keep
 * the server entry when present and otherwise retain any local-only entry.
 */
function mergeProgress(server: UserProgress, local: UserProgress): UserProgress {
  return {
    ...server,
    completedLessons: Array.from(
      new Set([...server.completedLessons, ...local.completedLessons])
    ),
    completedModules: Array.from(
      new Set([...server.completedModules, ...local.completedModules])
    ),
    quizScores: { ...local.quizScores, ...server.quizScores },
  };
}

async function load(): Promise<UserProgress> {
  if (typeof window === "undefined") return defaultProgress;

  const local = readLocal();

  if (apiAvailable()) {
    try {
      const res = await fetch("/api/progress");
      if (res.ok) {
        const data = await res.json();
        const server = { ...defaultProgress, ...data };
        return local ? mergeProgress(server, local) : server;
      }
    } catch { /* fall through to localStorage */ }
  }

  return local ?? defaultProgress;
}

async function persist(progress: UserProgress): Promise<void> {
  if (typeof window === "undefined") return;

  // Always write to localStorage as cache
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

  if (apiAvailable()) {
    try {
      await fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progress),
      });
    } catch { /* localStorage already saved as fallback */ }
  }
}

// ---------------------------------------------------------------------------
// Synchronous cache — components read from this for instant UI.
// Kept in sync by every mutation and by refreshProgress().
// ---------------------------------------------------------------------------

let _cache: UserProgress = defaultProgress;

/** Call once on mount to hydrate the cache from storage/API. */
export async function refreshProgress(): Promise<UserProgress> {
  _cache = await load();
  return _cache;
}

/** Synchronous read from cache. Safe for render. */
export function getProgress(): UserProgress {
  return _cache;
}

// ---------------------------------------------------------------------------
// Mutations — all async, all update cache + persist in one step.
// Components should await these, then setProgress(result).
// ---------------------------------------------------------------------------

export async function completeLesson(lessonId: string): Promise<UserProgress> {
  const progress = { ..._cache };
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons = [...progress.completedLessons, lessonId];
  }
  _cache = progress;
  await persist(progress);
  return progress;
}

export async function saveQuizScore(
  lessonId: string,
  score: number,
  total: number,
  answers?: Record<string, string>
): Promise<UserProgress> {
  const progress = {
    ..._cache,
    quizScores: {
      ..._cache.quizScores,
      [lessonId]: { score, total, date: new Date().toISOString(), answers },
    },
  };
  _cache = progress;
  await persist(progress);
  return progress;
}

export async function setCurrentPosition(
  moduleId: string | null,
  lessonId: string | null
): Promise<UserProgress> {
  const progress = { ..._cache, currentModule: moduleId, currentLesson: lessonId };
  _cache = progress;
  await persist(progress);
  return progress;
}

export async function setCertified(userName: string): Promise<UserProgress> {
  const progress = {
    ..._cache,
    certified: true,
    certificationDate: new Date().toISOString(),
    userName,
  };
  _cache = progress;
  await persist(progress);
  return progress;
}

export async function completeModule(moduleId: string): Promise<UserProgress> {
  const progress = { ..._cache };
  if (!progress.completedModules.includes(moduleId)) {
    progress.completedModules = [...progress.completedModules, moduleId];
  }
  _cache = progress;
  await persist(progress);
  return progress;
}

export async function resetProgress(): Promise<UserProgress> {
  _cache = { ...defaultProgress };
  await persist(_cache);
  return _cache;
}

// ---------------------------------------------------------------------------
// First-visit welcome flag.
// Stored as a sentinel entry INSIDE quizScores so it rides the existing
// /api/progress round-trip into the quiz_scores JSONB column - no schema
// change, synced across devices, and every lookup elsewhere is by lesson id
// so the sentinel never collides. (Same trick as the stored quiz answers.)
// ---------------------------------------------------------------------------

const WELCOME_KEY = "__welcome-seen";

/** True once this user has dismissed the first-visit welcome (any device). */
export function hasSeenWelcome(): boolean {
  return _cache.quizScores[WELCOME_KEY] != null;
}

export async function markWelcomeSeen(): Promise<UserProgress> {
  if (hasSeenWelcome()) return _cache;
  const progress = {
    ..._cache,
    quizScores: {
      ..._cache.quizScores,
      [WELCOME_KEY]: { score: 0, total: 0, date: new Date().toISOString() },
    },
  };
  _cache = progress;
  await persist(progress);
  return progress;
}

// ---------------------------------------------------------------------------
// Derived helpers — synchronous, read from cache
// ---------------------------------------------------------------------------

export function getCompletionPercentage(totalLessons: number): number {
  return Math.round((_cache.completedLessons.length / totalLessons) * 100);
}

export function isLessonUnlocked(lessonId: string, allModules: Module[]): boolean {
  for (let mi = 0; mi < allModules.length; mi++) {
    const mod = allModules[mi];
    for (let li = 0; li < mod.lessons.length; li++) {
      if (mod.lessons[li].id === lessonId) {
        // Assessment module requires all previous modules to be completed
        if (mod.id === "assessment") {
          const prevModules = allModules.filter((m) => m.id !== "assessment");
          const allPrevCompleted = prevModules.every((m) =>
            _cache.completedModules.includes(m.id)
          );
          if (!allPrevCompleted) return false;
        }
        // First lesson in a module is accessible (if module gate passed)
        if (li === 0) return true;
        // Within a module, previous lesson must have been quizzed
        return _cache.quizScores[mod.lessons[li - 1].id] != null;
      }
    }
  }
  return false;
}

export function isModuleComplete(moduleId: string, allModules: Module[]): boolean {
  const mod = allModules.find((m) => m.id === moduleId);
  if (!mod) return false;
  return mod.lessons.every((l) => _cache.completedLessons.includes(l.id));
}

/** Get cumulative quiz score across all lessons in a module. */
export function getModuleCumulativeScore(moduleId: string, allModules: Module[]): { score: number; total: number; pct: number } {
  const mod = allModules.find((m) => m.id === moduleId);
  if (!mod) return { score: 0, total: 0, pct: 0 };
  let score = 0;
  let total = 0;
  for (const lesson of mod.lessons) {
    const qs = _cache.quizScores[lesson.id];
    if (qs) {
      score += qs.score;
      total += qs.total;
    }
  }
  return { score, total, pct: total > 0 ? Math.round((score / total) * 100) : 0 };
}

/** Check if all lessons in a module have been quizzed (regardless of pass/fail). */
export function isModuleFullyQuizzed(moduleId: string, allModules: Module[]): boolean {
  const mod = allModules.find((m) => m.id === moduleId);
  if (!mod) return false;
  return mod.lessons.every((l) => _cache.quizScores[l.id] != null);
}

/** Reset all quiz scores and completed lessons for a specific module. */
export async function resetModuleProgress(moduleId: string, allModules: Module[]): Promise<UserProgress> {
  const mod = allModules.find((m) => m.id === moduleId);
  if (!mod) return _cache;
  const lessonIds = mod.lessons.map((l) => l.id);
  const progress = {
    ..._cache,
    completedLessons: _cache.completedLessons.filter((id) => !lessonIds.includes(id)),
    completedModules: _cache.completedModules.filter((id) => id !== moduleId),
    quizScores: { ..._cache.quizScores },
  };
  for (const id of lessonIds) {
    delete progress.quizScores[id];
  }
  _cache = progress;
  await persist(progress);
  return progress;
}

/**
 * Gentler than resetModuleProgress: clears only the quiz scores for a module
 * (so the learner can re-attempt) while KEEPING their lessons-read progress.
 * Used when a module quiz is failed — they shouldn't have to re-read everything
 * to retry, just retake the quizzes. The module badge is removed until re-passed.
 */
export async function resetModuleQuizzes(moduleId: string, allModules: Module[]): Promise<UserProgress> {
  const mod = allModules.find((m) => m.id === moduleId);
  if (!mod) return _cache;
  const lessonIds = mod.lessons.map((l) => l.id);
  const progress = {
    ..._cache,
    completedModules: _cache.completedModules.filter((id) => id !== moduleId),
    quizScores: { ..._cache.quizScores },
  };
  for (const id of lessonIds) {
    delete progress.quizScores[id];
  }
  _cache = progress;
  await persist(progress);
  return progress;
}
