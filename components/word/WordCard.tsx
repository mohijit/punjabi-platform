"use client";

import { AudioButton } from "@/components/ui/AudioButton";
import { toggleSavedWord, useProgress } from "@/lib/progress";
import type { Word } from "@/content/schema";

/**
 * One vocabulary entry, everywhere it appears.
 *
 * The example sentence is not decoration: a word on its own is a label, and
 * the brief's whole complaint about vocabulary apps is that they stop there.
 */
export function WordCard({ word }: { word: Word }) {
  const saved = useProgress().savedWords.includes(word.gurmukhi);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="pa-md" lang="pa">
            {word.gurmukhi}
          </p>
          <p className="roman text-sm">{word.roman}</p>
          <p className="mt-1">{word.english}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <AudioButton text={word.gurmukhi} audio={word.audio} label={word.roman} />
          <button
            type="button"
            onClick={() => toggleSavedWord(word.gurmukhi)}
            aria-pressed={saved}
            title={saved ? "Saved" : "Save this word"}
            className={[
              "rounded-lg px-2 py-1 text-sm transition-colors",
              saved ? "text-accent" : "text-text-faint hover:text-text",
            ].join(" ")}
          >
            {saved ? "★" : "☆"}
            <span className="sr-only">{saved ? "Saved" : "Save this word"}</span>
          </button>
        </div>
      </div>

      {word.note ? <p className="mt-3 text-sm text-text-muted">{word.note}</p> : null}

      <div className="mt-4 border-t border-border pt-3 text-sm">
        <p className="pa" lang="pa">
          {word.example}
        </p>
        <p className="roman">{word.exampleRoman}</p>
        <p className="text-text-muted">{word.exampleEnglish}</p>
      </div>
    </div>
  );
}
