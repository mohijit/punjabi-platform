import { parseAll, wordSchema, type Word } from "@/content/schema";

/**
 * One to ten, and a hundred.
 *
 * Punjabi numbers above ten are irregular in a way that has to be learned one
 * by one (ਯਾਰਾਂ, ਬਾਰਾਂ, ਤੇਰਾਂ…), so they wait for their own lesson. These
 * eleven cover counting, money, telling the time and most of what a beginner
 * needs to say in a shop.
 *
 * The Gurmukhi digits ੦੧੨੩੪੫੬੭੮੯ exist and are still used on signs in Punjab,
 * but the western digits are what people write day to day, so they are taught
 * as recognition later rather than drilled here.
 */

const raw: unknown[] = [
  {
    gurmukhi: "ਇੱਕ",
    roman: "ikk",
    english: "one",
    category: "numbers",
    partOfSpeech: "number",
    difficulty: 1,
    example: "ਮੇਰੇ ਕੋਲ ਇੱਕ ਕਿਤਾਬ ਹੈ।",
    exampleRoman: "mere kol ikk kitāb hai.",
    exampleEnglish: "I have one book.",
    note: "The ੱ (adhak) doubles the k, so it is ik-k, not ik. Punjabi hears that doubling clearly.",
  },
  {
    gurmukhi: "ਦੋ",
    roman: "do",
    english: "two",
    category: "numbers",
    partOfSpeech: "number",
    difficulty: 1,
    example: "ਮੇਰੇ ਦੋ ਭਰਾ ਹਨ।",
    exampleRoman: "mere do bharā han.",
    exampleEnglish: "I have two brothers.",
  },
  {
    gurmukhi: "ਤਿੰਨ",
    roman: "tinn",
    english: "three",
    category: "numbers",
    partOfSpeech: "number",
    difficulty: 1,
    example: "ਸਾਡੇ ਘਰ ਤਿੰਨ ਕਮਰੇ ਹਨ।",
    exampleRoman: "sāḍe ghar tinn kamre han.",
    exampleEnglish: "Our house has three rooms.",
  },
  {
    gurmukhi: "ਚਾਰ",
    roman: "cār",
    english: "four",
    category: "numbers",
    partOfSpeech: "number",
    difficulty: 1,
    example: "ਮੇਜ਼ ਦੀਆਂ ਚਾਰ ਲੱਤਾਂ ਹਨ।",
    exampleRoman: "mez dīā̃ cār lattā̃ han.",
    exampleEnglish: "A table has four legs.",
  },
  {
    gurmukhi: "ਪੰਜ",
    roman: "pañj",
    english: "five",
    category: "numbers",
    partOfSpeech: "number",
    difficulty: 1,
    example: "ਪੰਜਾਬ ਦਾ ਮਤਲਬ ਪੰਜ ਦਰਿਆ ਹੈ।",
    exampleRoman: "pañjāb dā matlab pañj dariā hai.",
    exampleEnglish: "Punjab means five rivers.",
    note: "Worth knowing on the first day: ਪੰਜ (five) + ਆਬ (water) is where the name Punjab comes from.",
  },
  {
    gurmukhi: "ਛੇ",
    roman: "che",
    english: "six",
    category: "numbers",
    partOfSpeech: "number",
    difficulty: 1,
    example: "ਛੇ ਵਜੇ ਹਨ।",
    exampleRoman: "che vaje han.",
    exampleEnglish: "It is six o'clock.",
  },
  {
    gurmukhi: "ਸੱਤ",
    roman: "satt",
    english: "seven",
    category: "numbers",
    partOfSpeech: "number",
    difficulty: 1,
    example: "ਹਫ਼ਤੇ ਵਿੱਚ ਸੱਤ ਦਿਨ ਹੁੰਦੇ ਹਨ।",
    exampleRoman: "hafte vicc satt din hunde han.",
    exampleEnglish: "There are seven days in a week.",
  },
  {
    gurmukhi: "ਅੱਠ",
    roman: "aṭṭh",
    english: "eight",
    category: "numbers",
    partOfSpeech: "number",
    difficulty: 1,
    example: "ਮੈਂ ਅੱਠ ਵਜੇ ਆਵਾਂਗਾ।",
    exampleRoman: "maĩ aṭṭh vaje āvāṅgā.",
    exampleEnglish: "I will come at eight.",
    note: "Two hard sounds at once: the ਠ is retroflex (tongue curled back) and aspirated (a puff of air).",
  },
  {
    gurmukhi: "ਨੌਂ",
    roman: "naũ",
    english: "nine",
    category: "numbers",
    partOfSpeech: "number",
    difficulty: 1,
    example: "ਨੌਂ ਬੱਚੇ ਬਾਹਰ ਖੇਡ ਰਹੇ ਹਨ।",
    exampleRoman: "naũ bacce bāhar kheḍ rahe han.",
    exampleEnglish: "Nine children are playing outside.",
  },
  {
    gurmukhi: "ਦਸ",
    roman: "das",
    english: "ten",
    category: "numbers",
    partOfSpeech: "number",
    difficulty: 1,
    example: "ਮੇਰੇ ਕੋਲ ਦਸ ਰੁਪਏ ਹਨ।",
    exampleRoman: "mere kol das rupae han.",
    exampleEnglish: "I have ten rupees.",
  },
  {
    gurmukhi: "ਸੌ",
    roman: "sau",
    english: "hundred",
    category: "numbers",
    partOfSpeech: "number",
    difficulty: 1,
    example: "ਇਹ ਕਿਤਾਬ ਸੌ ਰੁਪਏ ਦੀ ਹੈ।",
    exampleRoman: "ih kitāb sau rupae dī hai.",
    exampleEnglish: "This book costs a hundred rupees.",
  },
];

export const numbers: Word[] = parseAll(wordSchema, raw, "numbers word");
