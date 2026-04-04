"use client";

import { useState } from "react";
import { modules } from "@/data/training-modules";
import {
  refreshProgress,
  completeLesson,
  completeModule,
  saveQuizScore,
  setCertified,
  resetProgress,
} from "@/lib/progress-store";
import { useRouter } from "next/navigation";

export default function DevPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Ready");
  const [name, setName] = useState("John Smith");

  const simulateFullCompletion = async () => {
    setStatus("Simulating...");
    await refreshProgress();

    // Complete every lesson and quiz in every module
    for (const mod of modules) {
      for (const lesson of mod.lessons) {
        const total = lesson.quiz.length;
        await saveQuizScore(lesson.id, total, total); // perfect score
        await completeLesson(lesson.id);
      }
      await completeModule(mod.id);
    }

    // Certify
    await setCertified(name.trim() || "John Smith");

    setStatus("Done - redirecting...");
    router.push("/train/certified");
  };

  const handleReset = async () => {
    await resetProgress();
    setStatus("Progress reset");
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--background)] flex items-center justify-center p-6">
      <div className="card-shell max-w-md w-full">
        <div className="card-core p-8">
          <p className="text-[10px] uppercase tracking-widest text-stone-400 font-mono mb-1">
            Dev Tools
          </p>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 mb-6">
            Course Simulation
          </h1>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-stone-500 mb-1.5 block">
                Certificate Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 transition-shadow"
              />
            </div>

            <button
              onClick={simulateFullCompletion}
              className="w-full py-3.5 rounded-full bg-[var(--cta)] text-white text-sm font-medium hover:bg-[var(--cta-dark)] active:scale-[0.97] transition-all duration-300 shadow-[0_4px_16px_rgba(240,90,40,0.25)]"
            >
              Simulate Full Completion
            </button>

            <button
              onClick={handleReset}
              className="w-full py-3.5 rounded-full bg-stone-100 text-stone-600 text-sm font-medium hover:bg-stone-200 active:scale-[0.97] transition-all duration-300"
            >
              Reset All Progress
            </button>

            <p className="text-xs text-stone-400 text-center pt-2">
              Status: {status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
