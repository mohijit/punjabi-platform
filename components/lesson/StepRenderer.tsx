"use client";

import { useState } from "react";
import { ExerciseRunner, type Outcome } from "@/components/exercise/ExerciseRunner";
import { ExplainStep, LettersStep, VocabStep, SentenceStep } from "./steps";
import type { LessonStep } from "@/content/schema";

/**
 * Renders one lesson step, whatever kind it is.
 *
 * Steps that ask a question own their own "Continue" control, because it only
 * appears once the answer has been checked. Teaching steps do not, so the
 * player draws the button for them — `advancesItself` is how the player knows
 * which it is dealing with.
 */
export function advancesItself(step: LessonStep): boolean {
  return step.type === "exercise" || step.type === "review";
}

export function StepRenderer({
  step,
  stepKey,
  onOutcome,
  onDone,
  continueLabel,
}: {
  step: LessonStep;
  /** Identifies this step, so an exercise re-answered after going back is not counted twice. */
  stepKey: string;
  /** Called once per answered exercise, for the lesson accuracy figure. */
  onOutcome: (key: string, outcome: Outcome) => void;
  /** Called when a self-advancing step has finished. */
  onDone: () => void;
  continueLabel?: string;
}) {
  switch (step.type) {
    case "explain":
      return <ExplainStep step={step} />;
    case "letters":
      return <LettersStep step={step} />;
    case "vocab":
      return <VocabStep step={step} />;
    case "sentence":
      return <SentenceStep step={step} />;
    case "exercise":
      return (
        <ExerciseRunner
          exercise={step.exercise}
          continueLabel={continueLabel}
          onDone={(outcome) => {
            onOutcome(stepKey, outcome);
            onDone();
          }}
        />
      );
    case "review":
      return (
        <ReviewStep
          step={step}
          stepKey={stepKey}
          onOutcome={onOutcome}
          onDone={onDone}
          continueLabel={continueLabel}
        />
      );
  }
}

/** A short run of exercises over what the lesson just taught, one at a time. */
function ReviewStep({
  step,
  stepKey,
  onOutcome,
  onDone,
  continueLabel,
}: {
  step: Extract<LessonStep, { type: "review" }>;
  stepKey: string;
  onOutcome: (key: string, outcome: Outcome) => void;
  onDone: () => void;
  continueLabel?: string;
}) {
  const [index, setIndex] = useState(0);
  const last = index === step.exercises.length - 1;

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-medium sm:text-2xl">{step.title}</h2>
        <span className="text-sm tabular-nums text-text-faint">
          {index + 1} of {step.exercises.length}
        </span>
      </div>

      <ExerciseRunner
        key={index}
        exercise={step.exercises[index]}
        continueLabel={last ? continueLabel : undefined}
        onDone={(outcome) => {
          onOutcome(stepKey + ":" + index, outcome);
          if (last) onDone();
          else setIndex(index + 1);
        }}
      />
    </div>
  );
}
