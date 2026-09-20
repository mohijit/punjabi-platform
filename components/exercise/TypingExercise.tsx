"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GurmukhiKeyboard } from "@/components/gurmukhi/GurmukhiKeyboard";
import { Prompt } from "./Prompt";
import type { ExerciseProps } from "./types";
import type { Exercise } from "@/content/schema";

type Typing = Extract<Exercise, { type: "typing" }>;

/**
 * Type the word in Gurmukhi. The on-screen keyboard is shown by default —
 * almost nobody has a Gurmukhi layout installed — but the field is a normal
 * input, so anyone who does can simply type.
 */
export function TypingExercise({ exercise, result, onSubmit }: ExerciseProps<Typing>) {
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

      {exercise.hint ? <p className="text-text-muted">{exercise.hint}</p> : null}

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
            "pa-lg w-full rounded-2xl border bg-surface px-4 py-5 text-center outline-none",
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
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setKeyboardOpen((open) => !open)}
              className="text-sm text-text-muted underline underline-offset-4 hover:text-text"
            >
              {keyboardOpen ? "Hide the Gurmukhi keyboard" : "Show the Gurmukhi keyboard"}
            </button>
            {text ? (
              <button
                type="button"
                onClick={() => setText("")}
                className="text-sm text-text-muted hover:text-text"
              >
                Clear
              </button>
            ) : null}
          </div>

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
