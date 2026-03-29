"use client";

export interface UserProgress {
  completedLessons: string[];
  quizScores: Record<string, { score: number; total: number; date: string }>;
  currentModule: string | null;
  currentLesson: string | null;
  certified: boolean;
  certificationDate: string | null;
  userName: string | null;
}

const STORAGE_KEY = "waterslide-training-progress";

const defaultProgress: UserProgress = {
  completedLessons: [],
  quizScores: {},
  currentModule: null,
  currentLesson: null,
  certified: false,
  certificationDate: null,
  userName: null,
};

export function getProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(stored) };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function completeLesson(lessonId: string): UserProgress {
  const progress = getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  saveProgress(progress);
  return progress;
}

export function saveQuizScore(
  lessonId: string,
  score: number,
  total: number
): UserProgress {
  const progress = getProgress();
  progress.quizScores[lessonId] = {
    score,
    total,
    date: new Date().toISOString(),
  };
  saveProgress(progress);
  return progress;
}

export function setCurrentPosition(
  moduleId: string | null,
  lessonId: string | null
): UserProgress {
  const progress = getProgress();
  progress.currentModule = moduleId;
  progress.currentLesson = lessonId;
  saveProgress(progress);
  return progress;
}

export function setCertified(userName: string): UserProgress {
  const progress = getProgress();
  progress.certified = true;
  progress.certificationDate = new Date().toISOString();
  progress.userName = userName;
  saveProgress(progress);
  return progress;
}

export function resetProgress(): UserProgress {
  saveProgress(defaultProgress);
  return defaultProgress;
}

export function getCompletionPercentage(totalLessons: number): number {
  const progress = getProgress();
  return Math.round((progress.completedLessons.length / totalLessons) * 100);
}
