"use client";

import { useState } from "react";
import { letters, vowels, symbols } from "@/content";

/**
 * An on-screen Gurmukhi keyboard, so a learner can type Punjabi without
 * installing a keyboard layout first. The keys come from the content data, not
 * from a hard-coded list, so they stay in step with what is taught.
 *
 * It is split into three short panels rather than one 60-key wall: vowel signs
 * and marks are what people actually hunt for, and burying them under the
 * consonants is what makes every other on-screen Indic keyboard unusable.
 */

type Panel = "letters" | "vowels" | "marks";

const PANELS: { id: Panel; label: string }[] = [
  { id: "letters", label: "Letters" },
  { id: "vowels", label: "Vowel signs" },
  { id: "marks", label: "Marks" },
];

export function GurmukhiKeyboard({
  onKey,
  onBackspace,
  onSpace,
}: {
  onKey: (character: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
}) {
  const [panel, setPanel] = useState<Panel>("letters");

  const keys: { character: string; label: string; hint?: string }[] =
    panel === "letters"
      ? letters.map((letter) => ({
          character: letter.letter,
          label: letter.letter,
          hint: letter.name,
        }))
      : panel === "vowels"
        ? vowels
            .filter((vowel) => vowel.sign !== "")
            .map((vowel) => ({
              // A lone vowel sign has nothing to attach to, so it is shown on a
              // dotted circle the way Unicode charts do.
              character: vowel.sign,
              label: "◌" + vowel.sign,
              hint: vowel.name,
            }))
        : symbols
            .filter((symbol) => symbol.symbol.length === 1)
            .map((symbol) => ({
              character: symbol.symbol,
              label: "◌" + symbol.symbol,
              hint: symbol.name,
            }));

  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-3">
      <div className="mb-3 flex gap-1.5">
        {PANELS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setPanel(entry.id)}
            aria-pressed={panel === entry.id}
            className={[
              "rounded-lg px-3 py-1.5 text-sm transition-colors",
              panel === entry.id
                ? "bg-accent text-accent-text"
                : "text-text-muted hover:bg-surface hover:text-text",
            ].join(" ")}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1.5">
        {keys.map((key) => (
          <button
            key={key.character + key.label}
            type="button"
            onClick={() => onKey(key.character)}
            title={key.hint}
            aria-label={key.hint ?? key.character}
            className="flex h-12 items-center justify-center rounded-lg border border-border bg-surface transition-colors hover:border-border-strong hover:bg-surface-2"
          >
            <span className="pa" lang="pa">
              {key.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-2 flex gap-1.5">
        <button
          type="button"
          onClick={onSpace}
          className="h-11 flex-1 rounded-lg border border-border bg-surface text-sm transition-colors hover:bg-surface-2"
        >
          Space
        </button>
        <button
          type="button"
          onClick={onBackspace}
          aria-label="Backspace"
          className="h-11 w-20 rounded-lg border border-border bg-surface text-sm transition-colors hover:bg-surface-2"
        >
          &#x232B;
        </button>
      </div>
    </div>
  );
}
