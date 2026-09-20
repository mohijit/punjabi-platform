"use client";

import { AudioButton } from "@/components/ui/AudioButton";
import { Punjabi } from "@/components/word/Punjabi";
import { SentenceExplorer } from "@/components/word/SentenceExplorer";
import { getLetter, getWord, getSentence } from "@/content";
import type { LessonStep } from "@/content/schema";

/**
 * The non-exercise steps: the teaching half of a lesson.
 *
 * Each one looks up its content by id at render time. A lesson file therefore
 * says "introduce these three words", not "here are three words" — so a
 * correction to a word is made once, in the vocabulary file, and every lesson
 * that teaches it is fixed at the same time.
 */

function MissingContent({ what, ids }: { what: string; ids: string[] }) {
  return (
    <p className="rounded-xl border border-incorrect bg-incorrect-soft p-4 text-sm text-incorrect">
      This lesson refers to {what} that is not in the content files: {ids.join(", ")}.
    </p>
  );
}

export function ExplainStep({ step }: { step: Extract<LessonStep, { type: "explain" }> }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium sm:text-2xl">{step.title}</h2>

      {step.display ? (
        <div className="rounded-2xl border border-border bg-surface-2 px-4 py-8">
          <Punjabi
            gurmukhi={step.display}
            roman={step.displayRoman}
            english={step.displayEnglish}
            size="xl"
            alwaysGurmukhi
          >
            <div className="pt-2">
              <AudioButton text={step.display} label={step.displayRoman} />
            </div>
          </Punjabi>
        </div>
      ) : null}

      <div className="space-y-4 text-[1.0625rem] leading-relaxed text-text-muted">
        {step.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

export function LettersStep({ step }: { step: Extract<LessonStep, { type: "letters" }> }) {
  const found = step.letters.map((character) => ({ character, letter: getLetter(character) }));
  const missing = found.filter((entry) => !entry.letter).map((entry) => entry.character);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-medium sm:text-2xl">{step.title}</h2>
      {step.intro ? <p className="text-text-muted">{step.intro}</p> : null}
      {missing.length > 0 ? <MissingContent what="letters" ids={missing} /> : null}

      <div className="grid gap-3">
        {found.map(({ letter }) =>
          letter ? (
            <div
              key={letter.letter}
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4"
            >
              <span className="pa-xl w-20 shrink-0 text-center" lang="pa">
                {letter.letter}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{letter.name}</p>
                <p className="text-sm text-text-muted">{letter.sound}</p>
                <p className="mt-1.5 text-sm">
                  <span className="pa" lang="pa">
                    {letter.example.gurmukhi}
                  </span>
                  <span className="roman ml-2">{letter.example.roman}</span>
                  <span className="ml-2 text-text-muted">{letter.example.english}</span>
                </p>
              </div>
              <AudioButton text={letter.letter} audio={letter.audio} label={letter.name} />
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}

export function VocabStep({ step }: { step: Extract<LessonStep, { type: "vocab" }> }) {
  const found = step.words.map((gurmukhi) => ({ gurmukhi, word: getWord(gurmukhi) }));
  const missing = found.filter((entry) => !entry.word).map((entry) => entry.gurmukhi);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-medium sm:text-2xl">{step.title}</h2>
      {step.intro ? <p className="text-text-muted">{step.intro}</p> : null}
      {missing.length > 0 ? <MissingContent what="words" ids={missing} /> : null}

      <div className="grid gap-3">
        {found.map(({ word }) =>
          word ? (
            <div
              key={word.gurmukhi}
              className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="pa-md" lang="pa">
                  {word.gurmukhi}
                </p>
                <p className="roman text-sm">{word.roman}</p>
                <p className="mt-1 text-[0.95rem]">{word.english}</p>
                {word.note ? (
                  <p className="mt-2 text-sm text-text-muted">{word.note}</p>
                ) : null}
              </div>
              <AudioButton text={word.gurmukhi} audio={word.audio} label={word.roman} />
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}

export function SentenceStep({ step }: { step: Extract<LessonStep, { type: "sentence" }> }) {
  const found = step.sentences.map((id) => ({ id, sentence: getSentence(id) }));
  const missing = found.filter((entry) => !entry.sentence).map((entry) => entry.id);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-medium sm:text-2xl">{step.title}</h2>
      {step.intro ? <p className="text-text-muted">{step.intro}</p> : null}
      {missing.length > 0 ? <MissingContent what="sentences" ids={missing} /> : null}

      <div className="grid gap-4">
        {found.map(({ sentence }) =>
          sentence ? <SentenceExplorer key={sentence.id} sentence={sentence} /> : null,
        )}
      </div>
    </div>
  );
}
