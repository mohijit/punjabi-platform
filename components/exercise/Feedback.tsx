"use client";

import { AudioButton } from "@/components/ui/AudioButton";
import { Button } from "@/components/ui/Button";
import { isGurmukhi } from "@/lib/transliteration";
import type { Result } from "@/lib/exercises";

export type Tone = "correct" | "incorrect" | "neutral";

const TONES: Record<Tone, { box: string; text: string }> = {
  correct: { box: "border-correct bg-correct-soft", text: "text-correct" },
  incorrect: { box: "border-incorrect bg-incorrect-soft", text: "text-incorrect" },
  neutral: { box: "border-border bg-surface-2", text: "text-text" },
};

/**
 * Shown after every answer. Calm on purpose: no confetti, no buzzer, no
 * shrinking timer. A wrong answer always shows the right one, with audio,
 * because being told the answer is the part that teaches.
 */
export function Feedback({
  result,
  tone,
  heading,
  onContinue,
  continueLabel = "Continue",
}: {
  result: Result;
  /** Defaults to the result. Read-aloud passes "neutral": it marks itself. */
  tone?: Tone;
  heading?: string;
  onContinue: () => void;
  continueLabel?: string;
}) {
  const resolvedTone: Tone = tone ?? (result.correct ? "correct" : "incorrect");
  const resolvedHeading = heading ?? (result.correct ? "Correct" : "Not quite");
  const styles = TONES[resolvedTone];

  // Only worth showing when the learner got it wrong and there is something to
  // read: a self-marked exercise already has the text on screen.
  const showAnswer = resolvedTone === "incorrect";

  return (
    <div role="status" aria-live="polite" className={["rounded-2xl border p-4 sm:p-5", styles.box].join(" ")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={["font-medium", styles.text].join(" ")}>{resolvedHeading}</p>
        <Button size="sm" onClick={onContinue} autoFocus>
          {continueLabel}
        </Button>
      </div>

      {showAnswer ? (
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
          <span className="text-sm text-text-muted">Answer</span>
          {isGurmukhi(result.correctAnswer) ? (
            <>
              <span className="pa-md" lang="pa">
                {result.correctAnswer}
              </span>
              <AudioButton size="sm" label={result.correctAnswer} />
            </>
          ) : (
            <span className="font-medium">{result.correctAnswer}</span>
          )}
        </div>
      ) : null}

      {result.explain ? (
        <p className="mt-3 border-t border-border pt-3 text-sm text-text-muted">{result.explain}</p>
      ) : null}
    </div>
  );
}
