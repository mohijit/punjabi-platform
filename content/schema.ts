import { z } from "zod";

/**
 * Every piece of Punjabi in this app is validated against these schemas at
 * import time. A typo in a content file becomes a loud failure rather than a
 * quietly wrong lesson, which is the whole point: the content is the product.
 */

/** Text that must actually contain Gurmukhi characters. */
const gurmukhiText = z
  .string()
  .min(1)
  .refine((value) => /[਀-੿]/.test(value), {
    message: "Expected Gurmukhi text",
  });

/** Roman transliteration, hand-checked. Must not contain Gurmukhi. */
const romanText = z
  .string()
  .min(1)
  .refine((value) => !/[਀-੿]/.test(value), {
    message: "Roman transliteration must not contain Gurmukhi characters",
  });

export const exampleSchema = z.object({
  gurmukhi: gurmukhiText,
  roman: romanText,
  english: z.string().min(1),
  audio: z.string().default(""),
});
export type Example = z.infer<typeof exampleSchema>;

export const letterGroupSchema = z.enum([
  "carriers",
  "fricatives",
  "velars",
  "palatals",
  "retroflexes",
  "dentals",
  "labials",
  "sonorants",
  "extra",
]);
export type LetterGroup = z.infer<typeof letterGroupSchema>;

export const letterSchema = z.object({
  /** The character itself, which is also its stable id. */
  letter: gurmukhiText,
  /** Traditional name, e.g. kakkā. */
  name: romanText,
  nameGurmukhi: gurmukhiText,
  /** Plain-English approximate sound, e.g. "k as in skin". */
  sound: z.string().min(1),
  ipa: z.string().min(1),
  group: letterGroupSchema,
  /** Position in the traditional order. */
  order: z.number().int().nonnegative(),
  example: exampleSchema,
  /**
   * Written stroke order, in plain language. SVG stroke paths can be added to
   * `strokes` later without changing anything that reads this.
   */
  strokeGuide: z.string().min(1),
  strokes: z.array(z.string()).default([]),
  audio: z.string().default(""),
  /** Anything a learner genuinely needs to know: tone, rarity, position. */
  note: z.string().optional(),
  /** Rare letters are taught for recognition only, never drilled for production. */
  rare: z.boolean().default(false),
  /**
   * True when the example word demonstrates the letter's *sound* but is not
   * actually spelled with it. ਙ and ਞ need this: their sounds are everywhere,
   * the letters themselves almost never are.
   */
  exampleShowsSoundOnly: z.boolean().default(false),
  /** Some letters never begin a word: ਙ ਞ ਣ ੜ. */
  neverInitial: z.boolean().default(false),
});
export type Letter = z.infer<typeof letterSchema>;

export const vowelSchema = z.object({
  /** The dependent sign on its own, or "" for mukta, which has no sign. */
  sign: z.string(),
  name: romanText,
  nameGurmukhi: gurmukhiText,
  /** The sign shown on ਕ, e.g. ਕਾ. */
  onKakka: gurmukhiText,
  onKakkaRoman: romanText,
  /** The independent form, e.g. ਆ. */
  independent: gurmukhiText,
  independentRoman: romanText,
  sound: z.string().min(1),
  ipa: z.string().min(1),
  /** Where the mark sits relative to the consonant. */
  position: z.enum(["none", "after", "before", "above", "below"]),
  order: z.number().int().nonnegative(),
  example: exampleSchema,
  note: z.string().optional(),
  audio: z.string().default(""),
});
export type Vowel = z.infer<typeof vowelSchema>;

export const symbolSchema = z.object({
  id: z.string().min(1),
  symbol: z.string().min(1),
  name: romanText,
  nameGurmukhi: gurmukhiText,
  /** What the mark does, in plain language. */
  does: z.string().min(1),
  explanation: z.string().min(1),
  examples: z.array(exampleSchema).min(1),
  order: z.number().int().nonnegative(),
});
export type GurmukhiSymbol = z.infer<typeof symbolSchema>;

/**
 * One idea about how the script works, before any letter is taught.
 *
 * These are the things that are obvious to anyone who reads Gurmukhi and
 * invisible to everyone who does not: that a bare consonant already carries a
 * vowel, that sihari is written before the letter it follows, that the line
 * along the top is what makes a word a word. Each one is a heading, a couple of
 * sentences and a demonstration made of real Punjabi.
 */
export const scriptNoteSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** The idea in one sentence, shown before the explanation. */
  summary: z.string().min(1),
  body: z.array(z.string().min(1)).min(1),
  /** Gurmukhi the point can be seen in, each piece captioned. */
  demo: z
    .array(
      z.object({
        gurmukhi: gurmukhiText,
        roman: romanText,
        caption: z.string().min(1),
      }),
    )
    .default([]),
  order: z.number().int().nonnegative(),
});
export type ScriptNote = z.infer<typeof scriptNoteSchema>;

/** A set of letters that learners confuse, taught and drilled together. */
export const soundGroupSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** Why these sounds are grouped, and how to tell them apart. */
  explanation: z.string().min(1),
  mouthHint: z.string().min(1),
  letters: z.array(gurmukhiText).min(2),
  order: z.number().int().nonnegative(),
});
export type SoundGroup = z.infer<typeof soundGroupSchema>;

export const wordCategorySchema = z.enum([
  "greetings",
  "family",
  "numbers",
  "colours",
  "food_drink",
  "home",
  "school",
  "work",
  "body",
  "clothing",
  "weather",
  "emotions",
  "transport",
  "travel",
  "shopping",
  "health",
  "sport",
  "culture",
  "verbs",
  "adjectives",
  "question_words",
  "expressions",
  "places",
  "time",
  "pronouns",
  "technology",
]);
export type WordCategory = z.infer<typeof wordCategorySchema>;

export const partOfSpeechSchema = z.enum([
  "noun",
  "verb",
  "adjective",
  "adverb",
  "pronoun",
  "postposition",
  "number",
  "question",
  "phrase",
  "conjunction",
]);

export const wordSchema = z.object({
  gurmukhi: gurmukhiText,
  roman: romanText,
  english: z.string().min(1),
  category: wordCategorySchema,
  partOfSpeech: partOfSpeechSchema,
  /** 1 beginner, 2 intermediate, 3 advanced. */
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  /** Punjabi nouns and adjectives carry gender; learners need it to agree. */
  gender: z.enum(["m", "f"]).optional(),
  audio: z.string().default(""),
  example: gurmukhiText,
  exampleRoman: romanText,
  exampleEnglish: z.string().min(1),
  note: z.string().optional(),
  /** Set when an entry still needs a native-speaker check. */
  needsReview: z.boolean().default(false),
});
export type Word = z.infer<typeof wordSchema>;

/** One word inside a sentence, for the sentence explorer. */
export const tokenSchema = z.object({
  gurmukhi: z.string().min(1),
  roman: z.string().min(1),
  /** Literal meaning of this word on its own. */
  gloss: z.string().min(1),
  /** What the word is doing grammatically, in plain language. */
  role: z.string().optional(),
});
export type Token = z.infer<typeof tokenSchema>;

export const sentenceSchema = z.object({
  id: z.string().min(1),
  gurmukhi: gurmukhiText,
  roman: romanText,
  /** Word-for-word, in Punjabi order, to expose the structure. */
  literal: z.string().min(1),
  english: z.string().min(1),
  tokens: z.array(tokenSchema).min(1),
  audio: z.string().default(""),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  note: z.string().optional(),
});
export type Sentence = z.infer<typeof sentenceSchema>;

/* ------------------------------- exercises ------------------------------- */

const itemKindSchema = z.enum(["letter", "vowel", "symbol", "word", "sentence", "grammar"]);

const exerciseBase = z.object({
  /** What this exercise tests, so the answer updates the right progress item. */
  tracks: z
    .object({ kind: itemKindSchema, value: z.string().min(1) })
    .optional(),
  prompt: z.string().min(1),
});

export const exerciseSchema = z.discriminatedUnion("type", [
  exerciseBase.extend({
    type: z.literal("choice"),
    /** Shown large and in Gurmukhi when set. */
    subject: z.string().optional(),
    subjectScript: z.enum(["gurmukhi", "latin"]).default("gurmukhi"),
    options: z.array(z.string().min(1)).min(2),
    answer: z.string().min(1),
    optionScript: z.enum(["gurmukhi", "latin"]).default("latin"),
    explain: z.string().optional(),
  }),
  exerciseBase.extend({
    type: z.literal("listening"),
    /** The Punjabi that is spoken. Never shown before answering. */
    say: gurmukhiText,
    audio: z.string().default(""),
    options: z.array(z.string().min(1)).min(2),
    answer: z.string().min(1),
    optionScript: z.enum(["gurmukhi", "latin"]).default("gurmukhi"),
    explain: z.string().optional(),
  }),
  exerciseBase.extend({
    type: z.literal("build"),
    /** Tiles the learner arranges, in the correct order. */
    answerTokens: z.array(z.string().min(1)).min(2),
    /** Extra wrong tiles, to stop the exercise being a jigsaw. */
    distractors: z.array(z.string().min(1)).default([]),
    english: z.string().min(1),
    explain: z.string().optional(),
  }),
  exerciseBase.extend({
    type: z.literal("blank"),
    /** The sentence with "___" where the answer belongs. */
    sentence: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
    answer: z.string().min(1),
    english: z.string().min(1),
    explain: z.string().optional(),
  }),
  exerciseBase.extend({
    type: z.literal("typing"),
    answer: gurmukhiText,
    /** Alternative spellings that are also accepted. */
    accept: z.array(z.string()).default([]),
    hint: z.string().optional(),
    explain: z.string().optional(),
  }),
  exerciseBase.extend({
    type: z.literal("translate"),
    /** English shown, Punjabi expected. */
    english: z.string().min(1),
    answer: gurmukhiText,
    accept: z.array(z.string()).default([]),
    explain: z.string().optional(),
  }),
  exerciseBase.extend({
    type: z.literal("read-aloud"),
    text: gurmukhiText,
    roman: romanText,
    english: z.string().min(1),
    audio: z.string().default(""),
  }),
]);
export type Exercise = z.infer<typeof exerciseSchema>;

/* -------------------------------- lessons -------------------------------- */

export const lessonStepSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("explain"),
    title: z.string().min(1),
    /** Short paragraphs. Anything longer belongs in the grammar reference. */
    body: z.array(z.string().min(1)).min(1),
    /** Optional large Gurmukhi display for the idea being taught. */
    display: z.string().optional(),
    displayRoman: z.string().optional(),
    displayEnglish: z.string().optional(),
  }),
  z.object({
    type: z.literal("letters"),
    title: z.string().min(1),
    intro: z.string().optional(),
    /** Letters introduced here, by character. */
    letters: z.array(gurmukhiText).min(1),
  }),
  z.object({
    type: z.literal("vocab"),
    title: z.string().min(1),
    intro: z.string().optional(),
    /** Words introduced here, by Gurmukhi spelling. */
    words: z.array(gurmukhiText).min(1),
  }),
  z.object({
    type: z.literal("sentence"),
    title: z.string().min(1),
    intro: z.string().optional(),
    /** Sentence ids explored word by word. */
    sentences: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    type: z.literal("exercise"),
    exercise: exerciseSchema,
  }),
  z.object({
    type: z.literal("review"),
    title: z.string().default("Quick review"),
    exercises: z.array(exerciseSchema).min(1),
  }),
]);
export type LessonStep = z.infer<typeof lessonStepSchema>;

export const lessonSchema = z.object({
  id: z.string().min(1),
  /** Sequential number shown to the learner. */
  number: z.number().int().positive(),
  title: z.string().min(1),
  /** One line describing what the learner will be able to do afterwards. */
  goal: z.string().min(1),
  /** Which half of the course this belongs to; they alternate deliberately. */
  track: z.enum(["gurmukhi", "punjabi"]),
  unit: z.string().min(1),
  minutes: z.number().int().positive(),
  steps: z.array(lessonStepSchema).min(1),
});
export type Lesson = z.infer<typeof lessonSchema>;

/* -------------------------------- grammar -------------------------------- */

export const grammarTopicSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** Examples come first; explanation second. Never open with a table. */
  examples: z.array(sentenceSchema.pick({ gurmukhi: true, roman: true, english: true })).min(1),
  body: z.array(z.string().min(1)).min(1),
  /** Optional reference table, shown after the explanation. */
  table: z
    .object({
      caption: z.string().optional(),
      headers: z.array(z.string()).min(2),
      rows: z.array(z.array(z.string())).min(1),
    })
    .optional(),
  order: z.number().int().nonnegative(),
  level: z.enum(["beginner", "intermediate"]),
});
export type GrammarTopic = z.infer<typeof grammarTopicSchema>;

/**
 * Parses a content collection, failing loudly with the offending entry named.
 */
export function parseAll<T>(schema: z.ZodType<T>, entries: unknown[], label: string): T[] {
  return entries.map((entry, index) => {
    const result = schema.safeParse(entry);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => issue.path.join(".") + ": " + issue.message)
        .join("; ");
      throw new Error("Invalid " + label + " at index " + index + " — " + issues);
    }
    return result.data;
  });
}
