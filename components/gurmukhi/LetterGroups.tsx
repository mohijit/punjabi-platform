"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { GROUP_LABELS } from "./LetterTile";
import { LetterCard } from "./LetterCard";
import { lettersByGroup } from "@/content";
import type { Letter } from "@/content/schema";

/**
 * The letters, met a row at a time.
 *
 * The traditional order is not arbitrary: each row is a place in the mouth,
 * and the four or five letters in it differ only in breath and voice. Meeting
 * them together is what makes ਕ ਖ ਗ ਘ four related sounds rather than four
 * unrelated shapes — and five letters is a sitting, where forty-one is a wall.
 */

const groups = lettersByGroup();

/** What the row has in common, said once at the top of it. */
const GROUP_NOTES: Record<string, string> = {
  carriers: "These three make no sound of their own. They exist to hold a vowel at the start of a word.",
  fricatives: "Two letters that sit on their own, before the rows proper begin.",
  velars: "All five are made at the back of the mouth. What changes along the row is breath and tone, not position.",
  palatals: "The middle of the tongue against the roof of the mouth. Same pattern as the row before it.",
  retroflexes: "The tongue curls back and taps behind the ridge. These have no English equivalent and are worth slowing down for.",
  dentals: "The tongue touches the back of the teeth — further forward than any English t or d.",
  labials: "Made with the lips, and the easiest row for an English speaker.",
  sonorants: "The leftovers, and some of the most common letters in the language.",
  extra: "A dot underneath changes the sound. These came into Punjabi with Persian and Arabic words.",
};

export function LetterGroups() {
  const [active, setActive] = useState<{ group: string; letters: Letter[] } | null>(null);
  const [position, setPosition] = useState(0);

  if (active === null) {
    return (
      <div className="space-y-3">
        {groups.map((entry) => (
          <button
            key={entry.group}
            type="button"
            onClick={() => {
              setActive(entry);
              setPosition(0);
            }}
            className="block w-full rounded-2xl border border-border bg-surface p-5 text-left transition-colors hover:border-border-strong hover:bg-surface-2 sm:p-6"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-medium">{GROUP_LABELS[entry.group] ?? entry.group}</h2>
              <span className="shrink-0 text-sm text-text-faint">
                {entry.letters.length} letters
              </span>
            </div>
            <p className="pa-md mt-2 leading-none" lang="pa">
              {entry.letters.map((letter) => letter.letter).join(" ")}
            </p>
            <p className="mt-3 max-w-prose text-sm text-text-muted">
              {GROUP_NOTES[entry.group]}
            </p>
          </button>
        ))}
      </div>
    );
  }

  const letter = active.letters[position];
  const last = position === active.letters.length - 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setActive(null)}
          className="shrink-0 text-sm text-text-muted transition-colors hover:text-text"
        >
          ← Rows
        </button>
        <div className="flex-1">
          <ProgressBar value={position + 1} total={active.letters.length} />
        </div>
        <span className="shrink-0 text-sm tabular-nums text-text-faint">
          {position + 1}/{active.letters.length}
        </span>
      </div>

      <p className="text-center text-sm text-text-muted">
        {GROUP_LABELS[active.group] ?? active.group} — {GROUP_NOTES[active.group]}
      </p>

      <LetterCard letter={letter} />

      <div className="grid gap-2.5 sm:grid-cols-2">
        <Button
          variant="secondary"
          size="lg"
          disabled={position === 0}
          onClick={() => setPosition(position - 1)}
        >
          Back
        </Button>
        {last ? (
          <Button size="lg" onClick={() => setActive(null)}>
            Done with this row
          </Button>
        ) : (
          <Button size="lg" onClick={() => setPosition(position + 1)}>
            Next letter
          </Button>
        )}
      </div>

      {last ? (
        <p className="text-center text-sm text-text-muted">
          Recognising a letter here and reading it in a word are different skills.{" "}
          <ButtonLink href="/gurmukhi/reading" variant="quiet" size="sm">
            Practise reading these
          </ButtonLink>
        </p>
      ) : null}
    </div>
  );
}
