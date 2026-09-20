import { parseAll, wordSchema, type Word } from "@/content/schema";

/**
 * The people words.
 *
 * Two things trip up every English speaker here. Punjabi has two words for
 * "you" — ਤੂੰ for a friend or a child, ਤੁਸੀਂ for everyone else — and getting
 * that wrong is the difference between friendly and rude. And ਇਹ / ਉਹ do the
 * work of this, that, he, she and they all at once: near things and people are
 * ਇਹ, far ones are ਉਹ, and the language does not mark he against she at all.
 *
 * ਮੈਂ and ਤੁਸੀਂ are taught in the greetings file, with Lesson 1.
 */

const raw: unknown[] = [
  {
    gurmukhi: "ਤੂੰ",
    roman: "tū̃",
    english: "you (to a friend, a child, or someone younger)",
    category: "pronouns",
    partOfSpeech: "pronoun",
    difficulty: 1,
    example: "ਤੂੰ ਕਿੱਥੇ ਹੈਂ?",
    exampleRoman: "tū̃ kitthe haĩ?",
    exampleEnglish: "Where are you?",
    note: "Warm between friends, insulting to an elder or a stranger. Until you are sure, use ਤੁਸੀਂ — nobody is ever offended by being addressed too politely.",
  },
  {
    gurmukhi: "ਇਹ",
    roman: "ih",
    english: "this, these; he, she, it (someone near)",
    category: "pronouns",
    partOfSpeech: "pronoun",
    difficulty: 1,
    example: "ਇਹ ਮੇਰਾ ਘਰ ਹੈ।",
    exampleRoman: "ih merā ghar hai.",
    exampleEnglish: "This is my house.",
    note: "Said more like eh than ih — the ਹ barely sounds. It points at whatever is close by, including a person standing next to you.",
  },
  {
    gurmukhi: "ਉਹ",
    roman: "uh",
    english: "that, those; he, she, it (someone further away)",
    category: "pronouns",
    partOfSpeech: "pronoun",
    difficulty: 1,
    example: "ਉਹ ਮੇਰੀ ਭੈਣ ਹੈ।",
    exampleRoman: "uh merī bhaiṇ hai.",
    exampleEnglish: "That is my sister.",
    note: "Said more like oh. Punjabi has no separate he and she, so ਉਹ covers both — who is meant comes from the conversation.",
  },
  {
    gurmukhi: "ਅਸੀਂ",
    roman: "asī̃",
    english: "we",
    category: "pronouns",
    partOfSpeech: "pronoun",
    difficulty: 1,
    example: "ਅਸੀਂ ਪੰਜਾਬੀ ਬੋਲਦੇ ਹਾਂ।",
    exampleRoman: "asī̃ pañjābī bolde hā̃.",
    exampleEnglish: "We speak Punjabi.",
  },
  {
    gurmukhi: "ਮੇਰਾ",
    roman: "merā",
    english: "my",
    category: "pronouns",
    partOfSpeech: "pronoun",
    difficulty: 1,
    example: "ਇਹ ਮੇਰਾ ਘਰ ਹੈ।",
    exampleRoman: "ih merā ghar hai.",
    exampleEnglish: "This is my house.",
    note: "It changes to match what is owned, not who owns it: ਮੇਰਾ ਘਰ (my house, masculine), ਮੇਰੀ ਭੈਣ (my sister, feminine), ਮੇਰੇ ਭਰਾ (my brothers, plural).",
  },
  {
    gurmukhi: "ਤੁਹਾਡਾ",
    roman: "tuhāḍā",
    english: "your (matching ਤੁਸੀਂ)",
    category: "pronouns",
    partOfSpeech: "pronoun",
    difficulty: 1,
    example: "ਤੁਹਾਡਾ ਨਾਂ ਕੀ ਹੈ?",
    exampleRoman: "tuhāḍā nā̃ kī hai?",
    exampleEnglish: "What is your name?",
    note: "The polite your, and the one to use with anyone you would call ਤੁਸੀਂ. It agrees with the thing owned exactly as ਮੇਰਾ does.",
  },
  {
    gurmukhi: "ਮੈਨੂੰ",
    roman: "mainū̃",
    english: "to me, me",
    category: "pronouns",
    partOfSpeech: "pronoun",
    difficulty: 1,
    example: "ਮੈਨੂੰ ਚਾਹ ਪਸੰਦ ਹੈ।",
    exampleRoman: "mainū̃ cāh pasand hai.",
    exampleEnglish: "I like tea.",
    note: "Punjabi says liking, needing and knowing to a person rather than by a person: literally tea is pleasing to me. Expect ਮੈਨੂੰ wherever English would start with I feel or I like.",
  },
];

export const pronouns: Word[] = parseAll(wordSchema, raw, "pronouns word");
