import { parseAll, symbolSchema, type GurmukhiSymbol } from "@/content/schema";

/**
 * The small marks. Each one is explained by what it *does* to a real word,
 * not by its phonological definition — a learner needs to know that ਦੁਧ and
 * ਦੁੱਧ are different words, not what gemination is.
 */

const raw: unknown[] = [
  {
    id: "tippi",
    symbol: "ੰ",
    name: "ṭippī",
    nameGurmukhi: "ਟਿੱਪੀ",
    does: "adds an n or m sound before the next letter",
    explanation:
      "A small curl sitting on the top bar. It stands for a nasal sound — n, m or ng — and which one it is depends on the letter that follows. You do not have to memorise that: say it naturally and your mouth picks the right one, exactly as English does in the same place.",
    examples: [
      { gurmukhi: "ਪੰਜਾਬੀ", roman: "pañjābī", english: "Punjabi" },
      { gurmukhi: "ਪਿੰਡ", roman: "piṇḍ", english: "village" },
      { gurmukhi: "ਰੰਗ", roman: "raṅg", english: "colour" },
      { gurmukhi: "ਬੰਦ", roman: "band", english: "closed" },
    ],
    order: 1,
  },
  {
    id: "bindi",
    symbol: "ਂ",
    name: "bindī",
    nameGurmukhi: "ਬਿੰਦੀ",
    does: "sends the vowel through the nose",
    explanation:
      "A dot above the line. Unlike tippi it does not add a separate n sound — it nasalises the vowel itself, the way the French word bon does. It appears on many of the commonest words in Punjabi, so you meet it immediately.",
    examples: [
      { gurmukhi: "ਮੈਂ", roman: "maĩ", english: "I" },
      { gurmukhi: "ਹਾਂ", roman: "hā̃", english: "yes" },
      { gurmukhi: "ਨਹੀਂ", roman: "nahī̃", english: "no, not" },
      { gurmukhi: "ਤੁਸੀਂ", roman: "tusī̃", english: "you (respectful)" },
    ],
    order: 2,
  },
  {
    id: "addak",
    symbol: "ੱ",
    name: "addak",
    nameGurmukhi: "ਅੱਧਕ",
    does: "doubles the letter that comes after it",
    explanation:
      "Written above the line, before the letter it doubles. You hold the consonant for slightly longer, as in the English word bookkeeper. It changes meaning, so it is never optional: ਪਤਾ is an address and ਪੱਤਾ is a leaf.",
    examples: [
      { gurmukhi: "ਦੁੱਧ", roman: "duddh", english: "milk" },
      { gurmukhi: "ਸੱਚ", roman: "sacc", english: "truth" },
      { gurmukhi: "ਪੱਤਾ", roman: "pattā", english: "leaf" },
      { gurmukhi: "ਵੱਡਾ", roman: "vaḍḍā", english: "big" },
    ],
    order: 3,
  },
  {
    id: "pairi-haha",
    symbol: "੍ਹ",
    name: "pairī̃ hāhā",
    nameGurmukhi: "ਪੈਰੀਂ ਹਾਹਾ",
    does: "tucks an h underneath a letter",
    explanation:
      "Some letters are written in a small form beneath another letter rather than beside it. The commonest is ਹ. It blends into the letter above it and, in modern Punjabi, usually lowers the tone of the word rather than being heard as a separate h.",
    examples: [
      { gurmukhi: "ਪੜ੍ਹਨਾ", roman: "paṛhnā", english: "to read" },
      { gurmukhi: "ਕੱਲ੍ਹ", roman: "kallh", english: "tomorrow, or yesterday" },
      { gurmukhi: "ਨ੍ਹਾਉਣਾ", roman: "nhāuṇā", english: "to bathe" },
    ],
    order: 4,
  },
  {
    id: "pairi-rara",
    symbol: "੍ਰ",
    name: "pairī̃ rārā",
    nameGurmukhi: "ਪੈਰੀਂ ਰਾਰਾ",
    does: "tucks an r underneath a letter",
    explanation:
      "The same idea with ਰ: a small hook below the letter, pronounced straight after it with no vowel in between. It turns up in words borrowed from Sanskrit and in names.",
    examples: [
      { gurmukhi: "ਪ੍ਰੇਮ", roman: "prem", english: "love" },
      { gurmukhi: "ਸ੍ਰੀ", roman: "srī", english: "Sri (a title of respect)" },
    ],
    order: 5,
  },
  {
    id: "pairi-vava",
    symbol: "੍ਵ",
    name: "pairī̃ vāvā",
    nameGurmukhi: "ਪੈਰੀਂ ਵਾਵਾ",
    does: "tucks a v underneath a letter",
    explanation:
      "The least common of the three. Worth recognising so it does not stop you mid-sentence, but you will rarely need to write it.",
    examples: [{ gurmukhi: "ਸ੍ਵਰਗ", roman: "svarag", english: "heaven" }],
    order: 6,
  },
];

export const symbols: GurmukhiSymbol[] = parseAll(symbolSchema, raw, "symbol");

export const symbolsById = new Map(symbols.map((symbol) => [symbol.id, symbol]));
