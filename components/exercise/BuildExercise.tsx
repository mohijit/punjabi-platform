"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Prompt } from "./Prompt";
import { optionsOf } from "@/lib/exercises";
import type { ExerciseProps } from "./types";
import type { Exercise } from "@/content/schema";

type Build = Extract<Exercise, { type: "build" }>;

/**
 * Arrange word tiles into a sentence. This is the exercise that teaches word
 * order, so the distractors matter: a pile containing only the right words in
 * the wrong order is a jigsaw, not a grammar question.
 */
export function BuildExercise({ exercise, result, onSubmit }: ExerciseProps<Build>) {
  const tiles = optionsOf(exercise);
  const [placed, setPlaced] = useState<number[]>([]);
  const answered = result !== null;

  const used = new Set(placed);

  function place(index: number) {
    if (answered) return;
    setPlaced((current) => [...current, index]);
  }

  function removeAt(position: number) {
    if (answered) return;
    setPlaced((current) => current.filter((_, i) => i !== position));
  }

  return (
    <div className="space-y-6">
      <Prompt>{exercise.prompt}</Prompt>

      <p className="rounded-xl bg-surface-2 px-4 py-3 text-center text-text-muted">
        {exercise.english}
      </p>

      {/* The line being built. Always rendered, so the box does not jump. */}
      <div
        className={[
          "flex min-h-20 flex-wrap content-start items-start gap-2 rounded-2xl border p-3",
          answered
            ? result.correct
              ? "border-correct bg-correct-soft"
              : "border-incorrect bg-incorrect-soft"
            : "border-border border-dashed bg-surface",
        ].join(" ")}
      >
        {placed.length === 0 ? (
          <p className="px-1 py-3 text-sm text-text-faint">
            Tap the words below, in order
          </p>
        ) : (
          placed.map((tileIndex, position) => (
            <button
              key={String(position) + tiles[tileIndex]}
              type="button"
              onClick={() => removeAt(position)}
              disabled={answered}
              aria-label={"Remove " + tiles[tileIndex]}
              className="rounded-lg border border-border-strong bg-surface px-3 py-2 disabled:pointer-events-none"
            >
              <span className="pa" lang="pa">
                {tiles[tileIndex]}
              </span>
            </button>
          ))
        )}
      </div>

      {/* The pile to choose from. Tiles stay in place once used, so the layout
          never reflows under the learner's finger. */}
      <div className="flex flex-wrap gap-2">
        {tiles.map((tile, index) => (
          <button
            key={String(index) + tile}
            type="button"
            onClick={() => place(index)}
            disabled={answered || used.has(index)}
            className={[
              "rounded-lg border px-3 py-2 transition-colors",
              used.has(index)
                ? "invisible"
                : "border-border bg-surface hover:border-border-strong hover:bg-surface-2",
              "disabled:pointer-events-none",
            ].join(" ")}
          >
            <span className="pa" lang="pa">
              {tile}
            </span>
          </button>
        ))}
      </div>

      {!answered ? (
        <Button
          size="lg"
          className="w-full"
          disabled={placed.length === 0}
          onClick={() => onSubmit(placed.map((index) => tiles[index]))}
        >
          Check
        </Button>
      ) : null}
    </div>
  );
}
