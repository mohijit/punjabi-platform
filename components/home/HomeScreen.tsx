"use client";

import Link from "next/link";
import { useHydrated } from "@/components/layout/AppProviders";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardLink, SectionHeading } from "@/components/ui/Card";
import { ProgressBar, Stat } from "@/components/ui/ProgressBar";
import { contentCounts, getLesson, lessons, recommendedNext } from "@/content";
import {
  completedLessonCount,
  dueItems,
  learnedCount,
  masteredCount,
  useProgress,
} from "@/lib/progress";

/**
 * The homepage, capped at three blocks by the brief: where to carry on, what
 * is due for review, and how far along the learner is. No streak, no badge,
 * no mascot, nothing that rewards opening the app rather than learning.
 *
 * Everything it shows is derived from progress and content, so it needs no
 * state of its own.
 */
export function HomeScreen() {
  const progress = useProgress();
  const hydrated = useHydrated();

  // Before storage has been read, a returning learner's numbers are unknown.
  // Showing zeros first and correcting them a frame later reads as a loss, so
  // the two data blocks wait one tick instead.
  const completed = (id: string) => progress.lessons[id]?.completed === true;
  const saved = progress.currentLessonId ? getLesson(progress.currentLessonId) : undefined;
  const savedRecord = saved ? progress.lessons[saved.id] : undefined;
  const lesson = saved && !savedRecord?.completed ? saved : recommendedNext(completed);
  const record = progress.lessons[lesson.id];
  const partway =
    record && !record.completed && record.stepIndex > 0 ? record.stepIndex : null;

  const due = hydrated ? dueItems(progress).length : 0;
  const lettersMastered = masteredCount(progress, "letter");
  const wordsLearned = learnedCount(progress, "word");
  const lessonsDone = completedLessonCount(progress);

  return (
    <div className="mx-auto max-w-2xl space-y-12 px-4 py-12 sm:py-16">
      <header>
        <h1 className="pa-hero" lang="pa">
          ਸਤ ਸ੍ਰੀ ਅਕਾਲ
        </h1>
        <p className="roman mt-2 text-sm">sat srī akāl</p>
      </header>

      <section>
        <SectionHeading hint={<Link href="/learn" className="hover:text-text">All lessons</Link>}>
          {lessonsDone > 0 || partway ? "Continue learning" : "Start here"}
        </SectionHeading>

        <CardLink href={"/learn/" + lesson.id}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-xs uppercase tracking-[0.12em] text-text-faint">
              {lesson.unit}
            </span>
            <span className="text-xs text-text-faint">{lesson.minutes} min</span>
          </div>
          <h2 className="mt-2 text-lg font-medium">
            {lesson.number}. {lesson.title}
          </h2>
          <p className="mt-1 text-sm text-text-muted">{lesson.goal}</p>
          {hydrated && partway ? (
            <p className="mt-3 text-sm text-accent">
              Pick up at step {partway + 1} of {lesson.steps.length}
            </p>
          ) : null}
        </CardLink>
      </section>

      <section>
        <SectionHeading>Today&rsquo;s review</SectionHeading>
        <Card>
          {!hydrated ? (
            <p className="text-sm text-text-faint">Checking what&rsquo;s due&hellip;</p>
          ) : due > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-text-muted">
                <span className="text-text">{due}</span>{" "}
                {due === 1 ? "item is" : "items are"} ready to come back round.
              </p>
              <ButtonLink href="/practice" size="sm">
                Review now
              </ButtonLink>
            </div>
          ) : (
            <p className="text-sm text-text-muted">
              Nothing due. Reviews appear here a day or two after you learn something —
              that gap is what makes it stick.
            </p>
          )}
        </Card>
      </section>

      <section>
        <SectionHeading hint={<Link href="/progress" className="hover:text-text">Details</Link>}>
          Where you are
        </SectionHeading>
        <Card className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Stat value={hydrated ? lettersMastered : "—"} caption="Letters known" />
            <Stat value={hydrated ? wordsLearned : "—"} caption="Words met" />
            <Stat value={hydrated ? lessonsDone : "—"} caption="Lessons done" />
          </div>
          <div className="space-y-3">
            <ProgressBar
              value={hydrated ? lettersMastered : 0}
              total={contentCounts.letters}
              label="Gurmukhi"
              showPercent
            />
            <ProgressBar
              value={hydrated ? lessonsDone : 0}
              total={lessons.length}
              label="Punjabi course"
              showPercent
            />
          </div>
        </Card>
      </section>
    </div>
  );
}
