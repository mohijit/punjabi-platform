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
  {
    id: "what-is-this",
    gurmukhi: "ਇਹ ਕੀ ਹੈ?",
    roman: "ih kī hai?",
    literal: "this what is?",
    english: "What is this?",
    difficulty: 1,
    tokens: [
      { gurmukhi: "ਇਹ", roman: "ih", gloss: "this", role: "what is being asked about" },
      { gurmukhi: "ਕੀ", roman: "kī", gloss: "what", role: "the question word, standing where the answer will go" },
      { gurmukhi: "ਹੈ", roman: "hai", gloss: "is", role: "the verb, at the end as always" },
    ],
    note: "The question word does not move to the front. Swap ਕੀ for an answer and the reply is already built: ਇਹ ਕਿਤਾਬ ਹੈ।",
  },
  {
    id: "who-is-that",
    gurmukhi: "ਉਹ ਕੌਣ ਹੈ?",
    roman: "uh kauṇ hai?",
    literal: "that who is?",
    english: "Who is that?",
    difficulty: 1,
    tokens: [
      { gurmukhi: "ਉਹ", roman: "uh", gloss: "that, he, she", role: "the person being asked about" },
      { gurmukhi: "ਕੌਣ", roman: "kauṇ", gloss: "who", role: "the question word" },
      { gurmukhi: "ਹੈ", roman: "hai", gloss: "is", role: "the verb" },
    ],
    note: "ਉਹ covers he, she and that. Punjabi does not choose a gender here, so the same question works for anyone.",
  },
  {
    id: "this-is-my-house",
    gurmukhi: "ਇਹ ਮੇਰਾ ਘਰ ਹੈ।",
    roman: "ih merā ghar hai.",
    literal: "this my house is.",
    english: "This is my house.",
    difficulty: 1,
    tokens: [
      { gurmukhi: "ਇਹ", roman: "ih", gloss: "this", role: "what the sentence is about" },
      { gurmukhi: "ਮੇਰਾ", roman: "merā", gloss: "my", role: "matches ਘਰ, which is masculine" },
      { gurmukhi: "ਘਰ", roman: "ghar", gloss: "house", role: "what it is" },
      { gurmukhi: "ਹੈ", roman: "hai", gloss: "is", role: "the verb, in the form that goes with ਇਹ" },
    ],
    note: "Say it about a sister and ਮੇਰਾ becomes ਮੇਰੀ: ਇਹ ਮੇਰੀ ਭੈਣ ਹੈ। The word for my follows the thing owned, never the owner.",
  },
  {
    id: "what-is-your-name",
    gurmukhi: "ਤੁਹਾਡਾ ਨਾਂ ਕੀ ਹੈ?",
    roman: "tuhāḍā nā̃ kī hai?",
    literal: "your name what is?",
    english: "What is your name?",
    difficulty: 1,
    tokens: [
      { gurmukhi: "ਤੁਹਾਡਾ", roman: "tuhāḍā", gloss: "your", role: "polite your, matching ਤੁਸੀਂ" },
      { gurmukhi: "ਨਾਂ", roman: "nā̃", gloss: "name", role: "what is being asked about" },
      { gurmukhi: "ਕੀ", roman: "kī", gloss: "what", role: "the question word" },
      { gurmukhi: "ਹੈ", roman: "hai", gloss: "is", role: "the verb" },
    ],
    note: "Answer it with ਮੇਰਾ ਨਾਂ … ਹੈ। — my name … is. The shape of the question is the shape of the answer.",
  },
  {
    id: "where-do-you-live",
    gurmukhi: "ਤੁਸੀਂ ਕਿੱਥੇ ਰਹਿੰਦੇ ਹੋ?",
    roman: "tusī̃ kitthe rahinde ho?",
    literal: "you where living are?",
    english: "Where do you live?",
    difficulty: 2,
    tokens: [
      { gurmukhi: "ਤੁਸੀਂ", roman: "tusī̃", gloss: "you", role: "who is being asked" },
      { gurmukhi: "ਕਿੱਥੇ", roman: "kitthe", gloss: "where", role: "the question word" },
      { gurmukhi: "ਰਹਿੰਦੇ", roman: "rahinde", gloss: "living", role: "the verb ਰਹਿਣਾ, in its habitual form" },
      { gurmukhi: "ਹੋ", roman: "ho", gloss: "are", role: "the helper, matching ਤੁਸੀਂ" },
    ],
    note: "Punjabi says this in two pieces — living + are — where English says do you live. Both pieces stay at the end.",
  },
  {
    id: "i-live-in-the-city",
    gurmukhi: "ਮੈਂ ਸ਼ਹਿਰ ਵਿੱਚ ਰਹਿੰਦਾ ਹਾਂ।",
    roman: "maĩ śahir vicc rahindā hā̃.",
    literal: "I city in living am.",
    english: "I live in the city.",
    difficulty: 2,
    tokens: [
      { gurmukhi: "ਮੈਂ", roman: "maĩ", gloss: "I", role: "who the sentence is about" },
      { gurmukhi: "ਸ਼ਹਿਰ", roman: "śahir", gloss: "city", role: "where" },
      { gurmukhi: "ਵਿੱਚ", roman: "vicc", gloss: "in", role: "comes after the place, not before it" },
      { gurmukhi: "ਰਹਿੰਦਾ", roman: "rahindā", gloss: "living", role: "the verb, in the form a man uses about himself" },
      { gurmukhi: "ਹਾਂ", roman: "hā̃", gloss: "am", role: "the helper, matching ਮੈਂ" },
    ],
    note: "ਵਿੱਚ sits after the word it belongs to, which is why Punjabi is described as having postpositions rather than prepositions. A woman would say ਰਹਿੰਦੀ ਹਾਂ.",
  },
  {
    id: "i-need-water",
    gurmukhi: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    roman: "mainū̃ pāṇī cāhīdā hai.",
    literal: "to-me water needed is.",
    english: "I need water.",
    difficulty: 2,
    tokens: [
      { gurmukhi: "ਮੈਨੂੰ", roman: "mainū̃", gloss: "to me", role: "the person who needs, marked as the receiver" },
      { gurmukhi: "ਪਾਣੀ", roman: "pāṇī", gloss: "water", role: "what is needed — and what the verb agrees with" },
      { gurmukhi: "ਚਾਹੀਦਾ", roman: "cāhīdā", gloss: "needed", role: "matches ਪਾਣੀ, which is masculine" },
      { gurmukhi: "ਹੈ", roman: "hai", gloss: "is", role: "the verb" },
    ],
    note: "There is no I in this sentence. Punjabi says water is needed to me, and the verb agrees with the water — so asking for tea gives ਮੈਨੂੰ ਚਾਹ ਚਾਹੀਦੀ ਹੈ।",
  },
  {
    id: "the-food-is-ready",
    gurmukhi: "ਖਾਣਾ ਤਿਆਰ ਹੈ।",
    roman: "khāṇā tiār hai.",
    literal: "food ready is.",
    english: "The food is ready.",
    difficulty: 1,
    tokens: [
      { gurmukhi: "ਖਾਣਾ", roman: "khāṇā", gloss: "food", role: "what the sentence is about" },
      { gurmukhi: "ਤਿਆਰ", roman: "tiār", gloss: "ready", role: "what is being said about it" },
      { gurmukhi: "ਹੈ", roman: "hai", gloss: "is", role: "the verb" },
    ],
    note: "Punjabi has no the and no a. ਖਾਣਾ on its own is food, the food or the meal, whichever the moment calls for.",
  },
  {
    id: "the-child-drinks-milk",
    gurmukhi: "ਬੱਚਾ ਦੁੱਧ ਪੀਂਦਾ ਹੈ।",
    roman: "baccā duddh pīndā hai.",
    literal: "child milk drinking is.",
    english: "The child drinks milk.",
    difficulty: 2,
    tokens: [
      { gurmukhi: "ਬੱਚਾ", roman: "baccā", gloss: "child", role: "who does it" },
      { gurmukhi: "ਦੁੱਧ", roman: "duddh", gloss: "milk", role: "what is drunk — and it comes before the verb" },
      { gurmukhi: "ਪੀਂਦਾ", roman: "pīndā", gloss: "drinking", role: "the verb ਪੀਣਾ, agreeing with ਬੱਚਾ" },
      { gurmukhi: "ਹੈ", roman: "hai", gloss: "is", role: "the helper" },
    ],
    note: "Subject, then object, then verb. English puts the verb in the middle; Punjabi puts it last, every time.",
  },
  {
    id: "i-have-two-brothers",
    gurmukhi: "ਮੇਰੇ ਦੋ ਭਰਾ ਹਨ।",
    roman: "mere do bharā han.",
    literal: "my two brothers are.",
    english: "I have two brothers.",
    difficulty: 2,
    tokens: [
      { gurmukhi: "ਮੇਰੇ", roman: "mere", gloss: "my", role: "ਮੇਰਾ, changed for more than one" },
      { gurmukhi: "ਦੋ", roman: "do", gloss: "two", role: "how many" },
      { gurmukhi: "ਭਰਾ", roman: "bharā", gloss: "brothers", role: "what there are" },
      { gurmukhi: "ਹਨ", roman: "han", gloss: "are", role: "the verb, in its plural form" },
    ],
    note: "Punjabi has no verb for to have. It says my two brothers are, and lets the ਮੇਰੇ carry the having.",
  },
  {
    id: "i-am-learning-punjabi",
    gurmukhi: "ਮੈਂ ਪੰਜਾਬੀ ਸਿੱਖ ਰਿਹਾ ਹਾਂ।",
    roman: "maĩ pañjābī sikkh rihā hā̃.",
    literal: "I Punjabi learn -ing am.",
    english: "I am learning Punjabi.",
    difficulty: 2,
    tokens: [
      { gurmukhi: "ਮੈਂ", roman: "maĩ", gloss: "I", role: "who the sentence is about" },
      { gurmukhi: "ਪੰਜਾਬੀ", roman: "pañjābī", gloss: "Punjabi", role: "what is being learned" },
      { gurmukhi: "ਸਿੱਖ", roman: "sikkh", gloss: "learn", role: "the bare verb, carrying the meaning" },
      { gurmukhi: "ਰਿਹਾ", roman: "rihā", gloss: "-ing", role: "makes it right now rather than in general" },
      { gurmukhi: "ਹਾਂ", roman: "hā̃", gloss: "am", role: "the helper, matching ਮੈਂ" },
    ],
    note: "The sentence this course is aiming at. Three words do what English does with am learning: the verb, the ਰਿਹਾ that makes it ongoing, and the ਹਾਂ that ties it to ਮੈਂ. A woman says ਸਿੱਖ ਰਹੀ ਹਾਂ।",
  },
];

export const sentences: Sentence[] = parseAll(sentenceSchema, raw, "sentence");

export const sentencesById = new Map(sentences.map((sentence) => [sentence.id, sentence]));

export function getSentence(id: string): Sentence | undefined {
  return sentencesById.get(id);
}
