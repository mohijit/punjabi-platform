import { parseAll, sentenceSchema, type Sentence } from "@/content/schema";

/**
 * Sentences, broken into their words.
 *
 * `literal` is the word-for-word reading in Punjabi order, and it is the whole
 * point of this file. A learner who only ever sees "How are you?" next to
 * ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ? never finds out that Punjabi said "you how are" — and so never
 * learns to build a sentence of their own. Every sentence here carries both.
 */

const raw: unknown[] = [
  {
    id: "how-are-you",
    gurmukhi: "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
    roman: "tusī̃ kivẽ ho?",
    literal: "you how are?",
    english: "How are you?",
    difficulty: 1,
    tokens: [
      { gurmukhi: "ਤੁਸੀਂ", roman: "tusī̃", gloss: "you", role: "who the sentence is about" },
      { gurmukhi: "ਕਿਵੇਂ", roman: "kivẽ", gloss: "how", role: "the question word" },
      { gurmukhi: "ਹੋ", roman: "ho", gloss: "are", role: "the verb, in the form that goes with ਤੁਸੀਂ" },
    ],
    note: "Punjabi puts the verb at the end. The question word stays where the answer would go, so nothing moves to the front the way it does in English.",
  },
  {
    id: "i-am-fine",
    gurmukhi: "ਮੈਂ ਠੀਕ ਹਾਂ।",
    roman: "maĩ ṭhīk hā̃.",
    literal: "I fine am.",
    english: "I am fine.",
    difficulty: 1,
    tokens: [
      { gurmukhi: "ਮੈਂ", roman: "maĩ", gloss: "I", role: "who the sentence is about" },
      { gurmukhi: "ਠੀਕ", roman: "ṭhīk", gloss: "fine", role: "what is being said about them" },
      { gurmukhi: "ਹਾਂ", roman: "hā̃", gloss: "am", role: "the verb, in the form that goes with ਮੈਂ" },
    ],
    note: "The verb changes shape with the person: ਹਾਂ with ਮੈਂ, ਹੋ with ਤੁਸੀਂ. This is the pattern the whole language is built on.",
  },
];

export const sentences: Sentence[] = parseAll(sentenceSchema, raw, "sentence");

export const sentencesById = new Map(sentences.map((sentence) => [sentence.id, sentence]));

export function getSentence(id: string): Sentence | undefined {
  return sentencesById.get(id);
}
