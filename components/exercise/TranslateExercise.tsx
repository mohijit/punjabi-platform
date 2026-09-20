"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GurmukhiKeyboard } from "@/components/gurmukhi/GurmukhiKeyboard";
import { Prompt } from "./Prompt";
import type { ExerciseProps } from "./types";
import type { Exercise } from "@/content/schema";

type Translate = Extract<Exercise, { type: "translate" }>;

/**
 * English in, Punjabi out — the production exercise. This is the hardest type
 * and the one that shows a learner can use the language rather than only
 * recognise it, so it comes late in a lesson, after recognition and recall.
 */
export function TranslateExercise({ exercise, result, onSubmit }: ExerciseProps<Translate>) {
  const [text, setText] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(true);
  const answered = result !== null;

  function submit() {
    if (answered || text.trim() === "") return;
    onSubmit(text);
  }

  return (
    <div className="space-y-5">
      <Prompt>{exercise.prompt}</Prompt>

      <p className="rounded-2xl border border-border bg-surface-2 px-4 py-6 text-center text-xl">
        {exercise.english}
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={answered}
          lang="pa"
          inputMode={keyboardOpen ? "none" : "text"}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Your answer in Gurmukhi"
          className={[
            "pa-md w-full rounded-2xl border bg-surface px-4 py-4 text-center outline-none",
            answered
              ? result.correct
                ? "border-correct bg-correct-soft"
                : "border-incorrect bg-incorrect-soft"
              : "border-border focus:border-border-strong",
          ].join(" ")}
        />
      </form>

      {!answered ? (
        <>
          <button
            type="button"
            onClick={() => setKeyboardOpen((open) => !open)}
            className="text-sm text-text-muted underline underline-offset-4 hover:text-text"
          >
            {keyboardOpen ? "Hide the Gurmukhi keyboard" : "Show the Gurmukhi keyboard"}
          </button>

          {keyboardOpen ? (
            <GurmukhiKeyboard
              onKey={(character) => setText((current) => current + character)}
              onSpace={() => setText((current) => current + " ")}
              onBackspace={() => setText((current) => [...current].slice(0, -1).join(""))}
            />
          ) : null}

          <Button size="lg" className="w-full" disabled={text.trim() === ""} onClick={submit}>
            Check
          </Button>
        </>
      ) : null}
    </div>
  );
}
