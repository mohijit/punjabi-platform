import { parseAll, wordSchema, type Word } from "@/content/schema";

/**
 * The words of Lesson 1. Deliberately small and deliberately the most common
 * things a person actually says — a learner should be able to greet someone
 * and answer "how are you?" after one lesson, not recognise twenty nouns.
 *
 * Every entry here is high-frequency, everyday Punjabi. See content/SOURCES.md
 * for how these are checked.
 */

const raw: unknown[] = [
  {
    gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
    roman: "sat srī akāl",
    english: "hello (the standard Punjabi greeting)",
    category: "greetings",
    partOfSpeech: "phrase",
    difficulty: 1,
    example: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।",
    exampleRoman: "sat srī akāl jī.",
    exampleEnglish: "Hello. (with jī, which adds respect)",
    note: "Used for both hello and goodbye, at any time of day. It is a Sikh greeting that is now the everyday greeting across Punjabi speakers.",
  },
  {
    gurmukhi: "ਜੀ",
    roman: "jī",
    english: "a word added to show respect",
    category: "expressions",
    partOfSpeech: "phrase",
    difficulty: 1,
    example: "ਹਾਂ ਜੀ।",
    exampleRoman: "hā̃ jī.",
    exampleEnglish: "Yes. (politely)",
    note: "It has no English equivalent. Added after a greeting, a name or yes and no, it makes the whole sentence polite.",
  },
  {
    gurmukhi: "ਹਾਂ",
    roman: "hā̃",
    english: "yes",
    category: "expressions",
    partOfSpeech: "phrase",
    difficulty: 1,
    example: "ਹਾਂ ਜੀ।",
    exampleRoman: "hā̃ jī.",
    exampleEnglish: "Yes. (politely)",
    note: "The same spelling is also the verb am, as in ਮੈਂ ਠੀਕ ਹਾਂ. Which one it is comes from the sentence, never from the spelling.",
  },
  {
    gurmukhi: "ਨਹੀਂ",
    roman: "nahī̃",
    english: "no, not",
    category: "expressions",
    partOfSpeech: "phrase",
    difficulty: 1,
    example: "ਨਹੀਂ ਜੀ।",
    exampleRoman: "nahī̃ jī.",
    exampleEnglish: "No. (politely)",
  },
  {
    gurmukhi: "ਧੰਨਵਾਦ",
    roman: "dhannvād",
    english: "thank you",
    category: "greetings",
    partOfSpeech: "phrase",
    difficulty: 1,
    example: "ਧੰਨਵਾਦ ਜੀ।",
    exampleRoman: "dhannvād jī.",
    exampleEnglish: "Thank you. (politely)",
  },
  {
    gurmukhi: "ਮੈਂ",
    roman: "maĩ",
    english: "I",
    category: "pronouns",
    partOfSpeech: "pronoun",
    difficulty: 1,
    example: "ਮੈਂ ਠੀਕ ਹਾਂ।",
    exampleRoman: "maĩ ṭhīk hā̃.",
    exampleEnglish: "I am fine.",
  },
  {
    gurmukhi: "ਤੁਸੀਂ",
    roman: "tusī̃",
    english: "you (respectful, and for more than one person)",
    category: "pronouns",
    partOfSpeech: "pronoun",
    difficulty: 1,
    example: "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
    exampleRoman: "tusī̃ kivẽ ho?",
    exampleEnglish: "How are you?",
    note: "Punjabi has two words for you. ਤੁਸੀਂ is the safe one: use it with anyone older, anyone you have just met, and any group.",
  },
  {
    gurmukhi: "ਠੀਕ",
    roman: "ṭhīk",
    english: "fine, all right",
    category: "adjectives",
    partOfSpeech: "adjective",
    difficulty: 1,
    example: "ਮੈਂ ਠੀਕ ਹਾਂ।",
    exampleRoman: "maĩ ṭhīk hā̃.",
    exampleEnglish: "I am fine.",
  },
  {
    gurmukhi: "ਕਿਵੇਂ",
    roman: "kivẽ",
    english: "how",
    category: "question_words",
    partOfSpeech: "question",
    difficulty: 1,
    example: "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
    exampleRoman: "tusī̃ kivẽ ho?",
    exampleEnglish: "How are you?",
  },
];

export const greetings: Word[] = parseAll(wordSchema, raw, "greetings word");
