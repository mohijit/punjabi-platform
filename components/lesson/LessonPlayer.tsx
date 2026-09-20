"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StepRenderer, advancesItself } from "./StepRenderer";
import { LessonComplete } from "./LessonComplete";
import type { Outcome } from "@/components/exercise/ExerciseRunner";
import {
  completeLesson,
  saveLessonPosition,
  setCurrentLesson,
  useProgress,
} from "@/lib/progress";
import { playableSteps } from "@/lib/lessons";
import type { Lesson } from "@/content/schema";

/**
 * The lesson player.
 *
 * One step on screen at a time, a slim bar showing how far through it is, and
 * nothing else: no timer, no lives, no streak counter. A learner can leave
 * whenever they like and the position is written to storage as they go, so
 * closing the tab costs nothing.
 *
 * It knows nothing about Punjabi. Every lesson is data, so a new lesson is a
 * new file in `content/lessons/` and never a change here.
 */
export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  // Listening steps with no recording behind them are dropped, so the lesson
  // is however long it can actually be taught today.
  const steps = useMemo(() => playableSteps(lesson), [lesson]);
  const [index, setIndex] = useState(0);
  /** Set once the lesson is finished; also the summary shown on the last screen. */
  const [summary, setSummary] = useState<{ scored: number; correct: number } | null>(null);
  const [dismissedResume, setDismissedResume] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);
  const movedRef = useRef(false);
  // The running tally is not rendered until the lesson ends, so it lives in a
  // ref: an answer should never cause the current step to re-render.
  const tallyRef = useRef({ scored: 0, correct: 0 });
  // Exercises already counted. Going back and answering one again is allowed,
  // but it must not move the accuracy figure a second time.
  const countedRef = useRef(new Set<string>());

  useEffect(() => {
    setCurrentLesson(lesson.id);
  }, [lesson.id]);

  // Resuming is offered, never forced. Jumping the learner into the middle of
  // a lesson they reopened deliberately would be the wrong guess as often as
  // the right one, so the saved position becomes a one-line prompt instead.
  const saved = useProgress().lessons[lesson.id];
  const savedStep =
    saved && !saved.completed && saved.stepIndex > 0 && saved.stepIndex < steps.length
      ? saved.stepIndex
      : null;
  const offerResume =
    savedStep !== null && index === 0 && !dismissedResume && summary === null;

  const step = steps[index];
  const isLast = index === steps.length - 1;

  const advance = useCallback(() => {
    movedRef.current = true;
    if (isLast) {
      const final = tallyRef.current;
      setSummary(final);
      // The per-item progress was already written as each answer was given;
      // this records the lesson itself, once.
      completeLesson(
        lesson.id,
        final.scored > 0 ? Math.round((final.correct / final.scored) * 100) : 100,
      );
      return;
    }
    const next = index + 1;
    setIndex(next);
    setDismissedResume(true);
    saveLessonPosition(lesson.id, next);
  }, [index, isLast, lesson.id]);

  const back = useCallback(() => {
    if (index === 0) return;
    movedRef.current = true;
    setIndex(index - 1);
  }, [index]);

  // Accuracy is only ever computed from exercises that were actually scored,
  // so a lesson of pure explanation never reports a misleading 0%.
  function recordOutcome(key: string, outcome: Outcome) {
    if (!outcome.scored || countedRef.current.has(key)) return;
    countedRef.current.add(key);
    tallyRef.current = {
      scored: tallyRef.current.scored + 1,
      correct: tallyRef.current.correct + (outcome.correct ? 1 : 0),
    };
  }

  // Move focus to the new step so keyboard and screen-reader users are not
  // left at the bottom of the previous one.
  useEffect(() => {
    if (movedRef.current) headingRef.current?.focus();
  }, [index]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "ArrowLeft") back();
      if (event.key === "ArrowRight" && !advancesItself(step)) advance();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, back, step]);

  if (summary) {
    return (
      <LessonComplete
        lesson={lesson}
        scored={summary.scored}
        correct={summary.correct}
        onRestart={() => {
          tallyRef.current = { scored: 0, correct: 0 };
          countedRef.current = new Set();
          setIndex(0);
          setSummary(null);
          setDismissedResume(true);
          saveLessonPosition(lesson.id, 0);
        }}
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-2xl flex-col">
      <header className="space-y-3 pb-6">
        <div className="flex items-center justify-between gap-4 text-sm">
          <Link href="/learn" className="text-text-muted hover:text-text">
            Leave
          </Link>
          <span className="truncate text-text-faint">{lesson.title}</span>
          <span className="tabular-nums text-text-faint">
            {index + 1}/{steps.length}
          </span>
        </div>
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-surface-2"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={index + 1}
          aria-label="Lesson progress"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: ((index + 1) / steps.length) * 100 + "%" }}
          />
        </div>
        {offerResume ? (
          <p className="text-xs text-text-faint">
            You stopped at step {savedStep + 1} last time.{" "}
            <button
              type="button"
              onClick={() => {
                movedRef.current = true;
                setIndex(savedStep);
                setDismissedResume(true);
              }}
              className="text-accent hover:underline"
            >
              Pick up there
            </button>
          </p>
        ) : null}
      </header>

      <div
        ref={headingRef}
        tabIndex={-1}
        key={index}
        className="flex-1 outline-none"
      >
        <StepRenderer
          step={step}
          stepKey={String(index)}
          onOutcome={recordOutcome}
          onDone={advance}
          continueLabel={isLast ? "Finish lesson" : undefined}
        />
      </div>

      <footer className="sticky bottom-0 mt-8 flex items-center justify-between gap-4 border-t border-border bg-bg/90 py-4 backdrop-blur">
        <Button variant="quiet" size="sm" onClick={back} disabled={index === 0}>
          Back
        </Button>
        {advancesItself(step) ? (
          <span className="text-xs text-text-faint">Answer to continue</span>
        ) : (
          <Button size="md" onClick={advance}>
            {isLast ? "Finish lesson" : "Continue"}
          </Button>
        )}
      </footer>
    </div>
  );
}
