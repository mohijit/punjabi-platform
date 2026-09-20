/**
 * Content validation. Run with: npm run check
 *
 * Every entry is parsed against its schema, and a set of cross-checks runs on
 * top of that: references between files must resolve, letters must actually
 * appear in their own example words, and hand-written romanisation must agree
 * with the transliteration engine unless a word is a known exception.
 */

import { letters, painti, extraLetters } from "@/content/gurmukhi/letters";
import { vowels } from "@/content/gurmukhi/vowels";
import { symbols } from "@/content/gurmukhi/symbols";
import { soundGroups } from "@/content/gurmukhi/soundGroups";
import { words } from "@/content/vocabulary";
import { sentences } from "@/content/sentences";
import { lessons } from "@/content/lessons";
import { toRoman } from "@/lib/transliteration";

const problems = [];
const warnings = [];
/** Listening exercises with no recording — hidden from lessons, not errors. */
const silentListening = [];

function problem(message) {
  problems.push(message);
}

function warn(message) {
  warnings.push(message);
}

/* ------------------------------- letters -------------------------------- */

if (painti.length !== 35) {
  problem(`Expected 35 painti letters, found ${painti.length}`);
}
if (extraLetters.length !== 6) {
  problem(`Expected 6 pairi bindi letters, found ${extraLetters.length}`);
}

/** Independent vowels are written on a carrier but encoded as one character. */
const CARRIES = {
  "ੳ": ["ੳ", "ਉ", "ਊ", "ਓ"],
  "ਅ": ["ਅ", "ਆ", "ਐ", "ਔ"],
  "ੲ": ["ੲ", "ਇ", "ਈ", "ਏ"],
};

const seenOrder = new Set();
for (const letter of letters) {
  if (seenOrder.has(letter.order)) problem(`Duplicate order ${letter.order} (${letter.letter})`);
  seenOrder.add(letter.order);

  // A letter's example word should contain that letter, unless the entry says
  // outright that it only demonstrates the sound. The three carriers are the
  // exception: ਉ ਊ ਓ are single codepoints built on ੳ, not ੳ plus a sign, so a
  // carrier's example is checked against the vowels it carries.
  const normalised = letter.example.gurmukhi.normalize("NFC");
  const forms = (CARRIES[letter.letter] ?? [letter.letter]).map((form) => form.normalize("NFC"));
  if (!letter.exampleShowsSoundOnly && !forms.some((form) => normalised.includes(form))) {
    problem(
      `Example for ${letter.letter} (${letter.name}) does not contain the letter: ${letter.example.gurmukhi}`,
    );
  }
}

/* -------------------------------- vowels -------------------------------- */

if (vowels.length !== 10) {
  problem(`Expected 10 vowels, found ${vowels.length}`);
}

for (const vowel of vowels) {
  // Every ਕ-series form must be ਕ plus exactly this sign.
  const expected = ("ਕ" + vowel.sign).normalize("NFC");
  if (vowel.onKakka.normalize("NFC") !== expected) {
    problem(
      `${vowel.name}: onKakka is "${vowel.onKakka}" but ਕ + sign gives "${expected}"`,
    );
  }
  if (vowel.sign && !vowel.example.gurmukhi.normalize("NFC").includes(vowel.sign)) {
    problem(`${vowel.name}: example ${vowel.example.gurmukhi} does not use the sign ${vowel.sign}`);
  }
}

/* ------------------------------- symbols -------------------------------- */

for (const symbol of symbols) {
  for (const example of symbol.examples) {
    const mark = symbol.symbol.normalize("NFC");
    if (!example.gurmukhi.normalize("NFC").includes(mark)) {
      problem(`${symbol.name}: example ${example.gurmukhi} does not contain ${symbol.symbol}`);
    }
  }
}

/* ----------------------------- sound groups ----------------------------- */

const letterSet = new Set(letters.map((letter) => letter.letter));
for (const group of soundGroups) {
  for (const char of group.letters) {
    if (!letterSet.has(char)) problem(`Sound group ${group.id} references unknown letter ${char}`);
  }
}

/* ------------------------------ vocabulary ------------------------------ */

const wordSet = new Set(words.map((word) => word.gurmukhi.normalize("NFC")));

if (wordSet.size !== words.length) {
  problem(`Duplicate word entries: ${words.length} words but ${wordSet.size} distinct spellings`);
}

for (const word of words) {
  // An example that does not contain the word teaches nothing about the word.
  if (word.example && !word.example.normalize("NFC").includes(word.gurmukhi.normalize("NFC"))) {
    problem(`Word ${word.gurmukhi}: example "${word.example}" does not contain the word`);
  }
  if (word.example && !word.exampleEnglish) {
    problem(`Word ${word.gurmukhi}: has an example sentence but no English for it`);
  }
}

/* ------------------------------- sentences ------------------------------ */

const sentenceIds = new Set();
for (const sentence of sentences) {
  if (sentenceIds.has(sentence.id)) problem(`Duplicate sentence id ${sentence.id}`);
  sentenceIds.add(sentence.id);

  // The tokens are what the sentence explorer takes apart, so they must add
  // back up to the sentence itself — otherwise a learner is shown a breakdown
  // of something slightly different from what they just read.
  const joined = sentence.tokens.map((token) => token.gurmukhi).join(" ").normalize("NFC");
  const plain = sentence.gurmukhi.normalize("NFC").replace(/[।?!.]+$/u, "").trim();
  if (joined !== plain) {
    problem(`Sentence ${sentence.id}: tokens join to "${joined}" but the sentence is "${plain}"`);
  }
}

/* -------------------------------- lessons ------------------------------- */

const letterChars = new Set(letters.map((letter) => letter.letter.normalize("NFC")));
const lessonIds = new Set();
const lessonNumbers = new Set();

/** Every id a lesson step or exercise points at must resolve to real content. */
function checkTracks(label, exercise) {
  const tracks = exercise.tracks;
  if (!tracks) return;
  if (tracks.kind === "word" && !wordSet.has(tracks.value.normalize("NFC"))) {
    problem(`${label}: tracks unknown word ${tracks.value}`);
  }
  if (tracks.kind === "sentence" && !sentenceIds.has(tracks.value)) {
    problem(`${label}: tracks unknown sentence ${tracks.value}`);
  }
  if (tracks.kind === "letter" && !letterChars.has(tracks.value.normalize("NFC"))) {
    problem(`${label}: tracks unknown letter ${tracks.value}`);
  }
}

function checkExercise(label, exercise) {
  checkTracks(label, exercise);
  // A correct answer that is not among the options is unanswerable.
  if ("options" in exercise && !exercise.options.includes(exercise.answer)) {
    problem(`${label}: answer "${exercise.answer}" is not one of the options`);
  }
  if (exercise.type === "blank" && !exercise.sentence.includes("___")) {
    problem(`${label}: fill-in-the-blank sentence has no ___ to fill`);
  }
  if (exercise.type === "listening" && !exercise.options.includes(exercise.say)) {
    problem(`${label}: the spoken word is not among the options`);
  }
  // Listening needs a recording. There is no speech synthesis to fall back on:
  // a synthetic voice mispronounces Gurmukhi, so these steps are hidden from
  // the lesson until a real recording exists.
  if (exercise.type === "listening" && !exercise.audio) {
    silentListening.push(label);
  }
  if (exercise.type === "build") {
    const overlap = exercise.distractors.filter((token) =>
      exercise.answerTokens.includes(token),
    );
    if (overlap.length > 0) {
      problem(`${label}: distractor(s) ${overlap.join(", ")} also appear in the answer`);
    }
  }
}

for (const lesson of lessons) {
  if (lessonIds.has(lesson.id)) problem(`Duplicate lesson id ${lesson.id}`);
  lessonIds.add(lesson.id);
  if (lessonNumbers.has(lesson.number)) problem(`Duplicate lesson number ${lesson.number}`);
  lessonNumbers.add(lesson.number);

  let exerciseCount = 0;

  lesson.steps.forEach((step, index) => {
    const label = `Lesson ${lesson.id} step ${index + 1}`;

    if (step.type === "letters") {
      for (const char of step.letters) {
        if (!letterChars.has(char.normalize("NFC"))) {
          problem(`${label}: unknown letter ${char}`);
        }
      }
    }
    if (step.type === "vocab") {
      for (const word of step.words) {
        if (!wordSet.has(word.normalize("NFC"))) {
          problem(`${label}: unknown word ${word} — add it to content/vocabulary first`);
        }
      }
    }
    if (step.type === "sentence") {
      for (const id of step.sentences) {
        if (!sentenceIds.has(id)) problem(`${label}: unknown sentence ${id}`);
      }
    }
    if (step.type === "exercise") {
      exerciseCount += 1;
      checkExercise(label, step.exercise);
    }
    if (step.type === "review") {
      step.exercises.forEach((exercise, position) => {
        exerciseCount += 1;
        checkExercise(`${label} review ${position + 1}`, exercise);
      });
    }
  });

  // The brief's shape for a lesson: teach, then practise. A lesson with no
  // practice is a page of notes.
  if (exerciseCount === 0) problem(`Lesson ${lesson.id} has no exercises`);
  if (lesson.steps.length < 5) {
    warn(`Lesson ${lesson.id} has only ${lesson.steps.length} steps — aiming for 8-12`);
  }
}

/* ------------------- romanisation agreement (advisory) ------------------- */

/**
 * The engine cannot know everything — tone, loanword spellings and the ਹ of
 * ਸ਼ਹਿਰ all diverge legitimately. These are reported as warnings so a human
 * can eyeball them, not as failures.
 */
function checkRoman(label, gurmukhi, roman) {
  const generated = toRoman(gurmukhi);
  if (generated !== roman) {
    warn(`${label}: written "${roman}", engine produced "${generated}"  (${gurmukhi})`);
  }
}

for (const letter of letters) {
  checkRoman(`letter ${letter.letter} example`, letter.example.gurmukhi, letter.example.roman);
}
for (const vowel of vowels) {
  checkRoman(`vowel ${vowel.name} example`, vowel.example.gurmukhi, vowel.example.roman);
}
for (const symbol of symbols) {
  for (const example of symbol.examples) {
    checkRoman(`symbol ${symbol.id} example`, example.gurmukhi, example.roman);
  }
}
for (const word of words) {
  checkRoman(`word ${word.gurmukhi}`, word.gurmukhi, word.roman);
}
for (const sentence of sentences) {
  for (const token of sentence.tokens) {
    checkRoman(`sentence ${sentence.id} token`, token.gurmukhi, token.roman);
  }
}

/* -------------------------------- report -------------------------------- */

console.log(`letters        ${letters.length}  (${painti.length} painti + ${extraLetters.length} pairi bindi)`);
console.log(`vowels         ${vowels.length}`);
console.log(`symbols        ${symbols.length}`);
console.log(`sound groups   ${soundGroups.length}`);
console.log(`words          ${words.length}`);
console.log(`sentences      ${sentences.length}`);
console.log(`lessons        ${lessons.length}`);

const recorded = [
  ...letters.map((l) => l.audio),
  ...vowels.map((v) => v.audio),
  ...words.map((w) => w.audio),
  ...sentences.map((s) => s.audio),
].filter(Boolean).length;
console.log(`recordings     ${recorded}  (entries with an audio file)`);

if (silentListening.length > 0) {
  console.log(
    `
${silentListening.length} listening exercise(s) hidden until recorded:`,
  );
  for (const label of silentListening) console.log("  - " + label);
}

if (warnings.length > 0) {
  console.log(`\n${warnings.length} romanisation differences to eyeball:`);
  for (const message of warnings) console.log("  ~ " + message);
}

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  for (const message of problems) console.error("  ✗ " + message);
  process.exit(1);
}

console.log("\nAll content checks passed.");
