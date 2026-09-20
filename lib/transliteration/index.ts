/**
 * Transliteration.
 *
 * Two different jobs live here and must not be confused:
 *
 * 1. `toRoman` produces the *display* transliteration used as a learning aid
 *    (pāṇī, pañjābī, maĩ). Content files carry hand-checked `roman` strings —
 *    those always win. This function is the fallback for text that has no
 *    hand-written romanisation, such as arbitrary reading-trainer syllables.
 *
 * 2. `toSearchKey` produces a loose ASCII key used only for matching, so a
 *    learner typing "paani", "pani" or "pāṇī" all find ਪਾਣੀ.
 */

/** Consonants, including the six pairī̃-bindī letters. */
const CONSONANTS: Record<string, string> = {
  "ਸ": "s",
  "ਹ": "h",
  "ਕ": "k",
  "ਖ": "kh",
  "ਗ": "g",
  "ਘ": "gh",
  "ਙ": "ṅ",
  "ਚ": "c",
  "ਛ": "ch",
  "ਜ": "j",
  "ਝ": "jh",
  "ਞ": "ñ",
  "ਟ": "ṭ",
  "ਠ": "ṭh",
  "ਡ": "ḍ",
  "ਢ": "ḍh",
  "ਣ": "ṇ",
  "ਤ": "t",
  "ਥ": "th",
  "ਦ": "d",
  "ਧ": "dh",
  "ਨ": "n",
  "ਪ": "p",
  "ਫ": "ph",
  "ਬ": "b",
  "ਭ": "bh",
  "ਮ": "m",
  "ਯ": "y",
  "ਰ": "r",
  "ਲ": "l",
  "ਵ": "v",
  "ੜ": "ṛ",
};

/** The three vowel carriers. Their value depends on the sign attached. */
const CARRIERS = new Set(["ੳ", "ਅ", "ੲ"]);

/** Dependent vowel signs (laga matra). */
const VOWEL_SIGNS: Record<string, string> = {
  "ਾ": "ā",
  "ਿ": "i",
  "ੀ": "ī",
  "ੁ": "u",
  "ੂ": "ū",
  "ੇ": "e",
  "ੈ": "ai",
  "ੋ": "o",
  "ੌ": "au",
};

/** Independent vowels, written as carrier + sign. */
const INDEPENDENT: Record<string, string> = {
  "ਅ": "a",
  "ਆ": "ā",
  "ਇ": "i",
  "ਈ": "ī",
  "ਉ": "u",
  "ਊ": "ū",
  "ਏ": "e",
  "ਐ": "ai",
  "ਓ": "o",
  "ਔ": "au",
};

const BINDI = "ਂ"; // ਂ  nasalises the preceding vowel
const TIPPI = "ੰ"; // ੰ  nasal consonant before a stop
const ADDAK = "ੱ"; // ੱ  doubles the following consonant
const VIRAMA = "੍"; // ੍  subjoined (pairī̃) consonant
const NUKTA = "਼"; // ਼

/**
 * The six pairī̃ bindī letters (ś x ġ z f ḷ). Unicode has a single character
 * for each, but they sit in the composition exclusion table, so NFC *de*composes
 * them into base + nukta. The rest of the engine looks exactly one character
 * ahead, so the pair is recomposed up front and a bare nukta is never seen.
 *
 * Codepoints are written out rather than pasted, because a pasted ਸ਼ is
 * indistinguishable by eye from ਸ + ਼ and would silently stop matching.
 */
const NUKTA_LETTERS: { base: string; composed: string; roman: string }[] = [
  { base: "ਸ", composed: String.fromCharCode(0x0a36), roman: "ś" },
  { base: "ਖ", composed: String.fromCharCode(0x0a59), roman: "x" },
  { base: "ਗ", composed: String.fromCharCode(0x0a5a), roman: "ġ" },
  { base: "ਜ", composed: String.fromCharCode(0x0a5b), roman: "z" },
  { base: "ਫ", composed: String.fromCharCode(0x0a5e), roman: "f" },
  { base: "ਲ", composed: String.fromCharCode(0x0a33), roman: "ḷ" },
];

const NUKTA_BY_BASE = new Map(NUKTA_LETTERS.map((entry) => [entry.base, entry.composed]));

for (const entry of NUKTA_LETTERS) {
  CONSONANTS[entry.composed] = entry.roman;
}
/** Vowels carrying a tilde stand for nasalised vowels: maĩ, hā̃, tusī̃. */
const NASALISED: Record<string, string> = {
  a: "ã",
  ā: "ā̃",
  i: "ĩ",
  ī: "ī̃",
  u: "ũ",
  ū: "ū̃",
  e: "ẽ",
  ai: "aĩ",
  o: "õ",
  au: "aũ",
};

/**
 * Tippi before a consonant is a nasal consonant that takes the place of
 * articulation of what follows: ਪੰਜਾਬੀ is pañjābī, ਧੰਨਵਾਦ is dhannvād.
 * Bindi, by contrast, nasalises the vowel: ਮੈਂ is maĩ.
 */
const NASAL_BY_PLACE: Record<string, string> = {
  "ਕ": "ṅ",
  "ਖ": "ṅ",
  "ਗ": "ṅ",
  "ਘ": "ṅ",
  "ਙ": "ṅ",
  "ਚ": "ñ",
  "ਛ": "ñ",
  "ਜ": "ñ",
  "ਝ": "ñ",
  "ਞ": "ñ",
  "ਟ": "ṇ",
  "ਠ": "ṇ",
  "ਡ": "ṇ",
  "ਢ": "ṇ",
  "ਣ": "ṇ",
  "ਤ": "n",
  "ਥ": "n",
  "ਦ": "n",
  "ਧ": "n",
  "ਨ": "n",
  "ਪ": "m",
  "ਫ": "m",
  "ਬ": "m",
  "ਭ": "m",
  "ਮ": "m",
};

const DIGITS: Record<string, string> = {
  "੦": "0",
  "੧": "1",
  "੨": "2",
  "੩": "3",
  "੪": "4",
  "੫": "5",
  "੬": "6",
  "੭": "7",
  "੮": "8",
  "੯": "9",
};

/** Joins a base letter and its nukta into the single precomposed character. */
function normalise(text: string): string {
  const nfc = text.normalize("NFC");
  let out = "";
  for (let i = 0; i < nfc.length; i += 1) {
    const composed = nfc[i + 1] === NUKTA ? NUKTA_BY_BASE.get(nfc[i]) : undefined;
    if (composed) {
      out += composed;
      i += 1;
    } else {
      out += nfc[i];
    }
  }
  return out;
}

export function isGurmukhi(text: string): boolean {
  return /[਀-੿]/.test(text);
}

function isWordBoundary(char: string | undefined): boolean {
  return char === undefined || char === " " || char === "\n" || char === "।" || char === "॥";
}

/**
 * A consonant with no vowel sign carries an inherent short "a" (mukta), but
 * Punjabi drops it in two places: at the end of a word (ਘਰ is ghar, not
 * ghara) and in the middle when the next consonant carries its own vowel
 * (ਕਮਰਾ is kamrā, not kamarā). It survives on the opening consonant, which
 * is why ਪਰਿਵਾਰ stays parivār.
 */
function keepsInherentA(text: string, index: number): boolean {
  const next = text[index + 1];
  if (isWordBoundary(next)) return false;

  // A subjoined consonant follows directly, with no vowel between them.
  if (next === VIRAMA) return false;

  const isWordInitial = index === 0 || isWordBoundary(text[index - 1]);
  if (isWordInitial) return true;

  if (next !== undefined && CONSONANTS[next] !== undefined) {
    const afterNext = text[index + 2];
    const nextTakesVowel = afterNext !== undefined && VOWEL_SIGNS[afterNext] !== undefined;
    if (nextTakesVowel) return false;
  }

  return true;
}

/**
 * Best-effort romanisation. Content should prefer its own checked `roman`
 * field; this exists so any Gurmukhi string can still be shown with a guide.
 */
export function toRoman(input: string): string {
  const text = normalise(input);
  let out = "";
  let pendingDouble = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === " " || char === "\n") {
      out += char;
      continue;
    }

    if (char === "।" || char === "॥") {
      out += ".";
      continue;
    }

    if (DIGITS[char]) {
      out += DIGITS[char];
      continue;
    }

    if (char === ADDAK) {
      pendingDouble = true;
      continue;
    }

    if (char === NUKTA) continue;

    if (char === VIRAMA) {
      // The following consonant is written below the line and carries no
      // vowel of its own: ਪੜ੍ਹਨਾ -> paṛhnā.
      const subjoined = text[i + 1];
      const value = subjoined ? CONSONANTS[subjoined] : undefined;
      if (value) {
        out += value;
        i += 1;
        // The subjoined letter still takes a vowel of its own: ਪ੍ਰੇਮ is prem,
        // ਸ੍ਵਰਗ is svarag.
        const sign = text[i + 1] ? VOWEL_SIGNS[text[i + 1]] : undefined;
        if (sign) {
          out += sign;
          i += 1;
        } else if (keepsInherentA(text, i)) {
          out += "a";
        }
      }
      continue;
    }

    if (char === BINDI || char === TIPPI) {
      const assimilated = char === TIPPI && next ? NASAL_BY_PLACE[next] : undefined;
      if (assimilated) {
        out += assimilated;
        continue;
      }
      // Otherwise nasalise the vowel just written, when there is one.
      const matched = Object.keys(NASALISED)
        .sort((a, b) => b.length - a.length)
        .find((vowel) => out.endsWith(vowel));
      if (matched) {
        out = out.slice(0, -matched.length) + NASALISED[matched];
      } else {
        out += "n";
      }
      continue;
    }

    if (INDEPENDENT[char] && !CARRIERS.has(char)) {
      out += INDEPENDENT[char];
      continue;
    }

    if (CARRIERS.has(char)) {
      // A carrier takes its value from the sign attached to it.
      const sign = next ? VOWEL_SIGNS[next] : undefined;
      if (sign) {
        out += sign;
        i += 1;
      } else if (char === "ਅ") {
        out += "a";
      }
      continue;
    }

    const consonant = CONSONANTS[char];
    if (consonant) {
      const value = pendingDouble ? consonant[0] + consonant : consonant;
      pendingDouble = false;
      const sign = next ? VOWEL_SIGNS[next] : undefined;
      if (sign) {
        out += value + sign;
        i += 1;
      } else {
        out += value + (keepsInherentA(text, i) ? "a" : "");
      }
      continue;
    }

    out += char;
  }

  return out;
}

const DIACRITIC_FOLD: Record<string, string> = {
  ā: "a",
  ī: "i",
  ū: "u",
  ṇ: "n",
  ṅ: "n",
  ñ: "n",
  ṭ: "t",
  ḍ: "d",
  ṛ: "r",
  ḷ: "l",
  ś: "sh",
  ġ: "g",
  x: "kh",
  ã: "an",
  ĩ: "in",
  ũ: "un",
  ẽ: "en",
  õ: "on",
};

/**
 * A loose ASCII key for search. Long vowels fold onto short ones and doubled
 * letters collapse, so "paani", "pani" and "pāṇī" share one key.
 */
export function toSearchKey(input: string): string {
  const source = isGurmukhi(input) ? toRoman(input) : input;
  let out = "";
  for (const char of source.normalize("NFD")) {
    // Drop combining marks left over from decomposition (tilde, macron).
    if (/[̀-ͯ]/.test(char)) continue;
    const folded = DIACRITIC_FOLD[char] ?? char;
    out += folded;
  }
  return out
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/(.)\1+/g, "$1");
}

/** Splits a Gurmukhi word into display clusters: a letter plus its marks. */
export function toClusters(input: string): string[] {
  const text = normalise(input);
  const clusters: string[] = [];
  // Addak is written before the consonant it doubles, but belongs with it.
  let pendingAddak = "";

  for (const char of text) {
    if (char === ADDAK) {
      pendingAddak = char;
      continue;
    }

    const isMark =
      VOWEL_SIGNS[char] !== undefined ||
      char === BINDI ||
      char === TIPPI ||
      char === NUKTA ||
      char === VIRAMA;
    const afterVirama = clusters.length > 0 && clusters[clusters.length - 1].endsWith(VIRAMA);

    if ((isMark || afterVirama) && clusters.length > 0) {
      clusters[clusters.length - 1] += char;
    } else {
      clusters.push(pendingAddak + char);
      pendingAddak = "";
    }
  }

  if (pendingAddak) clusters.push(pendingAddak);
  return clusters;
}
