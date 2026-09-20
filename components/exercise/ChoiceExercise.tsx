"use client";

import { AudioButton } from "@/components/ui/AudioButton";
import { OptionButton, type OptionState } from "./OptionButton";
import { Prompt } from "./Prompt";
import { optionsOf, normaliseAnswer } from "@/lib/exercises";
import type { ExerciseProps } from "./types";
import type { Exercise } from "@/content/schema";

type Choice = Extract<Exercise, { type: "choice" }>;

/** Multiple choice, and the Gurmukhi recognition drill, which is the same thing. */
export function ChoiceExercise({
  exercise,
  given,
  result,
  onSubmit,
}: ExerciseProps<Choice>) {
  const options = optionsOf(exercise);
  const answered = result !== null;

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

      {exercise.subject ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface-2 px-4 py-8">
          {exercise.subjectScript === "gurmukhi" ? (
            <>
              <p className="pa-hero" lang="pa">
                {exercise.subject}
              </p>
              <AudioButton label={exercise.subject} />
            </>
          ) : (
            <p className="text-2xl font-medium sm:text-3xl">{exercise.subject}</p>
          )}
        </div>
      ) : null}

      <div className="grid gap-2.5">
        {options.map((option) => (
          <OptionButton
            key={option}
            state={stateOf(option)}
            disabled={answered}
            onClick={() => onSubmit(option)}
          >
            {exercise.optionScript === "gurmukhi" ? (
              <span className="pa-md" lang="pa">
                {option}
              </span>
            ) : (
              <span>{option}</span>
            )}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
