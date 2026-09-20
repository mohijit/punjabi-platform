"use client";

import { useHydrated } from "@/components/layout/AppProviders";
import { Button } from "@/components/ui/Button";
import { Card, SectionHeading } from "@/components/ui/Card";
import { ProgressBar, Stat } from "@/components/ui/ProgressBar";
import { contentCounts, lessons } from "@/content";
import {
  completedLessonCount,
  dueItems,
  learnedCount,
  listeningAccuracy,
  masteredCount,
  resetProgress,
  useProgress,
  weakItems,
} from "@/lib/progress";

/**
 * Progress, measured as what the learner can now do — not how many days in a
 * row they opened the app. There is deliberately no streak here.
 */
export function ProgressScreen() {
  const progress = useProgress();
  const hydrated = useHydrated();

  if (!hydrated) {
    return <p className="mt-8 text-sm text-text-faint">Reading your progress&hellip;</p>;
  }

  const lettersMastered = masteredCount(progress, "letter");
  const vowelsMastered = masteredCount(progress, "vowel");
  const wordsMet = learnedCount(progress, "word");
  const wordsMastered = masteredCount(progress, "word");
  const lessonsDone = completedLessonCount(progress);
  const listening = listeningAccuracy(progress);
  const weak = weakItems(progress);
  const due = dueItems(progress).length;

  const nothingYet = lessonsDone === 0 && wordsMet === 0;

  return (
    <div className="mt-8 space-y-12">
      {nothingYet ? (
        <Card>
          <p className="text-sm text-text-muted">
            Nothing to show yet — finish a lesson and this fills in. Progress here counts
            what you can read, say and recognise, not how often you visit.
          </p>
        </Card>
      ) : null}

      <section>
        <SectionHeading>The course</SectionHeading>
        <Card className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat value={lessonsDone} caption="Lessons finished" sub={`of ${lessons.length}`} />
            <Stat
              value={lettersMastered}
              caption="Letters mastered"
              sub={`of ${contentCounts.letters}`}
            />
            <Stat
              value={vowelsMastered}
              caption="Vowel signs"
              sub={`of ${contentCounts.vowels}`}
            />
            <Stat value={progress.sentencesCompleted} caption="Sentences built" />
          </div>
          <div className="space-y-3">
            <ProgressBar
              value={lettersMastered + vowelsMastered}
              total={contentCounts.letters + contentCounts.vowels}
              label="Gurmukhi"
              showPercent
            />
            <ProgressBar
              value={lessonsDone}
              total={lessons.length}
              label="Punjabi course"
              showPercent
            />
          </div>
        </Card>
      </section>

      <section>
        <SectionHeading>Words</SectionHeading>
        <Card>
          <div className="grid grid-cols-3 gap-4">
            <Stat value={wordsMet} caption="Words met" />
            <Stat value={wordsMastered} caption="Words solid" sub="right 3 times running" />
            <Stat value={progress.savedWords.length} caption="Saved" />
          </div>
        </Card>
      </section>

      <section>
        <SectionHeading>Listening and review</SectionHeading>
        <Card className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Stat
              value={listening === null ? "—" : listening + "%"}
              caption="Listening accuracy"
              sub={
                progress.listening.total > 0
                  ? `${progress.listening.correct} of ${progress.listening.total}`
                  : "no listening answers yet"
              }
            />
            <Stat value={due} caption="Due for review" />
          </div>
          {weak.length > 0 ? (
            <p className="text-sm text-text-muted">
              {weak.length} {weak.length === 1 ? "item keeps" : "items keep"} catching you
              out. They come back more often until they stop.
            </p>
          ) : null}
        </Card>
      </section>

      <section>
        <SectionHeading>Your data</SectionHeading>
        <Card className="flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-prose text-sm text-text-muted">
            Everything above is stored in this browser only. There is no account and
            nothing is sent anywhere.
          </p>
          <Button
            variant="quiet"
            size="sm"
            onClick={() => {
              if (confirm("Erase all progress on this device? This cannot be undone.")) {
                resetProgress();
              }
            }}
          >
            Erase progress
          </Button>
        </Card>
      </section>
    </div>
  );
}
