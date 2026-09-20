import { painti } from "./letters";
import { vowels } from "./vowels";
import { words } from "@/content/vocabulary";
import { sentences } from "@/content/sentences";
import { toClusters, toRoman } from "@/lib/transliteration";

/**
 * The reading trainer's content, built from the data the rest of the app
 * already holds rather than written out a second time.
 *
 * The levels climb in one direction only: a single letter, then a letter
 * wearing a vowel sign, then a short word, then a word carrying the marks that
 * make Punjabi spelling interesting, then a whole sentence. Nothing appears at
 * a level until everything it is made of has appeared below it.
 *
 * Levels 1 and 2 ask what this says, so the answer is a reading. Levels 3 to 5
 * ask what it means, because by then reading it is the easy part. That is the
 * point of the section: to carry a learner from decoding shapes to taking
 * meaning off a page without stopping to decode at all.
 *
 * The syllables in level 2 are composed mechanically, a consonant plus a vowel
 * sign romanised by the transliteration engine. They are not words and are not
 * presented as words; they are the drill that makes words readable.
 */

export type ReadingLevelId = "letters" | "syllables" | "words" | "marks" | "sentences";

export type ReadingItemKind = "letter" | "vowel" | "word" | "sentence";

export interface ReadingItem {
  id: string;
  /** Shown large, in Gurmukhi. */
  text: string;
  /** The reading. Available on request, and always shown after answering. */
  roman: string;
  /** How the text breaks up when it is read aloud, chunk by chunk. */
  clusters: string[];
  /** What it means, where it means anything. */
  english?: string;
  /** Whether the options are readings or meanings. */
  asks: "reading" | "meaning";
  options: string[];
  answer: string;
  /** Context shown after answering, for the entries that have some. */
  note?: string;
  /** What answering this updates in progress. */
  tracks: { kind: ReadingItemKind; value: string };
}

export interface ReadingLevel {
  id: ReadingLevelId;
  number: number;
  title: string;
  /** What the learner can do once this level is comfortable. */
  goal: string;
  /** Shown above every item in the level. */
  instruction: string;
  items: ReadingItem[];
}

/**
 * A deterministic shuffle. The right answer must not sit in the same position
 * every time, but the order must also not change on every render, so it is
 * derived from the item's id rather than from Math.random().
 */
function arrange<T>(items: T[], seed: string): T[] {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 100000;
  }
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    hash = (hash * 31 + 17) % 100000;
    const target = hash % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

/** Three wrong answers, drawn from the pool and never equal to the right one. */
function distractors(pool: string[], answer: string, seed: string): string[] {
  const candidates = [...new Set(pool)].filter((entry) => entry !== answer);
  return arrange(candidates, seed).slice(0, 3);
}

function buildItem(
  parts: Omit<ReadingItem, "options" | "clusters"> & { clusters?: string[] },
  pool: string[],
): ReadingItem {
  const clusters = parts.clusters ?? toClusters(parts.text);
  const options = arrange([parts.answer, ...distractors(pool, parts.answer, parts.id)], parts.id);
  return { ...parts, clusters, options };
}

/* ------------------------------ the levels ------------------------------ */

/**
 * Level 1: one letter, no vowel sign, no marks.
 *
 * The three carriers are left out. ੳ and ੲ carry no sound of their own, so
 * "what does this say" has no honest answer for them; they are taught in the
 * vowel section, where they belong, as the stands the independent vowels sit on.
 */
function letterItems(): ReadingItem[] {
  const teachable = painti.filter((letter) => !letter.rare && letter.group !== "carriers");
  const pool = teachable.map((letter) => toRoman(letter.letter));
  return teachable.map((letter) =>
    buildItem(
      {
        id: "read-letter-" + letter.letter,
        text: letter.letter,
        roman: toRoman(letter.letter),
        english: letter.sound,
        asks: "reading",
        answer: toRoman(letter.letter),
        note: letter.note,
        tracks: { kind: "letter", value: letter.letter },
      },
      pool,
    ),
  );
}

/**
 * Level 2: the same ten vowel signs across eight consonants.
 *
 * Eight rather than all thirty-five, because the idea being taught is that the
 * signs behave identically wherever they land, and that lands faster with a
 * handful of familiar letters than with a wall of three hundred tiles.
 */
const SYLLABLE_CONSONANTS = ["ਕ", "ਮ", "ਨ", "ਸ", "ਲ", "ਰ", "ਦ", "ਪ"];

function syllableItems(): ReadingItem[] {
  const items: ReadingItem[] = [];
  for (const consonant of SYLLABLE_CONSONANTS) {
    const forms = vowels.map((vowel) => (consonant + vowel.sign).normalize("NFC"));
    const pool = forms.map((form) => toRoman(form));
    forms.forEach((form, index) => {
      const vowel = vowels[index];
      items.push(
        buildItem(
          {
            id: "read-syllable-" + form,
            text: form,
            roman: toRoman(form),
            asks: "reading",
            answer: toRoman(form),
            note: vowel.sign
              ? "The sign is " + vowel.name + " (" + vowel.nameGurmukhi + "): " + vowel.sound + "."
              : vowel.name + ": no sign at all, which is a vowel in its own right.",
            tracks: { kind: "vowel", value: vowel.name },
          },
          pool,
        ),
      );
    });
  }
  return items;
}

/** The marks that make a word more than its letters. */
const MARKS = ["ੱ", "ਂ", "ੰ", "੍"];

function hasMark(text: string): boolean {
  const normalised = text.normalize("NFC");
  return MARKS.some((mark) => normalised.includes(mark));
}

/** Levels 3 and 4: real words, the plain ones first and the marked ones after. */
function wordItems(kind: "plain" | "marked"): ReadingItem[] {
  const pool = words.map((word) => word.english);
  return words
    .filter((word) => (kind === "marked" ? hasMark(word.gurmukhi) : !hasMark(word.gurmukhi)))
    .map((word) =>
      buildItem(
        {
          id: "read-word-" + word.gurmukhi,
          text: word.gurmukhi,
          roman: word.roman,
          english: word.english,
          asks: "meaning",
          answer: word.english,
          note: word.note,
          tracks: { kind: "word", value: word.gurmukhi },
        },
        pool,
      ),
    );
}

/** Level 5: whole sentences, read for meaning. */
function sentenceItems(): ReadingItem[] {
  const pool = sentences.map((sentence) => sentence.english);
  return sentences.map((sentence) =>
    buildItem(
      {
        id: "read-sentence-" + sentence.id,
        text: sentence.gurmukhi,
        roman: sentence.roman,
        clusters: sentence.tokens.map((token) => token.gurmukhi),
        english: sentence.english,
        asks: "meaning",
        answer: sentence.english,
        note: "Word for word, in Punjabi order: " + sentence.literal,
        tracks: { kind: "sentence", value: sentence.id },
      },
      pool,
    ),
  );
}

export const readingLevels: ReadingLevel[] = [
  {
    id: "letters",
    number: 1,
    title: "Letters",
    goal: "Look at a letter and know its sound without stopping to think.",
    instruction: "What sound does this letter make?",
    items: letterItems(),
  },
  {
    id: "syllables",
    number: 2,
    title: "Letters with vowels",
    goal: "Read any consonant with any vowel sign sitting on it.",
    instruction: "Read it. What does this say?",
    items: syllableItems(),
  },
  {
    id: "words",
    number: 3,
    title: "Simple words",
    goal: "Read a short word straight off, and know what it means.",
    instruction: "Read the word. What does it mean?",
    items: wordItems("plain"),
  },
  {
    id: "marks",
    number: 4,
    title: "Words with marks",
    goal: "Read words carrying adhak, bindi, tippi and the pairī̃ letters.",
    instruction: "Read the word, minding the marks. What does it mean?",
    items: wordItems("marked"),
  },
  {
    id: "sentences",
    number: 5,
    title: "Sentences",
    goal: "Read a whole sentence and take the meaning straight off the page.",
    instruction: "Read the sentence. What does it say?",
    items: sentenceItems(),
  },
];

export function getReadingLevel(id: string): ReadingLevel | undefined {
  return readingLevels.find((level) => level.id === id);
}
