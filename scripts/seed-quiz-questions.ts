/**
 * Generates SQL to seed quiz questions into Supabase.
 * Run: npx tsx scripts/seed-quiz-questions.ts > supabase-seed-questions.sql
 */

import { modules } from "../src/data/training-modules";

function escapeSQL(str: string): string {
  return str.replace(/'/g, "''");
}

console.log("-- SlideSure Quiz Question Seed");
console.log("-- Auto-generated from training-modules.ts");
console.log("-- Run this in Supabase SQL editor after supabase-schema-v2.sql\n");
console.log("DELETE FROM quiz_questions;\n");

let count = 0;

for (const mod of modules) {
  console.log(`-- Module: ${mod.title}`);
  for (const lesson of mod.lessons) {
    if (!lesson.quiz || lesson.quiz.length === 0) continue;
    for (const q of lesson.quiz) {
      const options = `ARRAY[${q.options.map((o) => `'${escapeSQL(o)}'`).join(", ")}]`;
      console.log(
        `INSERT INTO quiz_questions (id, lesson_id, module_id, question, options, correct_index, explanation, type) VALUES ('${escapeSQL(q.id)}', '${escapeSQL(lesson.id)}', '${escapeSQL(mod.id)}', '${escapeSQL(q.question)}', ${options}, ${q.correctIndex}, '${escapeSQL(q.explanation)}', '${escapeSQL(q.type)}');`
      );
      count++;
    }
    console.log("");
  }
}

console.log(`-- Total: ${count} questions seeded`);
