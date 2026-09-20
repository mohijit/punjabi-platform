/**
 * Transliteration tests. Run with: npm run check
 *
 * Every pair below is a word whose romanisation has been checked by hand. They
 * cover the cases the engine gets wrong if anything regresses: tippi taking the
 * place of the following consonant, the inherent vowel being dropped, subjoined
 * letters, and the six nukta letters (which NFC splits into base + nukta).
 */

import { toRoman, toSearchKey, toClusters } from "@/lib/transliteration";

const cases = [
  // vowels, nasals and the inherent vowel
  ["ਪਾਣੀ", "pāṇī"],
  ["ਘਰ", "ghar"],
  ["ਮੈਂ", "maĩ"],
  ["ਤੁਸੀਂ", "tusī̃"],
  ["ਪੰਜਾਬੀ", "pañjābī"],
  ["ਧੰਨਵਾਦ", "dhannvād"],
  ["ਹਾਂ", "hā̃"],
  ["ਨਹੀਂ", "nahī̃"],
  ["ਕਮਰਾ", "kamrā"],
  ["ਪਰਿਵਾਰ", "parivār"],
  ["ਵਿਦਿਆਰਥੀ", "vidiārthī"],
  ["ਚਾਹ", "cāh"],
  ["ਰੋਟੀ", "roṭī"],
  // addak doubles the letter after it
  ["ਸਿੱਖ", "sikkh"],
  ["ਦੁੱਧ", "duddh"],
  // subjoined (pairī̃) letters, with and without a vowel of their own
  ["ਪੜ੍ਹਨਾ", "paṛhnā"],
  ["ਪ੍ਰੇਮ", "prem"],
  ["ਸ੍ਰੀ", "srī"],
  ["ਸ੍ਵਰਗ", "svarag"],
  ["ਨ੍ਹਾਉਣਾ", "nhāuṇā"],
  // the six nukta letters
  ["ਸ਼ਹਿਰ", "śahir"],
  ["ਖ਼ਬਰ", "xabar"],
  ["ਗ਼ਲਤ", "ġalat"],
  ["ਸਬਜ਼ੀ", "sabzī"],
  ["ਫ਼ੋਨ", "fon"],
  ["ਵਾਲ਼", "vāḷ"],
  // a whole sentence
  ["ਮੈਂ ਘਰ ਜਾ ਰਿਹਾ ਹਾਂ।", "maĩ ghar jā rihā hā̃."],
];

let failed = 0;
for (const [gurmukhi, expected] of cases) {
  const got = toRoman(gurmukhi);
  if (got !== expected) {
    failed += 1;
    console.error(`  ✗ ${gurmukhi}  got "${got}"  expected "${expected}"`);
  }
}

// Search folding: a learner typing any of these must reach the same word.
const searchGroups = [
  ["ਪਾਣੀ", "paani", "pani", "pāṇī"],
  ["ਪੰਜਾਬੀ", "panjabi", "pañjābī"],
  ["ਖ਼ਬਰ", "khabar", "xabar"],
];
for (const group of searchGroups) {
  const keys = group.map(toSearchKey);
  if (new Set(keys).size !== 1) {
    failed += 1;
    console.error(`  ✗ search keys disagree: ${group.join(", ")} -> ${keys.join(", ")}`);
  }
}

// Clusters keep a letter together with its marks, so tapping one is meaningful.
const clusterCases = [
  ["ਸਿੱਖ", ["ਸਿ", "ੱਖ"]],
  ["ਪੜ੍ਹਨਾ", ["ਪ", "ੜ੍ਹ", "ਨਾ"]],
];
for (const [word, expected] of clusterCases) {
  const got = toClusters(word);
  if (got.join("|") !== expected.join("|")) {
    failed += 1;
    console.error(`  ✗ clusters of ${word}: got ${got.join("|")}, expected ${expected.join("|")}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} transliteration failure(s).`);
  process.exit(1);
}

console.log(`transliteration  ${cases.length} words, ${searchGroups.length} search groups, ${clusterCases.length} cluster cases — all pass.`);
