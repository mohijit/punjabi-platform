import { parseAll, wordSchema, type Word } from "@/content/schema";

/**
 * Question words.
 *
 * They nearly all begin with ਕ, which is worth pointing out early — spotting
 * that ਕ at the start of a word is often the fastest way to know you are being
 * asked something.
 *
 * The other half of the rule is where they go. English moves the question word
 * to the front: "where do you live?" Punjabi leaves it exactly where the answer
 * would stand, and the verb stays at the end: ਤੁਸੀਂ ਕਿੱਥੇ ਰਹਿੰਦੇ ਹੋ? — you where
 * live? Nothing is reordered, which makes questions easier here than in English.
 *
 * ਕਿਵੇਂ (how) is taught in the greetings file, with Lesson 1.
 */

const raw: unknown[] = [
  {
    gurmukhi: "ਕੀ",
    roman: "kī",
    english: "what",
    category: "question_words",
    partOfSpeech: "question",
    difficulty: 1,
    example: "ਇਹ ਕੀ ਹੈ?",
    exampleRoman: "ih kī hai?",
    exampleEnglish: "What is this?",
    note: "Also placed at the front of a sentence to turn it into a yes-or-no question, the way a raised voice does in English.",
  },
  {
    gurmukhi: "ਕੌਣ",
    roman: "kauṇ",
    english: "who",
    category: "question_words",
    partOfSpeech: "question",
    difficulty: 1,
    example: "ਉਹ ਕੌਣ ਹੈ?",
    exampleRoman: "uh kauṇ hai?",
    exampleEnglish: "Who is that?",
  },
  {
    gurmukhi: "ਕਿੱਥੇ",
    roman: "kitthe",
    english: "where",
    category: "question_words",
    partOfSpeech: "question",
    difficulty: 1,
    example: "ਤੁਸੀਂ ਕਿੱਥੇ ਰਹਿੰਦੇ ਹੋ?",
    exampleRoman: "tusī̃ kitthe rahinde ho?",
    exampleEnglish: "Where do you live?",
  },
  {
    gurmukhi: "ਕਦੋਂ",
    roman: "kadõ",
    english: "when",
    category: "question_words",
    partOfSpeech: "question",
    difficulty: 1,
    example: "ਤੁਸੀਂ ਕਦੋਂ ਆਓਗੇ?",
    exampleRoman: "tusī̃ kadõ āoge?",
    exampleEnglish: "When will you come?",
  },
  {
    gurmukhi: "ਕਿਉਂ",
    roman: "kiũ",
    english: "why",
    category: "question_words",
    partOfSpeech: "question",
    difficulty: 1,
    example: "ਤੁਸੀਂ ਕਿਉਂ ਜਾ ਰਹੇ ਹੋ?",
    exampleRoman: "tusī̃ kiũ jā rahe ho?",
    exampleEnglish: "Why are you going?",
  },
  {
    gurmukhi: "ਕਿੰਨਾ",
    roman: "kinnā",
    english: "how much, how many",
    category: "question_words",
    partOfSpeech: "question",
    difficulty: 1,
    example: "ਕਿੰਨਾ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ?",
    exampleRoman: "kinnā pāṇī cāhīdā hai?",
    exampleEnglish: "How much water do you need?",
    note: "Agrees with what is being counted, like an adjective: ਕਿੰਨਾ ਪਾਣੀ, ਕਿੰਨੀ ਚਾਹ, ਕਿੰਨੇ ਬੱਚੇ.",
  },
  {
    gurmukhi: "ਕਿਹੜਾ",
    roman: "kihṛā",
    english: "which",
    category: "question_words",
    partOfSpeech: "question",
    difficulty: 1,
    example: "ਕਿਹੜਾ ਰੰਗ ਚੰਗਾ ਹੈ?",
    exampleRoman: "kihṛā raṅg caṅgā hai?",
    exampleEnglish: "Which colour is good?",
  },
];

export const questions: Word[] = parseAll(wordSchema, raw, "questions word");
