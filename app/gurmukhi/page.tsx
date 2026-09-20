import type { Metadata } from "next";
import { AudioButton } from "@/components/ui/AudioButton";
import { Card, CardLink, SectionHeading } from "@/components/ui/Card";
import { GROUP_LABELS, LetterTile } from "@/components/gurmukhi/LetterTile";
import { contentCounts, lettersByGroup, symbols, vowels } from "@/content";

export const metadata: Metadata = {
  title: "Gurmukhi — Learn Punjabi",
  description:
    "The 35 painti, the six pairī̃ bindī letters, the ten laga matra and the marks that go with them.",
};

/**
 * The script, all in one place: letters by row, the vowel signs shown on one
 * consonant so the pattern is visible, then the marks.
 *
 * This is the reference. The taught version — small groups, tracing, sound
 * drills and the reading trainer — is built on the same data.
 */
export default function GurmukhiPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-14 px-4 py-10">
      <header>
        <h1 className="text-2xl font-medium">Gurmukhi</h1>
        <p className="mt-2 max-w-prose text-text-muted">
          Gurmukhi is written left to right, and almost everything is spelled the way it
          sounds. {contentCounts.painti} letters, {contentCounts.extraLetters} more with a
          dot underneath, and {contentCounts.vowels} vowel signs that hang off them. That is
          the whole system.
        </p>
      </header>

      <section>
        <SectionHeading hint="start here">Before the letters</SectionHeading>
        <CardLink href="/gurmukhi/script">
          <h3 className="font-medium">How the script works</h3>
          <p className="mt-1 max-w-prose text-sm text-text-muted">
            {contentCounts.scriptNotes} short ideas that make the letters far easier: the
            line along the top, the vowel that is already inside every consonant, where the
            signs hang, and why the small marks change the word.
          </p>
          <p className="mt-3 text-sm text-text-faint">Nothing to memorise</p>
        </CardLink>
      </section>

      <section>
        <SectionHeading hint="the point of all this">Reading</SectionHeading>
        <CardLink href="/gurmukhi/reading">
          <h3 className="font-medium">Reading trainer</h3>
          <p className="mt-1 max-w-prose text-sm text-text-muted">
            Five levels, letters through to whole sentences. Knowing the letters and
            reading Punjabi are two different skills; this is where the second one is
            practised, with the transliteration switched off when you are ready.
          </p>
          <p className="mt-3 text-sm text-text-faint">
            {contentCounts.readingItems} items across {contentCounts.readingLevels} levels
          </p>
        </CardLink>
      </section>

      <section>
        <SectionHeading hint="a row at a sitting">Learning them</SectionHeading>
        <CardLink href="/gurmukhi/letters">
          <h3 className="font-medium">Learn the letters</h3>
          <p className="mt-1 max-w-prose text-sm text-text-muted">
            The same letters, taught a row at a time: what the row has in common, the
            sound, a word it appears in, stroke order and somewhere to write it.
          </p>
        </CardLink>
        <CardLink href="/gurmukhi/sounds" className="mt-3">
          <h3 className="font-medium">Sounds that get confused</h3>
          <p className="mt-1 max-w-prose text-sm text-text-muted">
            ਕ against ਖ, ਤ against ਟ, ਰ against ੜ — the contrasts English does not make,
            with where the tongue goes for each one.
          </p>
        </CardLink>
      </section>

      <section>
        <SectionHeading hint={`${contentCounts.letters} letters — reference`}>
          The letters
        </SectionHeading>
        <div className="space-y-8">
          {lettersByGroup().map(({ group, letters }) => (
            <div key={group}>
              <h3 className="mb-3 text-sm text-text-faint">{GROUP_LABELS[group] ?? group}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {letters.map((letter) => (
                  <LetterTile key={letter.letter} letter={letter} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading hint="shown on ਕ">The vowel signs</SectionHeading>
        <p className="mb-4 max-w-prose text-sm text-text-muted">
          Each sign is taught on the same consonant, ਕ, so what changes is only the vowel.
          Learn the ten shapes here and they work on every other letter unchanged.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {vowels.map((vowel) => (
            <div
              key={vowel.name}
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4"
            >
              <span className="pa-lg w-16 shrink-0 text-center leading-none" lang="pa">
                {vowel.onKakka}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {vowel.name} <span className="pa ml-1 text-text-muted" lang="pa">{vowel.nameGurmukhi}</span>
                </p>
                <p className="text-sm text-text-muted">{vowel.sound}</p>
                <p className="mt-1 text-sm">
                  <span className="pa" lang="pa">{vowel.example.gurmukhi}</span>
                  <span className="roman ml-2">{vowel.example.roman}</span>
                  <span className="ml-2 text-text-muted">{vowel.example.english}</span>
                </p>
              </div>
              <AudioButton audio={vowel.audio} label={vowel.name} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading>The marks</SectionHeading>
        <div className="space-y-3">
          {symbols.map((symbol) => (
            <Card key={symbol.id}>
              <div className="flex items-baseline gap-3">
                <span className="pa-md" lang="pa">{symbol.symbol}</span>
                <span className="font-medium">{symbol.name}</span>
                <span className="text-sm text-text-muted">{symbol.does}</span>
              </div>
              <p className="mt-2 max-w-prose text-sm text-text-muted">{symbol.explanation}</p>
              <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {symbol.examples.map((example) => (
                  <span key={example.gurmukhi}>
                    <span className="pa" lang="pa">{example.gurmukhi}</span>
                    <span className="roman ml-2">{example.roman}</span>
                    <span className="ml-2 text-text-muted">{example.english}</span>
                  </span>
                ))}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
