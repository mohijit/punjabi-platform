"use client";

import { useState } from "react";
import { AudioButton } from "@/components/ui/AudioButton";
import { useSettings } from "@/lib/settings";
import type { Sentence } from "@/content/schema";

/**
 * A sentence you can take apart.
 *
 * This is the answer to the second problem the course exists to solve: learners
 * who memorise words but never find out how a sentence is put together. Tapping
 * a word shows what it means *and* what job it is doing, and the literal
 * word-for-word line is shown next to the natural English so the Punjabi word
 * order is visible rather than hidden by a fluent translation.
 */
export function SentenceExplorer({
  sentence,
  defaultOpen = false,
}: {
  sentence: Sentence;
  /** Opens the literal reading immediately, for the first sentences a learner meets. */
  defaultOpen?: boolean;
}) {
  const { scriptMode, showTransliteration } = useSettings();
  const [selected, setSelected] = useState<number | null>(null);
  const [showLiteral, setShowLiteral] = useState(defaultOpen);

  const romanVisible = scriptMode !== "gurmukhi" || showTransliteration;
  const token = selected === null ? null : sentence.tokens[selected];

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-end gap-x-2 gap-y-3">
          {sentence.tokens.map((item, index) => {
            const active = selected === index;
            return (
              <button
                key={item.gurmukhi + index}
                type="button"
                onClick={() => setSelected(active ? null : index)}
                aria-pressed={active}
                className={[
                  "-mx-0.5 rounded-lg px-1.5 py-0.5 text-left transition-colors",
                  active
                    ? "bg-accent-soft text-accent"
                    : "hover:bg-surface-2 focus-visible:bg-surface-2",
                ].join(" ")}
              >
                <span className="pa-md block leading-tight" lang="pa">
                  {item.gurmukhi}
                </span>
                {romanVisible ? (
                  <span className="roman block text-xs">{item.roman}</span>
                ) : null}
              </button>
            );
          })}
        </div>
        <AudioButton audio={sentence.audio} label={sentence.roman} />
      </div>

      <p className="mt-4 text-[0.95rem]">{sentence.english}</p>

      {token ? (
        <div className="mt-3 rounded-xl bg-surface-2 px-4 py-3 text-sm" role="status" aria-live="polite">
          <p>
            <span className="pa" lang="pa">
              {token.gurmukhi}
            </span>
            <span className="roman mx-2">{token.roman}</span>
            <span className="font-medium">{token.gloss}</span>
          </p>
          {token.role ? <p className="mt-1 text-text-muted">{token.role}</p> : null}
        </div>
      ) : (
        <p className="mt-2 text-xs text-text-faint">Tap any word to see what it is doing.</p>
      )}

      <div className="mt-4 border-t border-border pt-3">
        {showLiteral ? (
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-text-faint">Word for word: </span>
              <span className="italic">{sentence.literal}</span>
            </p>
            {sentence.note ? <p className="text-text-muted">{sentence.note}</p> : null}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowLiteral(true)}
            className="text-sm text-accent hover:underline"
          >
            Show it word for word
          </button>
        )}
      </div>
    </div>
  );
}
