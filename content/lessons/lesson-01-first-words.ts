import { lessonSchema, type Lesson } from "@/content/schema";

/**
 * Lesson 1. The shape every lesson follows:
 *
 *   introduce -> examples -> recognition -> new vocabulary -> listening ->
 *   sentence -> recall -> production -> mini review
 *
 * A learner finishes this one able to greet someone, answer "how are you?",
 * and — the part most courses skip — explain why the verb is at the end.
 */

const raw: unknown = {
  id: "first-words",
  number: 1,
  title: "Your first words",
  goal: "Greet someone in Punjabi and say how you are.",
  track: "punjabi",
  unit: "Unit 1 — First Punjabi",
  minutes: 7,
  steps: [
    {
      type: "explain",
      title: "Start by saying hello",
      body: [
        "Punjabi has one greeting that works everywhere: in the morning, in the evening, arriving and leaving.",
        "You will hear it shortened in fast speech, but this is the full form and the one to learn.",
      ],
      display: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
      displayRoman: "sat srī akāl",
      displayEnglish: "hello, and also goodbye",
    },
    {
      type: "vocab",
      title: "Three words to start with",
      intro: "Tap the speaker on each one and say it back before moving on.",
      words: ["ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "ਧੰਨਵਾਦ", "ਜੀ"],
    },
    {
      type: "exercise",
      exercise: {
        type: "choice",
        prompt: "What does this mean?",
        subject: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
        subjectScript: "gurmukhi",
        options: ["hello", "thank you", "goodnight", "please"],
        answer: "hello",
        optionScript: "latin",
        explain: "It is used for goodbye too — the same phrase does both jobs.",
        tracks: { kind: "word", value: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ" },
      },
    },
    {
      type: "exercise",
      exercise: {
        type: "listening",
        prompt: "Which word did you hear?",
        say: "ਧੰਨਵਾਦ",
        options: ["ਧੰਨਵਾਦ", "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "ਨਹੀਂ"],
        answer: "ਧੰਨਵਾਦ",
        optionScript: "gurmukhi",
        tracks: { kind: "word", value: "ਧੰਨਵਾਦ" },
      },
    },
    {
      type: "vocab",
      title: "Now the words you answer with",
      intro: "These five carry most short conversations.",
      words: ["ਮੈਂ", "ਤੁਸੀਂ", "ਠੀਕ", "ਹਾਂ", "ਨਹੀਂ"],
    },
    {
      type: "sentence",
      title: "Your first exchange",
      intro: "Tap any word to see what it is doing.",
      sentences: ["how-are-you", "i-am-fine"],
    },
    {
      type: "explain",
      title: "Why the verb is at the end",
      body: [
        "English says I am fine. Punjabi says I fine am — the verb goes last, and it is the last thing you hear.",
        "This is not a quirk to memorise. It is the order of nearly every Punjabi sentence, so once you expect the verb at the end, whole sentences stop feeling scrambled.",
        "The verb also changes shape depending on who you are talking about: ਹਾਂ goes with ਮੈਂ, ਹੋ goes with ਤੁਸੀਂ.",
      ],
      display: "ਮੈਂ ਠੀਕ ਹਾਂ।",
      displayRoman: "maĩ ṭhīk hā̃.",
      displayEnglish: "I fine am.",
    },
    {
      type: "exercise",
      exercise: {
        type: "build",
        prompt: "Put the Punjabi in order",
        english: "I am fine.",
        answerTokens: ["ਮੈਂ", "ਠੀਕ", "ਹਾਂ"],
        distractors: ["ਤੁਸੀਂ", "ਹੋ"],
        explain: "Verb last. ਹਾਂ is the form that goes with ਮੈਂ.",
        tracks: { kind: "sentence", value: "i-am-fine" },
      },
    },
    {
      type: "exercise",
      exercise: {
        type: "blank",
        prompt: "Complete the question",
        sentence: "ਤੁਸੀਂ ___ ਹੋ?",
        english: "How are you?",
        options: ["ਕਿਵੇਂ", "ਠੀਕ", "ਨਹੀਂ"],
        answer: "ਕਿਵੇਂ",
        explain: "Unlike English, the question word stays in the middle, where the answer would go.",
        tracks: { kind: "word", value: "ਕਿਵੇਂ" },
      },
    },
    {
      type: "exercise",
      exercise: {
        type: "read-aloud",
        prompt: "Say it out loud",
        text: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।",
        roman: "sat srī akāl jī.",
        english: "Hello. (politely)",
      },
    },
    {
      type: "exercise",
      exercise: {
        type: "typing",
        prompt: "Write yes in Gurmukhi",
        hint: "Two letters and a dot above: the dot sends the vowel through your nose.",
        answer: "ਹਾਂ",
        explain: "ਹ + ਾ + ਂ. Without the dot it would be hā, which is not a word here.",
        tracks: { kind: "word", value: "ਹਾਂ" },
      },
    },
    {
      type: "exercise",
      exercise: {
        type: "translate",
        prompt: "Say this in Punjabi",
        english: "I am fine.",
        answer: "ਮੈਂ ਠੀਕ ਹਾਂ।",
        accept: ["ਮੈਂ ਠੀਕ ਹਾਂ"],
        tracks: { kind: "sentence", value: "i-am-fine" },
      },
    },
    {
      type: "review",
      title: "Quick review",
      exercises: [
        {
          type: "choice",
          prompt: "What does this mean?",
          subject: "ਧੰਨਵਾਦ",
          subjectScript: "gurmukhi",
          options: ["thank you", "hello", "yes", "how"],
          answer: "thank you",
          optionScript: "latin",
          tracks: { kind: "word", value: "ਧੰਨਵਾਦ" },
        },
        {
          type: "choice",
          prompt: "Which word would you use with someone you have just met?",
          options: ["ਤੁਸੀਂ", "ਮੈਂ"],
          answer: "ਤੁਸੀਂ",
          optionScript: "gurmukhi",
          explain: "ਤੁਸੀਂ is the respectful you, and the safe choice with anyone you do not know well.",
          tracks: { kind: "word", value: "ਤੁਸੀਂ" },
        },
        {
          type: "listening",
          prompt: "Which one did you hear?",
          say: "ਮੈਂ ਠੀਕ ਹਾਂ।",
          options: ["ਮੈਂ ਠੀਕ ਹਾਂ।", "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?"],
          answer: "ਮੈਂ ਠੀਕ ਹਾਂ।",
          optionScript: "gurmukhi",
          tracks: { kind: "sentence", value: "i-am-fine" },
        },
      ],
    },
  ],
};

export const lessonFirstWords: Lesson = lessonSchema.parse(raw);
