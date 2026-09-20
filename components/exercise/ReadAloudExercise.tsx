"use client";

import { AudioButton } from "@/components/ui/AudioButton";
import { Button } from "@/components/ui/Button";
import { Punjabi } from "@/components/word/Punjabi";
import { Prompt } from "./Prompt";
import type { ExerciseProps } from "./types";
import type { Exercise } from "@/content/schema";

type ReadAloud = Extract<Exercise, { type: "read-aloud" }>;

/**
 * Say it out loud, then hear it and mark yourself.
 *
 * There is no microphone here, and the app does not pretend otherwise: speech
 * recognition is Phase 4, and a made-up score would teach a learner to trust a
 * number that means nothing. Because it is self-marked, this exercise never
 * counts towards a lesson accuracy figure.
 */
export function ReadAloudExercise({ exercise, result, onSubmit }: ExerciseProps<ReadAloud>) {
  const answered = result !== null;

  return (
    <div className="space-y-6">
      <Prompt>{exercise.prompt}</Prompt>

      <div className="rounded-2xl border border-border bg-surface-2 px-4 py-8">
        <Punjabi
          gurmukhi={exercise.text}
          roman={exercise.roman}
          english={exercise.english}
          size="xl"
          alwaysGurmukhi
        />
      </div>

      {!answered ? (
        <div className="space-y-3">
          <p className="text-center text-text-muted">
            Read it aloud, then listen and compare.
          </p>
          <div className="flex justify-center">
            <AudioButton
              text={exercise.text}
              audio={exercise.audio}
              size="lg"
              label={exercise.roman}
            />
          </div>
          <div className="grid gap-2.5 pt-2 sm:grid-cols-2">
            <Button variant="secondary" size="lg" onClick={() => onSubmit("retry")}>
              Not yet
            </Button>
            <Button size="lg" onClick={() => onSubmit("yes")}>
              I said it
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
