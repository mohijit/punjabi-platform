/**
 * Exercise logic, kept free of React so it can be tested directly and reused
 * by a future React Native app.
 *
 * Two rules shape everything here:
 *
 * 1. **Answer checking is forgiving about typing, strict about Punjabi.**
 *    Stray spaces, a missing full stop and Unicode normalisation differences
 *    are the learner's keyboard, not their understanding. A wrong vowel sign
 *    or a missing addak is a different word, and is marked wrong.
 *
 * 2. **Option order is derived, never random.** `Math.random()` would give the
 *    server and the client different orders and break hydration, and would
 *    also reshuffle on every re-render. The order is hashed from the exercise
 *    itself, so it is stable but not the order the content author wrote.
 */

import { hasRecording } from "@/lib/audio";
import type { Exercise } from "@/content/schema";

/** What the learner submitted. Build exercises answer with an ordered list. */
export type Answer = string | string[];

export interface Result {
  correct: boolean;
  /** Shown after answering, right or wrong. */
  correctAnswer: string;
  /** The content author's note on why, when there is one. */
  explain?: string;
}

/**
 * Normalises typed Punjabi for comparison: NFC so composed and decomposed
 * spellings match, collapsed whitespace, and no trailing danda — none of which
 * change the word. Vowel signs, addak, bindi and tippi are all preserved,
 * because those do.
 */
export function normaliseAnswer(text: string): string {
  return text
    .normalize("NFC")
    .replace(/[।॥.!?]+$/u, "")
    .replace(/\s+/gu, " ")
    .trim()
    .toLowerCase();
}

function matches(given: string, answer: string, accept: string[] = []): boolean {
  const target = normaliseAnswer(given);
  return [answer, ...accept].some((candidate) => normaliseAnswer(candidate) === target);
}

/** The expected answer as a single display string. */
export function correctAnswerOf(exercise: Exercise): string {
  switch (exercise.type) {
    case "build":
      return exercise.answerTokens.join(" ");
    case "read-aloud":
      return exercise.text;
    default:
      return exercise.answer;
  }
}

export function checkAnswer(exercise: Exercise, given: Answer): Result {
  const correctAnswer = correctAnswerOf(exercise);

  switch (exercise.type) {
    case "choice":
    case "listening":
    case "blank":
      return {
        correct: typeof given === "string" && matches(given, exercise.answer),
        correctAnswer,
        explain: exercise.explain,
      };

    case "build": {
      const tokens = Array.isArray(given) ? given : [given];
      return {
        correct: matches(tokens.join(" "), exercise.answerTokens.join(" ")),
        correctAnswer,
        explain: exercise.explain,
      };
    }

    case "typing":
    case "translate":
      return {
        correct: typeof given === "string" && matches(given, exercise.answer, exercise.accept),
        correctAnswer,
        explain: exercise.explain,
      };

    case "read-aloud":
      // Self-marked: the learner says whether they managed it. Speech
      // recognition is Phase 4, and pretending to grade it now would be worse
      // than asking honestly.
      return { correct: given === "yes", correctAnswer };
  }
}

/* ------------------------------ option order ----------------------------- */

/** FNV-1a. Small, stable, and enough to order a handful of options. */
function hash(text: string): number {
  let value = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 0x01000193) >>> 0;
  }
  return value;
}

/**
 * A stable shuffle. The same items and seed always give the same order, so the
 * server render, the client render and every re-render agree.
 */
export function stableShuffle<T>(items: T[], seed: string): T[] {
  return items
    .map((item, index) => ({ item, key: hash(seed + "\u0000" + index + "\u0000" + String(item)) }))
    .sort((a, b) => a.key - b.key)
    .map((entry) => entry.item);
}

/** The options for an exercise, in a stable presentation order. */
export function optionsOf(exercise: Exercise): string[] {
  switch (exercise.type) {
    case "choice":
    case "listening":
    case "blank":
      return stableShuffle(exercise.options, exercise.prompt + correctAnswerOf(exercise));
    case "build":
      return stableShuffle(
        [...exercise.answerTokens, ...exercise.distractors],
        exercise.prompt + exercise.english,
      );
    default:
      return [];
  }
}

/** True for exercises whose answer is a single tap, so they submit instantly. */
export function isInstant(exercise: Exercise): boolean {
  return exercise.type === "choice" || exercise.type === "listening" || exercise.type === "blank";
}

/** Exercises that count towards the listening accuracy figure on /progress. */
export function isListening(exercise: Exercise): boolean {
  return exercise.type === "listening";
}

/**
 * Read-aloud is practice, not assessment: it is never counted in a lesson's
 * accuracy, because self-marking would make the number meaningless.
 */
export function isScored(exercise: Exercise): boolean {
  return exercise.type !== "read-aloud";
}

/**
 * True when this exercise can actually be answered on the device in front of
 * the learner.
 *
 * Only listening fails this, and only while its recording is missing. Asking
 * someone which word they heard, in silence, is not a question — so the lesson
 * player drops these rather than showing them.
 */
export function isPlayable(exercise: Exercise): boolean {
  return exercise.type !== "listening" || hasRecording(exercise.audio);
}
