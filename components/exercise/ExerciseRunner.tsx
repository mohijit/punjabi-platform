"use client";

import { useState } from "react";
import { ChoiceExercise } from "./ChoiceExercise";
import { ListeningExercise } from "./ListeningExercise";
import { BuildExercise } from "./BuildExercise";
import { BlankExercise } from "./BlankExercise";
import { TypingExercise } from "./TypingExercise";
import { TranslateExercise } from "./TranslateExercise";
import { ReadAloudExercise } from "./ReadAloudExercise";
import { Feedback, type Tone } from "./Feedback";
import { checkAnswer, isListening, isScored, type Answer, type Result } from "@/lib/exercises";
import { recordAnswer, recordListening } from "@/lib/progress";
import type { Exercise } from "@/content/schema";

export interface Outcome {
  /** Whether it counts towards the lesson accuracy figure at all. */
  scored: boolean;
  correct: boolean;
}

/**
 * The single place an answer is checked, recorded and reported.
 *
 * Every exercise component only collects input. Scoring, the progress write
 * and the feedback panel all live here, so the eight types cannot drift apart
 * in how they behave — and adding a ninth type means writing one component and
 * one line in the switch below.
 */
export function ExerciseRunner({
  exercise,
  onDone,
  continueLabel,
}: {
  exercise: Exercise;
  onDone: (outcome: Outcome) => void;
  continueLabel?: string;
}) {
  const [given, setGiven] = useState<Answer | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  function submit(answer: Answer) {
    if (result !== null) return;
    const checked = checkAnswer(exercise, answer);
    setGiven(answer);
    setResult(checked);

    // Progress is written the moment the answer is given, not when the lesson
    // ends, so a learner who closes the tab mid-lesson keeps what they did.
    if (exercise.tracks && isScored(exercise)) {
      recordAnswer(exercise.tracks.kind, exercise.tracks.value, checked.correct);
    }
    if (isListening(exercise)) {
      recordListening(checked.correct);
    }
  }

  const shared = { exercise, given, result, onSubmit: submit };

  const view = (() => {
    switch (exercise.type) {
      case "choice":
        return <ChoiceExercise {...shared} exercise={exercise} />;
      case "listening":
        return <ListeningExercise {...shared} exercise={exercise} />;
      case "build":
        return <BuildExercise {...shared} exercise={exercise} />;
      case "blank":
        return <BlankExercise {...shared} exercise={exercise} />;
      case "typing":
        return <TypingExercise {...shared} exercise={exercise} />;
      case "translate":
        return <TranslateExercise {...shared} exercise={exercise} />;
      case "read-aloud":
        return <ReadAloudExercise {...shared} exercise={exercise} />;
    }
  })();

  const selfMarked = !isScored(exercise);
  const tone: Tone | undefined = selfMarked ? "neutral" : undefined;
  const heading = selfMarked
    ? given === "yes"
      ? "Nicely done"
      : "Worth coming back to"
    : undefined;

  return (
    <div className="space-y-6">
      {view}
      {result ? (
        <Feedback
          result={result}
          tone={tone}
          heading={heading}
          continueLabel={continueLabel}
          onContinue={() =>
            onDone({ scored: isScored(exercise), correct: result.correct })
          }
        />
      ) : null}
    </div>
  );
}
