import { parseAll, soundGroupSchema, type SoundGroup } from "@/content/schema";

/**
 * Letters an English speaker will confuse, taught side by side with the
 * mouth position that separates them. These drive the listening comparison
 * exercises: "which sound did you hear?".
 */

const raw: unknown[] = [
  {
    id: "velars",
    title: "ਕ ਖ ਗ ਘ",
    explanation:
      "Four letters made in the same place, at the back of the mouth. What separates them is breath and voice: ਕ is a bare k, ਖ is the same k with a puff of air behind it, ਗ is a g, and ਘ is written gh but in modern Punjabi is heard as a k with the voice dipping low.",
    mouthHint:
      "Hold your palm in front of your mouth. ਕ barely moves it; ਖ pushes a clear puff of air against it.",
    letters: ["ਕ", "ਖ", "ਗ", "ਘ"],
    order: 1,
  },
  {
    id: "dental-retroflex-t",
    title: "ਤ and ਟ",
    explanation:
      "Both are a t, made in two different places. For ਤ the tip of the tongue touches the back of the top teeth, which sounds softer than any English t. For ਟ the tongue curls back and taps the roof of the mouth — this is the one closer to the English t in top.",
    mouthHint: "ਤ: tongue on the teeth. ਟ: tongue curled up and back.",
    letters: ["ਤ", "ਟ"],
    order: 2,
  },
  {
    id: "dental-retroflex-d",
    title: "ਦ and ਡ",
    explanation:
      "The same pair of positions with the voice on. ਦ is a soft d against the teeth; ਡ is a d with the tongue curled back. Punjabi treats them as completely separate sounds, so swapping them changes the word.",
    mouthHint: "ਦ: tongue on the teeth. ਡ: tongue curled up and back.",
    letters: ["ਦ", "ਡ"],
    order: 3,
  },
  {
    id: "r-sounds",
    title: "ਰ and ੜ",
    explanation:
      "ਰ is a light tap, close to the r in Spanish pero. ੜ is made by curling the tongue back and flicking it down off the roof of the mouth. It never starts a word, and it is not a variation of ਰ — ਘੋੜਾ, a horse, cannot be written with ਰ.",
    mouthHint: "For ੜ, start with the tongue curled back as for ਟ, then flick it forward.",
    letters: ["ਰ", "ੜ"],
    order: 4,
  },
  {
    id: "n-sounds",
    title: "ਨ and ਣ",
    explanation:
      "ਨ is an ordinary n with the tongue on the teeth. ਣ is an n with the tongue curled back, and it never begins a word. It is very common inside words: ਪਾਣੀ, water, is the one to remember it by.",
    mouthHint: "ਣ: say n with the tongue curled up towards the roof of the mouth.",
    letters: ["ਨ", "ਣ"],
    order: 5,
  },
  {
    id: "labials",
    title: "ਪ ਫ ਬ ਭ",
    explanation:
      "The lip sounds, following the same pattern as the ਕ group. ਪ is a bare p, ਫ is p with a puff of air, ਬ is b, and ਭ is written bh but is heard as a p with the voice dipping low. Note that ਫ is not an f — the f sound is written ਫ਼, with a dot beneath.",
    mouthHint: "ਪ as in spin, ਫ as in pin. English p is usually closer to ਫ.",
    letters: ["ਪ", "ਫ", "ਬ", "ਭ"],
    order: 6,
  },
];

export const soundGroups: SoundGroup[] = parseAll(soundGroupSchema, raw, "sound group");
