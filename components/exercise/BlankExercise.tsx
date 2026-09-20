"use client";

import { OptionButton, type OptionState } from "./OptionButton";
import { Prompt } from "./Prompt";
import { optionsOf, normaliseAnswer } from "@/lib/exercises";
import { AudioButton } from "@/components/ui/AudioButton";
import type { ExerciseProps } from "./types";
import type { Exercise } from "@/content/schema";

type Blank = Extract<Exercise, { type: "blank" }>;

const GAP = "___";

/**
 * Fill in the blank. The sentence is shown with the gap in place and, once
 * answered, with the answer written into it — so the learner reads the whole
 * correct sentence rather than a word floating on its own.
 */
export function BlankExercise({ exercise, given, result, onSubmit }: ExerciseProps<Blank>) {
  const options = optionsOf(exercise);
  const answered = result !== null;
  const filled = answered ? exercise.sentence.replace(GAP, exercise.answer) : null;
  const [before, after] = exercise.sentence.split(GAP);

  function stateOf(option: string): OptionState {
    if (!answered) return "idle";
    const isChosen = normaliseAnswer(option) === normaliseAnswer(String(given));
    const isAnswer = normaliseAnswer(option) === normaliseAnswer(exercise.answer);
    if (isChosen) return isAnswer ? "chosen-correct" : "chosen-wrong";
    if (isAnswer) return "revealed";
    return "idle";
  }

  return (
    <div className="space-y-6">
      <Prompt>{exercise.prompt}</Prompt>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface-2 px-4 py-7">
        <p className="pa-lg text-center" lang="pa">
          {answered ? (
            filled
          ) : (
            <>
              {before}
              <span className="mx-1 inline-block min-w-16 border-b-2 border-dashed border-text-faint align-middle" />
              {after}
            </>
          )}
        </p>
        <p className="text-sm text-text-muted">{exercise.english}</p>
        {answered && filled ? <AudioButton size="sm" label="the sentence" /> : null}
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {options.map((option) => (
          <OptionButton
            key={option}
            state={stateOf(option)}
            disabled={answered}
            onClick={() => onSubmit(option)}
          >
            <span className="pa-md" lang="pa">
              {option}
            </span>
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
