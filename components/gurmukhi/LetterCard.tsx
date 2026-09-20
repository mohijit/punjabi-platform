"use client";

import { useState } from "react";
import { AudioButton } from "@/components/ui/AudioButton";
import { TraceCanvas } from "./TraceCanvas";
import type { Letter } from "@/content/schema";

/**
 * One letter, taught rather than listed.
 *
 * The grid on the Gurmukhi page is a reference; this is the version a learner
 * meets a letter in for the first time, with the name, the sound, a word it
 * appears in, and a surface to write it on. Writing is optional and folded
 * away by default — on a phone it is genuinely useful, on a trackpad it is
 * mostly frustrating, and neither learner should be made to scroll past it.
 */
export function LetterCard({ letter }: { letter: Letter }) {
  const [writing, setWriting] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="pa-hero leading-none" lang="pa">
          {letter.letter}
        </p>
        <p className="mt-2 text-lg font-medium">
          {letter.name}
          <span className="pa ml-2 text-text-muted" lang="pa">
            {letter.nameGurmukhi}
          </span>
        </p>
        <p className="max-w-prose text-text-muted">{letter.sound}</p>
        <p className="text-sm text-text-faint">
          {letter.ipa !== "—" ? <span className="mr-3">IPA {letter.ipa}</span> : null}
          {letter.rare ? <span className="mr-3">rare — recognise it, do not drill it</span> : null}
          {letter.neverInitial ? <span>never starts a word</span> : null}
        </p>
        <AudioButton audio={letter.audio} label={letter.name} />
      </div>

      {letter.note ? (
        <p className="mx-auto mt-5 max-w-prose text-center text-sm text-text-muted">
          {letter.note}
        </p>
      ) : null}

      <div className="mt-6 rounded-xl bg-surface-2 px-4 py-4 text-center">
        <p className="text-xs uppercase tracking-[0.12em] text-text-faint">
          {letter.exampleShowsSoundOnly ? "The sound, in a word" : "In a word"}
        </p>
        <p className="mt-2">
          <span className="pa-md" lang="pa">
            {letter.example.gurmukhi}
          </span>
        </p>
        <p className="mt-1 text-sm">
          <span className="roman">{letter.example.roman}</span>
          <span className="ml-2 text-text-muted">{letter.example.english}</span>
        </p>
      </div>

      <div className="mt-6">
        {writing ? (
          <TraceCanvas letter={letter.letter} guide={letter.strokeGuide} />
        ) : (
          <p className="text-center text-sm text-text-muted">{letter.strokeGuide}</p>
        )}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setWriting(!writing)}
            className="text-sm text-text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
          >
            {writing ? "Hide the writing area" : "Write it"}
          </button>
        </div>
      </div>
    </div>
  );
}
