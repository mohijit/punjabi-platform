/**
 * Lesson shaping — what the player actually walks the learner through.
 *
 * A lesson file describes the whole lesson, including the listening work.
 * Until a recording exists for a listening exercise there is nothing to hear,
 * so those steps are filtered out here rather than being shown in silence.
 * Nothing is deleted from the content: add the recording and the step comes
 * back on its own.
 */

import { isPlayable } from "@/lib/exercises";
import type { Lesson, LessonStep } from "@/content/schema";

export function playableSteps(lesson: Lesson): LessonStep[] {
  const steps: LessonStep[] = [];

  for (const step of lesson.steps) {
    if (step.type === "exercise") {
      if (isPlayable(step.exercise)) steps.push(step);
      continue;
    }
    if (step.type === "review") {
      const exercises = step.exercises.filter(isPlayable);
      // A review with nothing left in it is not a review.
      if (exercises.length > 0) steps.push({ ...step, exercises });
      continue;
    }
    steps.push(step);
  }

  return steps;
}

/** How many exercises a lesson currently hides for want of a recording. */
export function silentExerciseCount(lesson: Lesson): number {
  let count = 0;
  for (const step of lesson.steps) {
    if (step.type === "exercise" && !isPlayable(step.exercise)) count += 1;
    if (step.type === "review") count += step.exercises.filter((e) => !isPlayable(e)).length;
  }
  return count;
}
