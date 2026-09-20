"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Stat } from "@/components/ui/ProgressBar";
import { nextLesson } from "@/content";
import type { Lesson } from "@/content/schema";

/** Distinct words the lesson actually introduced, for the summary line. */
export function wordsTaught(lesson: Lesson): string[] {
  const seen = new Set<string>();
  for (const step of lesson.steps) {
    if (step.type === "vocab") for (const word of step.words) seen.add(word);
  }
  return [...seen];
}

/**
 * The end of a lesson: what was learned, how it went, and where to go next.
 *
 * Deliberately three facts and one button. No confetti, no streak, no score to
 * beat — accuracy is shown because it is useful, not to be competed with.
 */
export function LessonComplete({
  lesson,
  scored,
  correct,
  onRestart,
}: {
  lesson: Lesson;
  /** Exercises that counted; read-aloud steps are self-marked and excluded. */
  scored: number;
  correct: number;
  onRestart: () => void;
}) {
  const accuracy = scored > 0 ? Math.round((correct / scored) * 100) : null;
  const next = nextLesson(lesson.id);
  const words = wordsTaught(lesson).length;

  return (
    <div className="mx-auto max-w-lg space-y-8 py-8 text-center">
      <div className="space-y-2">
        <p className="pa-xl" lang="pa">
          ਸ਼ਾਬਾਸ਼
        </p>
        <p className="roman text-sm">śābāś — well done</p>
      </div>

      <div>
        <h1 className="text-2xl font-medium">Lesson complete</h1>
        <p className="mt-1 text-text-muted">{lesson.title}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface p-6 text-left sm:grid-cols-3">
        <Stat value={words} caption={words === 1 ? "Word learned" : "Words learned"} />
        <Stat value={accuracy === null ? "—" : accuracy + "%"} caption="Accuracy" />
        <Stat value={scored} caption="Questions answered" />
      </div>

      {accuracy !== null && accuracy < 70 ? (
        <p className="text-sm text-text-muted">
          Worth doing this one again before moving on — repeating a lesson is how it sticks,
          and nothing is locked either way.
        </p>
      ) : null}

      <div className="flex flex-col items-center gap-3">
        {next ? (
          <ButtonLink href={"/learn/" + next.id} size="lg">
            Next: {next.title}
          </ButtonLink>
        ) : (
          <p className="text-sm text-text-muted">
            That is the last lesson written so far. More are on the way.
          </p>
        )}
        <div className="flex gap-2">
          <Button onClick={onRestart} variant="quiet" size="sm">
            Repeat this lesson
          </Button>
          <ButtonLink href="/learn" variant="quiet" size="sm">
            Back to the course
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
