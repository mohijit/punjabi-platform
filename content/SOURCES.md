# Sources and accuracy notes

Every Punjabi string in `content/` is checked before it ships. This file records
where the data came from, the choices that are deliberate, and anything still
flagged for review. If you spot a mistake, see `content/CONTRIBUTING.md` — a
correction is a one-line edit to a data file, never a code change.

## References used

| Area | Source |
|---|---|
| Letter inventory, traditional order, letter names | Wikipedia, *Gurmukhi* and *Gurmukhi alphabet* |
| Vowel signs (ਲਗਾਂ ਮਾਤਰਾਂ), names and positions | Wikipedia, *Gurmukhi*; cross-checked against the ਕ series |
| ਬਿੰਦੀ / ਟਿੱਪੀ / ਅੱਧਕ / pairī̃ forms | Wikipedia, *Gurmukhi*; example words checked individually |
| Unicode behaviour (nukta, virama, normalisation) | Unicode Standard, Gurmukhi block U+0A00–U+0A7F |

## Facts most beginner resources get wrong, and which are stated correctly here

- **ਘ ਝ ਢ ਧ ਭ are not voiced aspirates in modern Punjabi.** They are tonal: the
  consonant is heard as its unvoiced counterpart with a low tone on the vowel.
  The letter data says so rather than teaching "gh" as in *doghouse*.
- **ਙ ਞ ਣ ੜ never begin a word.** Their entries carry an example that shows the
  sound inside a word, with `exampleShowsSoundOnly: true` where the example does
  not literally contain the letter (ਙ and ਞ, whose sounds normally appear
  written with ਟਿੱਪੀ). `scripts/check-content.mjs` enforces the rule for every
  other letter.
- **Sihari (ਿ) is written before the consonant but spoken after it.** ਕਿ is *ki*,
  never *ik*. This is called out explicitly in the vowel data.
- **ਫ is not an f.** The f sound is ਫ਼, with a dot beneath.

## Romanisation scheme

The scheme matches the brief: `maĩ`, `tusī̃`, `pāṇī`, `pañjābī`. Long vowels take
a macron, retroflex letters a dot below, nasalised vowels a tilde. The six nukta
letters are `ś x ġ z f ḷ`.

`x` for ਖ਼ and `ġ` for ਗ਼ are the standard scholarly values and are used here
because the obvious alternatives (`kh`, `gh`) already belong to ਖ and ਘ — the
whole point of the transliteration is that it maps back to one spelling. Every
letter card also gives the sound in plain English, so the learner never has to
decode a diacritic to know what to say.

**The hand-written `roman` field in a content entry always wins.**
`lib/transliteration` exists for text with no hand-written form (reading-trainer
syllables, dictionary search). `scripts/check-content.mjs` compares the two and
reports any disagreement, which is how the engine's nukta and subjoined-letter
bugs were found.

## Unicode notes

- The six pairī̃ bindī letters (ਸ਼ ਖ਼ ਗ਼ ਜ਼ ਫ਼ ਲ਼) have single precomposed codepoints,
  but those are in the composition exclusion table, so **NFC decomposes them**
  into base + nukta (U+0A3C). `lib/transliteration` recomposes them explicitly
  by codepoint; the table is written with `String.fromCharCode` rather than
  pasted characters, because a pasted ਸ਼ is indistinguishable by eye from ਸ + ਼.
- ਉ ਊ ਓ are single codepoints, not ੳ plus a sign — likewise ਇ ਈ ਏ on ੲ and
  ਆ ਐ ਔ on ਅ. The content checker knows this, which is why the carriers' example
  words pass without containing the carrier character itself.
- Addak (ੱ) is written *before* the consonant it doubles. `toClusters` attaches
  it forward so a tapped cluster is a meaningful unit: ਸਿੱਖ is ਸਿ + ੱਖ.

## Flagged for review

Nothing is currently flagged. Entries needing a native-speaker check should be
noted here with the file, the entry id and the specific doubt.

## Verification

`npm run check` runs three passes:

1. `tsc --noEmit` — types.
2. `scripts/check-transliteration.mjs` — 27 hand-checked words plus search-key
   and cluster cases.
3. `scripts/check-content.mjs` — schema validation of every entry, plus
   cross-checks: letter counts, unique ordering, a letter appearing in its own
   example, `ਕ` + sign matching each vowel's written form, symbol examples
   actually containing their mark, sound groups resolving to real letters, and
   hand-written romanisation agreeing with the engine.
