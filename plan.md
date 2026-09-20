# Punjabi Learning Platform — Build Plan

## Context

`C:\Projects_New\Learner` is empty. We are building, from scratch, a Punjabi learning
platform that teaches **Gurmukhi reading/writing** and **spoken Punjabi** together.

The problem it solves: existing resources either teach Gurmukhi letters without ever
showing learners how to *read Punjabi*, or drill vocabulary without ever explaining how
sentences work. Every part of this course must connect the chain:

**letter → sound → word → meaning → sentence → conversation**

Target outcome: an absolute beginner can eventually look at `ਮੈਂ ਪੰਜਾਬੀ ਸਿੱਖ ਰਿਹਾ ਹਾਂ।`,
read it, pronounce it, explain what each word does, and produce similar sentences.

Design bar: clean, modern, uncluttered, no childish gamification, large and highly
readable Gurmukhi, light + dark mode, mobile responsive.

### Confirmed decisions

| Decision | Choice |
|---|---|
| Stack | Next.js (App Router) + TypeScript + Tailwind CSS |
| Audio | **Recordings only.** The speech-synthesis fallback was removed: the available `pa-IN`/`hi-IN` voices mispronounce Punjabi badly enough to teach a beginner the wrong sounds. Every data entry keeps an `audio` field, so real recordings drop in without touching a component |
| Persistence | Local-first (localStorage/IndexedDB) behind a storage interface, no accounts, JSON export/import |
| Scope of this build | **Phase 1, fully polished.** Phases 2–4 are planned milestones, not built now |

### Non-negotiable architecture rules

1. **No lesson content hard-coded inside components.** All content lives in typed data
   modules under `content/`, validated against Zod schemas.
2. Clean separation: `components/` (UI) · `content/` (data) · `lib/` (engine, SRS,
   storage, audio, transliteration) · `app/` (routes).
3. Content must be portable — no React imports in `content/`, so a future React Native
   app reuses it verbatim.
4. **Linguistic accuracy over volume.** Every Gurmukhi string is schema-checked and
   spot-verified against references. Better 300 correct words than 2000 guessed ones.

---

## Repository layout

```
Learner/
  plan.md                      ← this plan, copied into the repo (first task)
  app/
    layout.tsx  page.tsx       ← homepage: Continue Learning + review + progress
    onboarding/                ← ability + goal questions, skippable
    learn/                     ← course map + /learn/[lessonId] lesson player
    gurmukhi/                  ← script intro, letters, vowels, symbols, reading trainer
    vocabulary/                ← categories + word cards + saved words
    grammar/                   ← grammar topics (examples first, tables last)
    practice/                  ← practice hub + quiz sessions
    dictionary/                ← search (Gurmukhi / Roman / English)
    progress/                  ← meaningful progress, not streaks
  components/
    ui/                        ← Button, Card, Toggle, Tabs, ProgressBar, Modal
    gurmukhi/                  ← LetterCard, StrokeAnimation, TraceCanvas, VowelGrid
    lesson/                    ← LessonPlayer, StepRenderer, LessonComplete
    exercise/                  ← one component per exercise type
    word/                      ← WordCard, SentenceExplorer, ScriptToggle
  content/
    schema.ts                  ← Zod schemas — single source of truth for content shape
    gurmukhi/letters.ts vowels.ts symbols.ts soundGroups.ts
    vocabulary/*.ts            ← one file per category
    lessons/*.ts               ← one file per lesson
    grammar/*.ts
    sentences.ts               ← word-segmented sentences for the explorer
    index.ts                   ← validated registry + lookup helpers
  lib/
    audio/                     ← play() a recording, playback-rate control
    storage/                   ← StorageAdapter interface + LocalStorageAdapter
    progress/                  ← progress model, mastery tracking, derived stats
    srs/                       ← scheduler (used fully in Phase 2, state captured now)
    transliteration/           ← Gurmukhi → Roman, and search normalisation
    exercises/                 ← exercise generation + answer checking
  types/
```

---

## Milestone 0 — Foundation

**Goal:** an empty but correct shell that renders Gurmukhi beautifully in both themes.

- [x] Copy this plan to `Learner/plan.md`, then `npx create-next-app` (TypeScript,
      Tailwind, App Router, ESLint) and strip the boilerplate.
- [x] Design tokens in `globals.css`: colour scale, spacing, radii; dark mode via
      `prefers-color-scheme` **and** a `data-theme` override so the toggle wins.
- [x] Typography: load a Gurmukhi webfont (Noto Sans Gurmukhi) + a clean Latin face.
      Define `.gurmukhi-xl/-lg/-md` classes — Gurmukhi is always visually dominant.
- [x] `components/ui/` primitives: Button, Card, Toggle, Tabs, ProgressBar, Modal,
      AudioButton, ThemeToggle. Accessible (focus rings, ARIA, keyboard).
- [x] App shell: top nav — Learn · Gurmukhi · Vocabulary · Grammar · Practice ·
      Dictionary · Progress. Collapses to a bottom bar on mobile. Nothing else.
- [x] `lib/storage/`: `StorageAdapter` interface + localStorage implementation,
      versioned keys, safe JSON parse, SSR-guarded, plus export/import.
- [x] `lib/audio/`: `play({audio, rate})` for a recording; honour 0.75× / 1× / 1.25×.
      Speech synthesis was built, judged disrespectful to the language, and removed —
      there is a recording or there is nothing, and the UI degrades quietly either way.

**Verify:** `npm run dev` renders the shell; theme toggle persists; Gurmukhi renders
correctly at large sizes; entries without a recording show no speaker button at all.

---

## Milestone 1 — Content schemas and the Gurmukhi dataset

**Goal:** correct, validated, reviewable Punjabi data — the foundation everything reads.

- [x] `content/schema.ts` — Zod schemas for `Letter`, `VowelSign`, `Symbol`, `Word`,
      `Sentence`, `GrammarTopic`, `Lesson` (a lesson = ordered `LessonStep[]`).
      `Word` matches the brief's shape: `gurmukhi, roman, english, category,
      difficulty, audio, example, exampleEnglish`, plus `partOfSpeech` and `gender`.
- [x] `content/index.ts` parses **all** content through the schemas at module load and
      throws loudly on failure — a typo becomes a build error, not a silent wrong lesson.
- [x] `content/gurmukhi/letters.ts` — all 35 `ਪੈਂਤੀ` in traditional order
      (ੳ ਅ ੲ · ਸ ਹ · ਕ ਖ ਗ ਘ ਙ · ਚ ਛ ਜ ਝ ਞ · ਟ ਠ ਡ ਢ ਣ · ਤ ਥ ਦ ਧ ਨ ·
      ਪ ਫ ਬ ਭ ਮ · ਯ ਰ ਲ ਵ ੜ) plus the 6 `ਪੈਰ ਬਿੰਦੀ` letters (ਸ਼ ਖ਼ ਗ਼ ਜ਼ ਫ਼ ਲ਼).
      Each: letter, name (kakkā…), approximate sound, IPA, articulation note
      (aspirated / retroflex / dental), example word + roman + English, `audio: ""`,
      `strokes` (SVG path data), `group`.
- [x] `content/gurmukhi/vowels.ts` — all 10 laga matra taught on one consonant:
      ਕ ਕਾ ਕਿ ਕੀ ਕੁ ਕੂ ਕੇ ਕੈ ਕੋ ਕੌ, each with name (ਮੁਕਤਾ, ਕੰਨਾ, ਸਿਹਾਰੀ, ਬਿਹਾਰੀ,
      ਔਂਕੜ, ਦੁਲੈਂਕੜ, ਲਾਂ, ਦੁਲਾਵਾਂ, ਹੋੜਾ, ਕਨੌੜਾ), mark position, roman, example word.
      Independent vowel carriers ੳ ਅ ੲ explained separately.
- [x] `content/gurmukhi/symbols.ts` — ਬਿੰਦੀ (ਂ), ਟਿੱਪੀ (ੰ), ਅੱਧਕ (ੱ), pairī̃ forms
      (੍ਹ ੍ਰ ੍ਵ), each explained through real words, plain language, no jargon.
- [x] `content/gurmukhi/soundGroups.ts` — minimal-pair sets for the confusable
      contrasts: ਕ/ਖ/ਗ/ਘ, ਤ/ਟ, ਦ/ਡ, ਰ/ੜ, ਨ/ਣ, ਪ/ਫ/ਬ/ਭ.
- [x] `lib/transliteration/` — consistent scheme matching the brief (maĩ, tusī̃, pāṇī,
      pañjābī) plus an ASCII-fold ("paani", "panjabi") used only for search matching.
- [x] **Accuracy pass:** cross-check every letter name, vowel-sign name and example word
      against Gurmukhi references before moving on; record sources in
      `content/SOURCES.md` and note any entry flagged for review.

**Verify:** a temporary validation script imports `content/index.ts` and prints counts;
Unicode spot-checks confirm e.g. `ਪਾਣੀ` is ਪ + ਾ + ਣ + ੀ and `ਸਿੱਖ` carries the adhak.

---

## Milestone 2 — Lesson engine

**Goal:** a data-driven player that can render any lesson without bespoke code.

- [x] Lesson step union: `explanation` · `letterIntro` · `vocabIntro` · `example` ·
      `exercise` · `review`. A lesson is 5–10 minutes, ~8–12 steps.
- [x] `LessonPlayer`: slim progress bar, one step at a time, keyboard-navigable,
      no timers, no streak pressure, resumable mid-lesson from storage.
- [x] Exercise components + checkers, all sharing one `Exercise` contract:
      multiple choice · Gurmukhi recognition · listening (which word did you hear) ·
      word building (arrange tiles into a sentence) · translation · fill in the blank ·
      typing (with an on-screen Gurmukhi keyboard) · read aloud (show + self-mark;
      mic comes in Phase 4).
- [x] Answer feedback: immediate, calm, always shows the correct answer with roman +
      English + audio. Wrong answers are recorded for the review queue.
- [x] `LessonComplete`: "Lesson complete · Words learned: 8 · Accuracy: 87% ·
      Next: Introducing Yourself".
- [x] `lib/progress/`: per-lesson completion, per-item accuracy history, letter/vowel
      mastery, words-learned count, wrong-answer queue. `lib/srs/` records review state
      now (interval, ease, due date) even though the full scheduler ships in Phase 2.

**Verify:** complete a lesson end to end; refresh mid-lesson and resume; progress
numbers change correctly; clear storage and confirm a clean first-run state.

---

## Milestone 3 — Gurmukhi course UI

- [x] `/gurmukhi` overview: how the script works · learn the letters · confusable sounds ·
      reading trainer, then the reference grids for letters, vowel signs and marks.
      Per-section progress is still to come; the reading trainer carries its own.
- [x] **Stage 1 — Understanding the script** at `/gurmukhi/script`: seven short ideas,
      each demonstrated in real Punjabi — script versus language, the top bar, the vowel
      already inside every consonant, where the signs hang, why a word-initial vowel needs
      a carrier, what the small marks change, and that spelling follows sound.
- [x] `LetterCard`: huge letter, name, sound, IPA, example word, stroke guide and the
      writing surface. The speaker button appears only where a recording exists, which is
      currently nowhere.
- [x] `TraceCanvas` — pointer and touch tracing over a faded guide, themed, with Clear.
      **No accuracy check**, deliberately: a pixel-overlap score measures covering the
      guide rather than stroke order, which is the only part that matters. `StrokeAnimation`
      is not built — the letter data carries a plain-language `strokeGuide`, and the
      `strokes` SVG paths it would animate do not exist yet and cannot be invented.
- [x] Letters are introduced **in small groups** at `/gurmukhi/letters`, one traditional
      row at a time, each row prefaced with what its letters have in common.
- [x] Sound-group screens at `/gurmukhi/sounds` — the contrasts, the mouth positions and a
      real word for each letter. The "which sound did you hear" drills the plan called for
      are **not** built: without recordings there is nothing to hear, and a synthetic voice
      gets these exact contrasts wrong. The page says so rather than pretending.
- [x] Vowel section: the ਕ-series on `/gurmukhi`, then level 2 of the reading trainer puts
      the same ten signs across eight different consonants so the rule generalises.
- [x] **Reading trainer** at `/gurmukhi/reading` — Levels 1–5 (letters → syllables →
      simple words → words with marks → sentences), with a **Show transliteration** toggle
      that starts on and can be switched off mid-session. Levels 6–7 (short paragraphs,
      natural text) wait on Phase 2, because there is not yet enough vocabulary behind
      them to write a paragraph a beginner can actually read. Items are generated from the
      existing letter, vowel, word and sentence data rather than written again, so every
      prompt is content taught elsewhere in the course. A session is twelve items drawn
      from what the learner knows least. No audio on items: recordings only, and there are
      none yet.

**Verify:** walk levels 1–5; tracing works with mouse and touch; transliteration toggle
persists. Audio is not part of this verification — there are no recordings yet, and the
speaker buttons correctly do not render.

---

## Milestone 4 — Punjabi course, vocabulary, onboarding, homepage

- [ ] **Units 1–9 content**, ~18–20 lessons, first Punjabi → family → numbers →
      objects → food/drink → daily routine → time/dates → places → conversation.
      Each lesson follows: introduce → examples → recognition → new vocabulary →
      listening → sentence exercise → recall → mini review.
- [ ] **Course map** `/learn`: a simple vertical path, Gurmukhi and spoken lessons
      **alternating** — learners are never forced to finish the script first. Every
      lesson is always accessible; recommended-next is a highlight, not a lock.
- [ ] Vocabulary seed: **~400–600 verified high-frequency words** across the brief's
      categories, tagged Beginner / Intermediate / Advanced. (The 1,000–2,000 target is
      reached by expansion in Phase 2 — accuracy first, as the brief requires.)
- [ ] `/vocabulary`: category grid → word list → `WordCard` (big Gurmukhi, roman,
      meaning, 🔊, example sentence + translation) with a save-word control and a
      Saved Words view.
- [ ] Global **script mode** setting — Gurmukhi only / Gurmukhi + Roman / Roman only —
      respected by every component that renders Punjabi.
- [x] `SentenceExplorer`: tap any word in a sentence for its roman, gloss and role,
      then the natural translation. Used in lessons, vocabulary and reading.
- [ ] **Onboarding** `/onboarding`: the two questions (ability, goal), fully skippable,
      answers only set the recommended starting lesson — never restrict access.
      Heritage-speaker answers ("can speak but can't read") point at the Gurmukhi track;
      the dedicated heritage pathway is Phase 3.
- [x] **Homepage**: `ਸਤ ਸ੍ਰੀ ਅਕਾਲ` · Continue learning (current lesson) · Today's review
      · Gurmukhi % / Punjabi % / Words learned. Nothing more.
- [x] `/progress`: letters mastered, vowels mastered, words learned, sentences completed,
      listening accuracy, lessons completed, course %. No streaks.
- [ ] Basic `/practice` hub wired to what exists (Quick review, Gurmukhi, Vocabulary,
      Listening, Weak words, 5-minute session) — deeper modes land in Phase 2.
- [x] Minimal `/grammar` and `/dictionary` entry points so navigation is never dead:
      grammar shows the Phase-2 topic list with ਹੋਣਾ, pronouns and SOV order written now;
      dictionary searches the existing vocabulary by Gurmukhi, roman and English.

**Verify:** fresh profile → onboarding → recommended lesson → complete lessons 1–5 →
homepage and progress reflect it; search "water", "paani" and "ਪਾਣੀ" all find ਪਾਣੀ.

---

## Milestone 5 — Polish and accessibility

- [ ] Responsive audit at 360px / 768px / 1280px; no horizontal scroll; comfortable tap
      targets; bottom nav on mobile.
- [ ] Dark mode audit on every screen; contrast checked; Gurmukhi legible in both themes.
- [ ] Keyboard navigation and screen-reader labels through a full lesson; motion kept
      minimal and `prefers-reduced-motion` respected.
- [ ] Empty, loading and error states; silence handled by hiding controls, not apologising.
- [ ] `README.md` (run, build, architecture) and `content/CONTRIBUTING.md` explaining how
      to correct a Punjabi entry — the brief's "mistakes must be easy to fix" requirement.
- [ ] Final content review pass over all Gurmukhi strings actually shipped.

**Verify:** `npm run build` and `npm run lint` clean; full beginner run-through on a
narrow viewport in dark mode.

---

## Later phases (planned, not built in this pass)

- **Phase 2** — full SRS scheduler with mixed card types, complete dictionary + related
  words, full grammar course (pronouns, gender, plurals, postpositions, verb tenses,
  ਹੋਣਾ, questions, negation, ਤੂੰ vs ਤੁਸੀਂ), reading-trainer levels 6–7, vocabulary
  expansion to 1,000–2,000, recorded audio for every entry.
- **Phase 3** — listening course levels 1–5, typing trainer with speed/accuracy stats,
  pronunciation section with minimal pairs and tongue-placement notes, reading library
  with narration, heritage-speaker pathway, cultural lessons, formal vs spoken Punjabi.
- **Phase 4** — speech recognition for pronunciation checking, extended conversations,
  personalised scheduling, React Native app reusing `content/` and `lib/`.

---

## Risks and how this plan handles them

| Risk | Mitigation |
|---|---|
| Inaccurate Punjabi content | Zod-validated data files, a dedicated accuracy pass per milestone, `SOURCES.md`, flagged-entry field, and content isolated from code so fixes are one-line |
| TTS mispronounces Punjabi | Resolved by removing it. Audio stays behind a service and every entry keeps an `audio` URL field, so recorded files drop in without component changes; until then nothing plays and nothing pretends to |
| Breadth over polish | Phase 1 only; the first ~20 lessons are finished properly before any Phase 2 feature starts |
| UI creeping toward clutter | Nav fixed at 7 items; homepage capped at three blocks; no streaks, badges or mascots |
