/**
 * The content registry.
 *
 * Everything the app knows about Punjabi is re-exported from here, already
 * parsed against the schemas in `./schema`. Each content module validates
 * itself at module load, so an incorrect entry becomes an immediate, loud
 * failure rather than a wrong lesson shown to a learner.
 *
 * Nothing in `content/` may import React. The data is plain TypeScript so a
 * future React Native app can reuse it unchanged.
 */

export * from "./schema";

export {
  letters,
  lettersByChar,
  painti,
  extraLetters,
  getLetter,
} from "./gurmukhi/letters";

export { vowels, vowelsBySign, secondSeries } from "./gurmukhi/vowels";
export { symbols, symbolsById } from "./gurmukhi/symbols";
export { soundGroups } from "./gurmukhi/soundGroups";
export { scriptNotes, getScriptNote } from "./gurmukhi/script";
export {
  readingLevels,
  getReadingLevel,
  type ReadingLevel,
  type ReadingLevelId,
  type ReadingItem,
} from "./gurmukhi/reading";

export {
  words,
  wordsByGurmukhi,
  getWord,
  wordsIn,
  populatedCategories,
} from "./vocabulary";

export { sentences, sentencesById, getSentence } from "./sentences";

export {
  lessons,
  lessonsById,
  getLesson,
  lessonIndex,
  nextLesson,
  recommendedNext,
} from "./lessons";

import { letters, painti, extraLetters } from "./gurmukhi/letters";
import { vowels } from "./gurmukhi/vowels";
import { symbols } from "./gurmukhi/symbols";
import { soundGroups } from "./gurmukhi/soundGroups";
import { scriptNotes } from "./gurmukhi/script";
import { words } from "./vocabulary";
import { sentences } from "./sentences";
import { lessons } from "./lessons";
import { readingLevels } from "./gurmukhi/reading";

/**
 * Counts the UI can show without re-deriving them, and which double as a
 * cheap sanity check: if a content file ever fails to load, these go to zero
 * and the Gurmukhi overview says so instead of rendering an empty grid.
 */
export const contentCounts = {
  letters: letters.length,
  painti: painti.length,
  extraLetters: extraLetters.length,
  vowels: vowels.length,
  symbols: symbols.length,
  soundGroups: soundGroups.length,
  scriptNotes: scriptNotes.length,
  words: words.length,
  sentences: sentences.length,
  lessons: lessons.length,
  readingLevels: readingLevels.length,
  readingItems: readingLevels.reduce((total, level) => total + level.items.length, 0),
} as const;

/**
 * Letters grouped the way they are taught: the traditional rows, never a
 * single wall of 41 cells. `group` comes from the letter data itself.
 */
export function lettersByGroup() {
  const groups = new Map<string, typeof letters>();
  for (const letter of letters) {
    const existing = groups.get(letter.group);
    if (existing) existing.push(letter);
    else groups.set(letter.group, [letter]);
  }
  return [...groups.entries()].map(([group, items]) => ({ group, letters: items }));
}
