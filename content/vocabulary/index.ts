import type { Word, WordCategory } from "@/content/schema";
import { greetings } from "./greetings";

/**
 * The vocabulary registry. One file per category, gathered here.
 *
 * This is the seed set. It grows in Milestone 4 and again in Phase 2 — but it
 * grows by adding checked entries, never by generating them, because a word
 * with the wrong gender or a missing vowel sign teaches a learner something
 * they then have to unlearn.
 */

export const words: Word[] = [...greetings];

export const wordsByGurmukhi = new Map(words.map((word) => [word.gurmukhi, word]));

export function getWord(gurmukhi: string): Word | undefined {
  return wordsByGurmukhi.get(gurmukhi);
}

export function wordsIn(category: WordCategory): Word[] {
  return words.filter((word) => word.category === category);
}

/** The categories that actually have words in them, for the vocabulary grid. */
export function populatedCategories(): WordCategory[] {
  return [...new Set(words.map((word) => word.category))];
}
