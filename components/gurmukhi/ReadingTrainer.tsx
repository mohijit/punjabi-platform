"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OptionButton, type OptionState } from "@/components/exercise/OptionButton";
import { readingLevels, type ReadingItem, type ReadingLevel } from "@/content";
import { itemId, recordAnswer, useProgress, type ItemRecord } from "@/lib/progress";
import { setSetting, useSettings } from "@/lib/settings";
import { useHydrated } from "@/components/layout/AppProviders";

/**
 * The reading trainer.
 *
 * Five levels that go from a single letter to a whole sentence, and one idea
 * running through all of them: read the Gurmukhi first, check the romanisation
 * second. That is why the transliteration is a toggle rather than always on —
 * a learner who reads the roman line never learns to read the letters, and the
 * only way through that is to make looking at it a deliberate act.
 *
 * A session is a dozen items, not the whole level, and it is drawn from the
 * items the learner has seen least or got wrong most. Sitting through all 80
 * syllables in a row teaches endurance, not reading.
 */

const SESSION_LENGTH = 12;

type Phase = "picking" | "asking" | "done";

/** How solid an item is: an item answered right twice running is counted known. */
function isSolid(record: ItemRecord | undefined): boolean {
  return record !== undefined && record.streak >= 2;
}

function solidCount(level: ReadingLevel, items: Record<string, ItemRecord>): number {
  return level.items.filter((item) => isSolid(items[itemId(item.tracks.kind, item.tracks.value)]))
    .length;
}

/**
 * The dozen items a session asks about: whatever the learner knows least,
 * shuffled so the same twelve do not arrive in the same order every time.
 *
 * This runs from a click, never during render, so the randomness cannot
 * produce a server and client that disagree.
 */
function sessionFor(level: ReadingLevel, items: Record<string, ItemRecord>): ReadingItem[] {
  const scored = level.items.map((item) => {
    const record = items[itemId(item.tracks.kind, item.tracks.value)];
    // Unseen items come first, then the ones with the shortest run of correct
    // answers. The jitter keeps equally-weak items from always tying the same way.
    const weakness = record ? record.streak - record.wrong : -1;
    return { item, weakness: weakness + Math.random() * 0.5 };
  });
  scored.sort((a, b) => a.weakness - b.weakness);
  const chosen = scored.slice(0, SESSION_LENGTH).map((entry) => entry.item);
  for (let index = chosen.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [chosen[index], chosen[target]] = [chosen[target], chosen[index]];
  }
  return chosen;
}

export function ReadingTrainer() {
  const hydrated = useHydrated();
  const progress = useProgress();
  const { showTransliteration } = useSettings();

  const [phase, setPhase] = useState<Phase>("picking");
  const [level, setLevel] = useState<ReadingLevel | null>(null);
  const [queue, setQueue] = useState<ReadingItem[]>([]);
  const [position, setPosition] = useState(0);
  const [given, setGiven] = useState<string | null>(null);
  const [brokenUp, setBrokenUp] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  function start(next: ReadingLevel) {
    setLevel(next);
    setQueue(sessionFor(next, progress.items));
    setPosition(0);
    setGiven(null);
    setBrokenUp(false);
    setCorrectCount(0);
    setPhase("asking");
  }

  function answer(item: ReadingItem, option: string) {
    if (given !== null) return;
    const wasCorrect = option === item.answer;
    setGiven(option);
    if (wasCorrect) setCorrectCount((count) => count + 1);
    recordAnswer(item.tracks.kind, item.tracks.value, wasCorrect);
  }

  function next() {
    setGiven(null);
    setBrokenUp(false);
    if (position + 1 >= queue.length) setPhase("done");
    else setPosition(position + 1);
  }

  function backToLevels() {
    setPhase("picking");
    setLevel(null);
    setQueue([]);
  }

  /* ------------------------------ picking ------------------------------- */

  if (phase === "picking" || level === null) {
    return (
      <div className="space-y-3">
        {readingLevels.map((entry) => {
          const solid = hydrated ? solidCount(entry, progress.items) : 0;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => start(entry)}
              className="block w-full rounded-2xl border border-border bg-surface p-5 text-left transition-colors hover:border-border-strong hover:bg-surface-2 sm:p-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-medium">
                  <span className="text-text-faint">Level {entry.number}</span>
                  <span className="ml-2">{entry.title}</span>
                </h2>
                <span className="shrink-0 text-sm tabular-nums text-text-muted">
                  {hydrated ? `${solid} / ${entry.items.length}` : `${entry.items.length} items`}
                </span>
              </div>
              <p className="mt-1 max-w-prose text-sm text-text-muted">{entry.goal}</p>
              <div className="mt-3">
                <ProgressBar value={solid} total={entry.items.length} label="" />
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  /* -------------------------------- done -------------------------------- */

  if (phase === "done") {
    const accuracy = queue.length > 0 ? Math.round((correctCount / queue.length) * 100) : 0;
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-center sm:p-8">
        <p className="pa-lg" lang="pa">
          ਸ਼ਾਬਾਸ਼
        </p>
        <p className="roman mt-1 text-sm text-text-muted">shābāsh — well done</p>
        <p className="mt-5 text-lg">
          {correctCount} of {queue.length} read correctly
          <span className="ml-2 tabular-nums text-text-muted">{accuracy}%</span>
        </p>
        <p className="mt-2 text-sm text-text-muted">
          {accuracy >= 80
            ? "Comfortable. Try the next level, or come back to this one without the transliteration on."
            : "The ones you missed will come up first next time round."}
        </p>
        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          <Button variant="secondary" size="lg" onClick={backToLevels}>
            All levels
          </Button>
          <Button size="lg" onClick={() => start(level)}>
            Another twelve
          </Button>
        </div>
      </div>
    );
  }

  /* ------------------------------- asking ------------------------------- */

  const item = queue[position];
  if (!item) return null;
  const answered = given !== null;
  const wasCorrect = given === item.answer;

  function stateOf(option: string): OptionState {
    if (!answered) return "idle";
    if (option === given) return option === item.answer ? "chosen-correct" : "chosen-wrong";
    if (option === item.answer) return "revealed";
    return "idle";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={backToLevels}
          className="shrink-0 text-sm text-text-muted transition-colors hover:text-text"
        >
          ← Levels
        </button>
        <div className="flex-1">
          <ProgressBar value={position} total={queue.length} />
        </div>
        <span className="shrink-0 text-sm tabular-nums text-text-faint">
          {position + 1}/{queue.length}
        </span>
      </div>

      <p className="text-center text-text-muted">{level.instruction}</p>

      <div className="rounded-2xl border border-border bg-surface-2 px-4 py-10 text-center">
        {brokenUp ? (
          // The same text, chunk by chunk — this is how it is read aloud, and
          // seeing the chunks is usually enough to unstick a long word.
          <p className="flex flex-wrap items-center justify-center gap-2">
            {item.clusters.map((cluster, index) => (
              <span
                key={index}
                className="pa-md rounded-lg bg-surface px-2.5 py-1 leading-none"
                lang="pa"
              >
                {cluster}
              </span>
            ))}
          </p>
        ) : (
          <p
            className={level.id === "sentences" ? "pa-lg" : "pa-hero"}
            lang="pa"
          >
            {item.text}
          </p>
        )}

        {showTransliteration || answered ? (
          <p className="roman mt-4 text-text-muted">{item.roman}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
        {item.clusters.length > 1 ? (
          <button
            type="button"
            onClick={() => setBrokenUp(!brokenUp)}
            className="text-text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
          >
            {brokenUp ? "Put it back together" : "Break it into chunks"}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setSetting("showTransliteration", !showTransliteration)}
          className="text-text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
        >
          {showTransliteration ? "Hide transliteration" : "Show transliteration"}
        </button>
      </div>

      <div className="grid gap-2.5">
        {item.options.map((option) => (
          <OptionButton
            key={option}
            state={stateOf(option)}
            disabled={answered}
            onClick={() => answer(item, option)}
          >
            {item.asks === "reading" ? (
              <span className="roman text-lg">{option}</span>
            ) : (
              <span>{option}</span>
            )}
          </OptionButton>
        ))}
      </div>

      {answered ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-4 text-sm">
            <p className="font-medium">
              {wasCorrect ? "Right." : "Not this time."}{" "}
              <span className="pa ml-1" lang="pa">
                {item.text}
              </span>
              <span className="roman ml-2 text-text-muted">{item.roman}</span>
              {item.english && item.asks === "reading" ? (
                <span className="ml-2 text-text-muted">{item.english}</span>
              ) : null}
            </p>
            {item.note ? (
              <p className="mt-2 max-w-prose text-text-muted">{item.note}</p>
            ) : null}
          </div>
          <Button size="lg" className="w-full" onClick={next} autoFocus>
            {position + 1 >= queue.length ? "Finish" : "Next"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
