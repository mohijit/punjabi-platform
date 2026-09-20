import type { Exercise } from "@/content/schema";
import type { Answer, Result } from "@/lib/exercises";

/**
 * Every exercise component takes exactly this. The component collects input
 * and calls `onSubmit`; it never checks the answer, records progress or
 * decides what happens next. `ExerciseRunner` owns all of that, so the eight
 * types cannot drift apart in how they score or report.
 */
export interface ExerciseProps<T extends Exercise = Exercise> {
  exercise: T;
  /** What the learner submitted, or null while they are still working. */
  given: Answer | null;
  /** null until answered; after that the exercise renders its marked state. */
  result: Result | null;
  onSubmit: (given: Answer) => void;
}
