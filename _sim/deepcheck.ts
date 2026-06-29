/**
 * SlideSure DEEP integrity audit — content, assets, scoring math, and the
 * cross-file contracts the unit sim (sim.ts) doesn't touch.
 *
 * Pure analysis: imports the real course data + the real diagram registry text
 * + the real public/ asset tree, and reports every inconsistency a learner or
 * admin could hit. No network, no DB.
 *
 * Run:  node _sim/deepcheck.ts
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const { modules, getTotalLessons, getTotalQuizQuestions } = await import(
  "../src/data/training-modules.ts"
);

const problems: string[] = [];
const warnings: string[] = [];
const notes: string[] = [];
const fail = (m: string) => problems.push(m);
const warn = (m: string) => warnings.push(m);

// ---------------------------------------------------------------------------
// 1. LESSON / MODULE SHAPE
// ---------------------------------------------------------------------------
const contentModules = modules.filter((m: any) => m.id !== "assessment");
const assessment = modules.find((m: any) => m.id === "assessment");

let lessonCount = 0;
const perModule: Record<string, number> = {};
for (const m of modules) {
  perModule[m.id] = m.lessons.length;
  lessonCount += m.lessons.length;
}
console.log("Modules:", modules.length, "| content:", contentModules.length);
console.log("Lessons per module:", JSON.stringify(perModule));
console.log("getTotalLessons():", getTotalLessons(), "| counted:", lessonCount);
console.log("getTotalQuizQuestions():", getTotalQuizQuestions());

// Module numbers should be unique + sequential-ish
const numbers = modules.map((m: any) => m.number);
if (new Set(numbers).size !== numbers.length) fail(`Module numbers not unique: ${numbers.join(",")}`);

// ---------------------------------------------------------------------------
// 2. QUIZ QUESTION INTEGRITY (semantic, beyond the unit sim's range check)
// ---------------------------------------------------------------------------
let totalQ = 0;
for (const m of modules) {
  for (const l of m.lessons) {
    for (const q of l.quiz ?? []) {
      totalQ++;
      const where = `${m.id}/${l.id}/${q.id}`;
      if (!q.question || q.question.trim() === "") fail(`Empty question text: ${where}`);
      if (!q.explanation || q.explanation.trim() === "") fail(`Empty explanation: ${where}`);
      if (!Array.isArray(q.options)) { fail(`Options not an array: ${where}`); continue; }
      // duplicate option text within a question (confuses the text-keyed answer store)
      const opts = q.options.map((o: string) => (o ?? "").trim().toLowerCase());
      const dupOpt = opts.find((o: string, i: number) => opts.indexOf(o) !== i);
      if (dupOpt) fail(`Duplicate option text "${dupOpt}" in ${where} — text-keyed answers (progress-store) will collide`);
      // correctIndex range (unit sim checks this too — belt & suspenders)
      if (q.correctIndex < 0 || q.correctIndex >= q.options.length)
        fail(`correctIndex ${q.correctIndex} out of range (${q.options.length} opts): ${where}`);
      // 4 options is the design; the keyboard handler maps A-D only
      if (q.options.length > 4)
        warn(`${where} has ${q.options.length} options — keyboard shortcuts only cover A-D (1-4)`);
      if (q.options.length < 2) fail(`${where} has <2 options`);
      // type must be one of the union (renderer/data contract)
      if (!["knowledge", "scenario", "defect"].includes(q.type))
        fail(`Unknown question type "${q.type}": ${where}`);
    }
  }
}

// ---------------------------------------------------------------------------
// 3. FINAL ASSESSMENT POOL — the page slices 20 random; pool must exceed 20
//    or "each attempt is different" is false and the slice is the whole pool.
// ---------------------------------------------------------------------------
const aPool = assessment?.lessons[0]?.quiz?.length ?? 0;
console.log("Assessment pool size:", aPool);
if (aPool < 20) fail(`Assessment pool is ${aPool} (<20) — cannot draw 20 questions; quiz length would be ${aPool}`);
else if (aPool === 20) warn(`Assessment pool is exactly 20 — every attempt is identical (no randomness), despite copy saying "different set each time"`);
else notes.push(`Assessment pool ${aPool} > 20 — slice(0,20) gives varied attempts ✓`);
// keyTakeaways claims "pool of 45+"
const claim = (assessment?.lessons[0]?.keyTakeaways ?? []).join(" ");
if (/45\+/.test(claim) && aPool < 45) warn(`Assessment copy claims "pool of 45+" but actual pool is ${aPool}`);

// ---------------------------------------------------------------------------
// 4. DIAGRAM REFERENCES resolve to a registered renderer
// ---------------------------------------------------------------------------
const idxText = readFileSync(join(root, "src/components/diagrams/index.tsx"), "utf8");
// keys of DIAGRAM_MAP: "key": Component
const mapKeys = new Set(
  [...idxText.matchAll(/"([a-z0-9-]+)":\s*[A-Z]/g)].map((m) => m[1])
);
let diagRefs = 0;
for (const m of modules) {
  for (const l of m.lessons) {
    for (const s of l.content ?? []) {
      if (s.type === "diagram") {
        diagRefs++;
        if (!s.diagramId) fail(`diagram section with no diagramId in ${m.id}/${l.id}`);
        else if (!mapKeys.has(s.diagramId))
          fail(`Unknown diagramId "${s.diagramId}" referenced in ${m.id}/${l.id} — renders nothing`);
      }
    }
  }
}
console.log("Registered diagrams:", mapKeys.size, "| diagram refs in content:", diagRefs);

// ---------------------------------------------------------------------------
// 5. IMAGE REFERENCES resolve to a real file under public/
// ---------------------------------------------------------------------------
function walk(dir: string, base = ""): Set<string> {
  const out = new Set<string>();
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) for (const f of walk(join(dir, e.name), rel)) out.add(f);
    else out.add(rel);
  }
  return out;
}
const pub = walk(join(root, "public"));
const has = (src: string) => existsSync(join(root, "public", src.replace(/^\//, "")));
let imgRefs = 0;
for (const m of modules) {
  for (const l of m.lessons) {
    for (const s of l.content ?? []) {
      if (s.type === "image" && s.imageSrc) {
        imgRefs++;
        if (!has(s.imageSrc)) fail(`Missing image file "${s.imageSrc}" in ${m.id}/${l.id}`);
      }
      if (s.type === "image-pair" && s.pair) {
        for (const p of s.pair) {
          imgRefs++;
          if (!has(p.src)) fail(`Missing image-pair file "${p.src}" in ${m.id}/${l.id}`);
        }
      }
    }
  }
}
console.log("Image refs in content:", imgRefs, "| files under public/:", pub.size);

// ---------------------------------------------------------------------------
// 6. CROSS-FILE CONTRACTS (the bugs found by reading the routes)
// ---------------------------------------------------------------------------
// 6a. certify route reads quiz_scores["final-assessment"]; real lesson id is...
const certifyText = readFileSync(join(root, "src/app/api/certify/route.ts"), "utf8");
const certKey = certifyText.match(/quiz_scores\?\.\["([^"]+)"\]/)?.[1];
const realAssessmentLessonId = assessment?.lessons[0]?.id;
if (certKey && certKey !== realAssessmentLessonId)
  fail(`certify/route.ts reads quiz_scores["${certKey}"] but the assessment lesson id is "${realAssessmentLessonId}" — certificate score/total will always be null`);

// 6b. dashboard route hardcodes TOTAL_LESSONS; must equal getTotalLessons()
const dashText = readFileSync(join(root, "src/app/api/dashboard/route.ts"), "utf8");
const dashTotal = Number(dashText.match(/TOTAL_LESSONS\s*=\s*(\d+)/)?.[1]);
if (dashTotal && dashTotal !== getTotalLessons())
  fail(`dashboard/route.ts hardcodes TOTAL_LESSONS=${dashTotal} but getTotalLessons()=${getTotalLessons()} — team progress % is wrong (a finished learner shows ${Math.round((getTotalLessons()/dashTotal)*100)}%)`);

// 6c. train page deep-links to the assessment's first lesson
const trainText = readFileSync(join(root, "src/app/train/page.tsx"), "utf8");
const deepLink = trainText.match(/\/train\/assessment\/([a-z0-9-]+)/)?.[1];
if (deepLink && deepLink !== realAssessmentLessonId)
  fail(`train/page.tsx deep-links /train/assessment/${deepLink} but assessment lesson id is "${realAssessmentLessonId}" — dead link`);

// 6d. quizzes grade client-side from training-modules.ts. The old server-side
//     pool (/api/quiz + quiz_questions table + seed SQL) was removed because it
//     was unused AND its answers had drifted out of sync with the bundled data.
//     Guard against any of it creeping back as dead, divergent code.
if (existsSync(join(root, "src/app/api/quiz/route.ts")))
  warn(`src/app/api/quiz/route.ts is back — quizzes grade client-side from training-modules.ts; a server route would drift out of sync with the bundled answers (it did before)`);
if (existsSync(join(root, "supabase-seed-questions.sql")))
  warn(`supabase-seed-questions.sql is back — this seed is unused by the live quiz flow and previously held wrong answers`);

// ---------------------------------------------------------------------------
// 7. PASS-MARK MATH — confirm 80% boundary is consistent across surfaces
//    pages use Math.ceil(total*0.8) for "required"; store uses round(pct)>=80.
// ---------------------------------------------------------------------------
for (const m of contentModules) {
  const total = m.lessons.reduce((a: number, l: any) => a + l.quiz.length, 0);
  const required = Math.ceil(total * 0.8);
  // smallest score that the store (round(score/total*100)>=80) treats as pass
  let firstPassByRound = total;
  for (let s = 0; s <= total; s++) {
    if (Math.round((s / total) * 100) >= 80) { firstPassByRound = s; break; }
  }
  if (firstPassByRound !== required)
    warn(`Module ${m.id}: "Required" chip shows ${required}/${total} but store passes at ${firstPassByRound}/${total} (rounding vs ceil mismatch)`);
}

// ---------------------------------------------------------------------------
// REPORT
// ---------------------------------------------------------------------------
console.log("\n==== DEEP CHECK ====");
console.log("Questions audited:", totalQ);
console.log(`\nProblems: ${problems.length}`);
for (const p of problems) console.log("  ✗ " + p);
console.log(`\nWarnings: ${warnings.length}`);
for (const w of warnings) console.log("  ! " + w);
console.log(`\nNotes: ${notes.length}`);
for (const n of notes) console.log("  • " + n);
if (problems.length) process.exitCode = 1;
