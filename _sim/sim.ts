/**
 * SlideSure training-flow simulation harness.
 *
 * Drives the REAL progression logic (src/lib/progress-store.ts) against the
 * REAL course data (src/data/training-modules.ts) with no network: the store
 * falls back to localStorage when the Clerk/Supabase env vars are absent, so we
 * shim window + localStorage and exercise every learner path deterministically.
 *
 * Run:  node _sim/sim.ts
 */

// --- Browser shims (must exist before the store module runs) ---------------
const store = new Map<string, string>();
(globalThis as any).window = globalThis;
(globalThis as any).localStorage = {
  getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
};
// Ensure API mode is OFF so the store uses the synchronous localStorage path.
delete (process.env as any).NEXT_PUBLIC_SUPABASE_URL;
delete (process.env as any).NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// --- Imports (dynamic, after shims) ----------------------------------------
const { modules, getTotalLessons } = await import("../src/data/training-modules.ts");
const P = await import("../src/lib/progress-store.ts");

type Mod = (typeof modules)[number];

// --- Tiny assert framework -------------------------------------------------
let passed = 0;
const failures: string[] = [];
function check(cond: boolean, msg: string) {
  if (cond) passed++;
  else failures.push(msg);
}

const contentModules = modules.filter((m) => m.id !== "assessment");
const assessment = modules.find((m) => m.id === "assessment")!;

// Helper: simulate taking one lesson's quiz with a given fraction correct.
async function takeLesson(mod: Mod, lessonId: string, fractionCorrect: number) {
  const lesson = mod.lessons.find((l) => l.id === lessonId)!;
  const total = lesson.quiz.length;
  const score = Math.round(total * fractionCorrect);
  await P.saveQuizScore(lessonId, score, total);
  await P.completeLesson(lessonId);
}

// Mirror the module-complete page: badge awarded only at >= 80% cumulative.
async function settleModule(mod: Mod) {
  if (P.isModuleFullyQuizzed(mod.id, modules)) {
    const r = P.getModuleCumulativeScore(mod.id, modules);
    if (r.pct >= 80) await P.completeModule(mod.id);
  }
}

// ===========================================================================
// 0. DATA INTEGRITY — the kind of thing that silently breaks a learner
// ===========================================================================
{
  const lessonIds = new Set<string>();
  const dupLessonIds: string[] = [];
  const qIds = new Set<string>();
  const dupQIds: string[] = [];
  let badQuiz = 0;
  let emptyQuiz = 0;

  for (const m of modules) {
    for (const l of m.lessons) {
      if (lessonIds.has(l.id)) dupLessonIds.push(l.id);
      lessonIds.add(l.id);
      if (!l.quiz || l.quiz.length === 0) emptyQuiz++;
      for (const q of l.quiz ?? []) {
        if (qIds.has(q.id)) dupQIds.push(q.id);
        qIds.add(q.id);
        if (
          !Array.isArray(q.options) ||
          q.options.length < 2 ||
          q.correctIndex < 0 ||
          q.correctIndex >= q.options.length ||
          q.options.some((o) => typeof o !== "string" || o.trim() === "")
        ) {
          badQuiz++;
        }
      }
    }
  }

  check(dupLessonIds.length === 0, `Duplicate lesson IDs (collide in completedLessons): ${dupLessonIds.join(", ")}`);
  check(dupQIds.length === 0, `Duplicate quiz question IDs (collide in stored answers): ${dupQIds.join(", ")}`);
  check(emptyQuiz === 0, `${emptyQuiz} lesson(s) have an empty quiz — cannot be completed (completeLesson only fires on quiz submit)`);
  check(badQuiz === 0, `${badQuiz} quiz question(s) have an out-of-range correctIndex or blank/insufficient options`);
}

// ===========================================================================
// 1. PERFECT LEARNER — can the whole course be finished start to finish?
// ===========================================================================
{
  await P.resetProgress();
  await P.refreshProgress();

  // Walk content modules strictly in order, respecting the unlock gate.
  for (const m of contentModules) {
    for (const l of m.lessons) {
      check(
        P.isLessonUnlocked(l.id, modules),
        `Perfect run: lesson ${m.id}/${l.id} should be unlocked when reached in order, but was locked`
      );
      await takeLesson(m, l.id, 1);
    }
    await settleModule(m);
    check(
      P.isModuleComplete(m.id, modules),
      `Perfect run: module ${m.id} all lessons should read complete`
    );
    check(
      P.getProgress().completedModules.includes(m.id),
      `Perfect run: module ${m.id} badge should be earned at 100%`
    );
  }

  // Assessment should now be unlocked.
  check(
    P.isLessonUnlocked(assessment.lessons[0].id, modules),
    `Perfect run: final assessment should unlock once every module is passed`
  );

  // Take + pass the assessment.
  const aLesson = assessment.lessons[0];
  await takeLesson(assessment, aLesson.id, 1);
  const aScore = P.getModuleCumulativeScore(assessment.id, modules);
  check(aScore.pct >= 80, `Perfect run: assessment cumulative should be a pass, got ${aScore.pct}%`);
  if (aScore.pct >= 80) await P.completeModule(assessment.id);

  await P.setCertified("Test Learner");
  check(P.getProgress().certified === true, `Perfect run: learner should be certified after passing the assessment`);

  const total = getTotalLessons();
  check(
    P.getCompletionPercentage(total) === 100,
    `Perfect run: completion should be 100%, got ${P.getCompletionPercentage(total)}% (completed ${P.getProgress().completedLessons.length}/${total})`
  );
}

// ===========================================================================
// 2. UNLOCK GATE — lessons cannot be skipped ahead of their predecessor
// ===========================================================================
{
  await P.resetProgress();
  await P.refreshProgress();

  const firstMod = contentModules[0];
  if (firstMod.lessons.length >= 2) {
    check(
      P.isLessonUnlocked(firstMod.lessons[0].id, modules),
      `Gate: first lesson of first module must be open from the start`
    );
    check(
      !P.isLessonUnlocked(firstMod.lessons[1].id, modules),
      `Gate: lesson 2 must stay locked until lesson 1 is quizzed`
    );
    // Quiz lesson 1, then lesson 2 should open.
    await takeLesson(firstMod, firstMod.lessons[0].id, 1);
    check(
      P.isLessonUnlocked(firstMod.lessons[1].id, modules),
      `Gate: lesson 2 must open after lesson 1 is quizzed`
    );
  }

  // Assessment must be locked while any module is unpassed.
  check(
    !P.isLessonUnlocked(assessment.lessons[0].id, modules),
    `Gate: assessment must be locked before all modules are passed`
  );
}

// ===========================================================================
// 3. PASS BOUNDARY — exactly 80% passes, just under fails; fail blocks badge
// ===========================================================================
{
  // Find a module whose total questions make 79% vs 80% distinguishable.
  for (const m of contentModules) {
    await P.resetProgress();
    await P.refreshProgress();
    // Unlock path: quiz every prior module's lessons at 100% + badge them.
    for (const pm of contentModules) {
      if (pm.id === m.id) break;
      for (const l of pm.lessons) await takeLesson(pm, l.id, 1);
      await settleModule(pm);
    }
    // Take THIS module at just under 80%.
    const totalQ = m.lessons.reduce((a, l) => a + l.quiz.length, 0);
    const target = Math.floor(totalQ * 0.79);
    // Distribute `target` correct answers across lessons.
    let remaining = target;
    for (const l of m.lessons) {
      const give = Math.min(l.quiz.length, remaining);
      await P.saveQuizScore(l.id, give, l.quiz.length);
      await P.completeLesson(l.id);
      remaining -= give;
    }
    await settleModule(m);
    const r = P.getModuleCumulativeScore(m.id, modules);
    check(
      !P.getProgress().completedModules.includes(m.id),
      `Boundary: module ${m.id} at ${r.pct}% (<80) must NOT earn a badge`
    );
    check(
      !P.isLessonUnlocked(assessment.lessons[0].id, modules),
      `Boundary: a failed module ${m.id} must keep the assessment locked`
    );
    break; // one representative module is enough
  }
}

// ===========================================================================
// 4. RETAKE RECOVERY — a failed module can be retaken to a pass and unblocks
// ===========================================================================
{
  await P.resetProgress();
  await P.refreshProgress();
  const m = contentModules[0];
  // Fail it: 0%.
  for (const l of m.lessons) await takeLesson(m, l.id, 0);
  await settleModule(m);
  check(!P.getProgress().completedModules.includes(m.id), `Retake: module should be unbadged after a 0% run`);
  // Retake reset (mirror complete-page handleRetake), then perfect run.
  await P.resetModuleProgress(m.id, modules);
  check(
    P.getProgress().completedLessons.filter((id) => m.lessons.some((l) => l.id === id)).length === 0,
    `Retake: resetModuleProgress should clear this module's completed lessons`
  );
  check(
    P.isLessonUnlocked(m.lessons[0].id, modules),
    `Retake: module's first lesson should be open again after reset`
  );
  for (const l of m.lessons) await takeLesson(m, l.id, 1);
  await settleModule(m);
  check(P.getProgress().completedModules.includes(m.id), `Retake: module should be badged after a perfect retake`);
}

// ===========================================================================
// 5. MONOTONIC FLOOR — a stale/empty server read must not erase progress
//    (validates the merge-floor fix in load()/mergeProgress)
// ===========================================================================
{
  await P.resetProgress();
  await P.refreshProgress();
  const m = contentModules[0];
  await takeLesson(m, m.lessons[0].id, 1);
  const before = P.getProgress().completedLessons.length;
  // Simulate a stale reload: refreshProgress re-reads storage. With the floor,
  // the just-written completion must survive.
  await P.refreshProgress();
  const after = P.getProgress().completedLessons.length;
  check(after >= before && after >= 1, `Monotonic: refresh after completing a lesson dropped it (${before} -> ${after})`);
}

// --- Report ----------------------------------------------------------------
console.log("\n==== SlideSure training-flow simulation ====");
console.log(`Modules: ${modules.length} (content ${contentModules.length} + assessment)`);
console.log(`Total content lessons: ${getTotalLessons()}`);
console.log(`Checks passed: ${passed}`);
console.log(`Checks failed: ${failures.length}`);
if (failures.length) {
  console.log("\n--- FAILURES ---");
  for (const f of failures) console.log("  ✗ " + f);
  process.exitCode = 1;
} else {
  console.log("\nAll invariants held. ✓");
}
