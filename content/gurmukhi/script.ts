import { parseAll, scriptNoteSchema, type ScriptNote } from "@/content/schema";

/**
 * Stage 1: how the script works, before a single letter is memorised.
 *
 * Most Gurmukhi courses open with the thirty-five letters and leave the
 * system itself unexplained, so a learner memorises shapes for weeks without
 * knowing that a bare consonant already carries a vowel, or why ਕਿ is read
 * "ki" when the mark is drawn on the left. Six short ideas, each demonstrated
 * in real Punjabi, remove almost all of that confusion up front.
 */

const raw: unknown[] = [
  {
    id: "script-vs-language",
    title: "Gurmukhi is the writing, Punjabi is the language",
    summary: "One is a script, the other is a language. They are not the same thing.",
    body: [
      "Punjabi is the language: the words, the grammar, the sounds. Gurmukhi is one way of writing it down, the way used in Indian Punjab.",
      "The same language is written in a different script, Shahmukhi, in Pakistani Punjab. A speaker from either side understands the other perfectly and cannot read a word of their writing.",
      "So learning Gurmukhi and learning Punjabi are two jobs. This course does both, side by side, because each one makes the other easier.",
    ],
    demo: [
      { gurmukhi: "ਪੰਜਾਬੀ", roman: "pañjābī", caption: "the language, written in Gurmukhi" },
      { gurmukhi: "ਗੁਰਮੁਖੀ", roman: "gurmukhī", caption: "the script, naming itself" },
    ],
    order: 1,
  },
  {
    id: "top-bar",
    title: "The line along the top holds a word together",
    summary: "Letters hang from a line rather than sitting on one.",
    body: [
      "Gurmukhi is written left to right, like English. The difference is the line across the top, the ਸਿਰ ਰੇਖਾ (sir rekhā), which runs unbroken across a whole word.",
      "That line is how your eye finds where one word ends and the next begins, and it is why Gurmukhi looks like it is hanging rather than standing.",
      "When you write, the body of the letter comes first and the top bar last — the opposite of how it looks.",
    ],
    demo: [
      { gurmukhi: "ਪਾਣੀ", roman: "pāṇī", caption: "one word: one unbroken line" },
      { gurmukhi: "ਮੇਰਾ ਘਰ", roman: "merā ghar", caption: "two words: the line breaks between them" },
    ],
    order: 2,
  },
  {
    id: "built-in-vowel",
    title: "Every consonant already has a vowel in it",
    summary: "ਕ is not k. It is ka — the short vowel is there whether or not anything is written.",
    body: [
      "This is the single idea that unlocks reading. A consonant with no mark on it is not a bare sound; it carries a short a, the vowel in about. The name for that silent, unwritten vowel is ਮੁਕਤਾ (muktā), which means free.",
      "So ਘਰ is not ghr. It is ghar — two consonants, each carrying its own short a, and nothing written at all.",
      "To get a different vowel you add a sign. To get no vowel, at the end of a word, Punjabi usually just lets the last one fade.",
    ],
    demo: [
      { gurmukhi: "ਘਰ", roman: "ghar", caption: "house — no vowel written, two vowels read" },
      { gurmukhi: "ਕਲਮ", roman: "kalam", caption: "pen — three letters, and an a in each" },
    ],
    order: 3,
  },
  {
    id: "vowel-signs",
    title: "Vowel signs hang off the letter, in every direction",
    summary: "Ten signs, and they behave the same way on all thirty-five letters.",
    body: [
      "A vowel sign is added above, below, before or after the consonant it belongs to. Where it sits is a matter of shape, not of order.",
      "ਸਿਹਾਰੀ (sihārī) is the one that catches everyone exactly once: it is drawn to the left of the letter but spoken after it. ਕਿ is ki, never ik.",
      "Learn the ten signs once, on one letter, and they work unchanged everywhere else. That is why the course teaches them all on ਕ before letting them loose.",
    ],
    demo: [
      { gurmukhi: "ਕਿ", roman: "ki", caption: "the sign is on the left, the sound comes after" },
      { gurmukhi: "ਕੀ", roman: "kī", caption: "on the right, and longer" },
      { gurmukhi: "ਕੁ", roman: "ku", caption: "underneath" },
      { gurmukhi: "ਕੇ", roman: "ke", caption: "on the top bar" },
    ],
    order: 4,
  },
  {
    id: "independent-vowels",
    title: "A vowel at the start of a word needs something to sit on",
    summary: "Three letters exist only to carry a vowel: ੳ, ਅ and ੲ.",
    body: [
      "A vowel sign has to hang off a consonant. So when a word begins with a vowel, Punjabi gives it a stand — one of three carrier letters, chosen by which vowel it is.",
      "ੳ carries u, ū and o. ਅ carries a, ā, e and ai. ੲ carries i and ī.",
      "This is not an extra rule to memorise so much as a reason not to panic: ਆ is not a new letter, it is ਅ with the same ਕੰਨਾ sign you already know from ਕਾ.",
    ],
    demo: [
      { gurmukhi: "ਆਮ", roman: "ām", caption: "ਅ carrying kannā at the start of the word" },
      { gurmukhi: "ਇੱਕ", roman: "ikk", caption: "ੲ carrying sihārī" },
      { gurmukhi: "ਉੱਲੂ", roman: "ullū", caption: "ੳ carrying aunkaṛ" },
    ],
    order: 5,
  },
  {
    id: "marks-matter",
    title: "The small marks are not decoration",
    summary: "A dot or a stroke can change the word entirely, so they are read, not skipped.",
    body: [
      "Three small marks do a lot of work. ਅੱਧਕ (ੱ) doubles the consonant after it, which shortens the vowel before it. ਬਿੰਦੀ (ਂ) and ਟਿੱਪੀ (ੰ) put a nasal into the vowel, the way the French n in bon is a nasal rather than a consonant.",
      "Skipping them is not a small accent slip. ਦਸ is ten and ਦੱਸ is tell.",
      "They are worth slowing down for from the first week, because a habit of reading past them is hard to undo later.",
    ],
    demo: [
      { gurmukhi: "ਦਸ", roman: "das", caption: "ten" },
      { gurmukhi: "ਦੱਸ", roman: "dass", caption: "tell — the same letters, one adhak" },
      { gurmukhi: "ਮੈਂ", roman: "maĩ", caption: "I — the bindi nasalises the vowel" },
    ],
    order: 6,
  },
  {
    id: "spelled-as-spoken",
    title: "It is spelled the way it sounds",
    summary: "Once you know the letters, you can read a word you have never seen.",
    body: [
      "Gurmukhi was designed for the language it writes, and it mostly keeps its promises: one letter, one sound. There is no through, cough and dough to memorise.",
      "That means reading and spelling arrive together. The moment the letters are solid, an unfamiliar word is still readable — you just will not know what it means yet.",
      "Which is exactly why this course keeps reading and vocabulary side by side rather than finishing one before starting the other.",
    ],
    demo: [
      { gurmukhi: "ਸਿੱਖਣਾ", roman: "sikkhṇā", caption: "read it letter by letter and you have said it correctly" },
    ],
    order: 7,
  },
];

export const scriptNotes: ScriptNote[] = parseAll(scriptNoteSchema, raw, "script note");

export function getScriptNote(id: string): ScriptNote | undefined {
  return scriptNotes.find((note) => note.id === id);
}
