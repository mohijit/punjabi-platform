"use client";

import { useHydrated } from "@/components/layout/AppProviders";
import { AudioButton } from "@/components/ui/AudioButton";
import { Card, SectionHeading } from "@/components/ui/Card";
import { getLetter, getSentence, getWord } from "@/content";
import { dueItems, useProgress, weakItems } from "@/lib/progress";
import type { ItemKind } from "@/lib/progress";

/** What an id like "word:ਪਾਣੀ" looks like on screen. */
function display(id: string, kind: ItemKind): { gurmukhi: string; roman: string; english?: string } {
  const value = id.slice(kind.length + 1);
  if (kind === "word") {
    const word = getWord(value);
    return { gurmukhi: value, roman: word?.roman ?? "", english: word?.english };
  }
  if (kind === "letter") {
    const letter = getLetter(value);
    return { gurmukhi: value, roman: letter?.name ?? "", english: letter?.sound };
  }
  if (kind === "sentence") {
    const sentence = getSentence(value);
    return {
      gurmukhi: sentence?.gurmukhi ?? value,
      roman: sentence?.roman ?? "",
      english: sentence?.english,
    };
  }
  return { gurmukhi: value, roman: "" };
}

/**
 * The practice hub, showing what the scheduler has surfaced.
 *
 * Every answer given in a lesson already records its own review state, so
 * this list is real from the first lesson. The sit-down session that quizzes
 * these items — mixed types, five-minute mode, weak-word drills — is the next
 * piece of work; until it lands, this at least shows the learner what is
 * waiting and lets them listen to it.
 */
export function PracticeScreen() {
  const progress = useProgress();
  const hydrated = useHydrated();

  if (!hydrated) {
    return <p className="mt-8 text-sm text-text-faint">Checking what&rsquo;s due&hellip;</p>;
  }

  const due = dueItems(progress);
  const weak = weakItems(progress);

  return (
    <div className="mt-8 space-y-12">
      <section>
        <SectionHeading hint={due.length > 0 ? `${due.length} waiting` : undefined}>
          Due for review
        </SectionHeading>
        {due.length === 0 ? (
          <Card>
            <p className="text-sm text-text-muted">
              Nothing due. Items come back a day or two after you first meet them, then at
              longer and longer gaps — that spacing is what moves a word into memory.
            </p>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {due.slice(0, 20).map(([id, record]) => {
              const item = display(id, record.kind);
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="pa" lang="pa">
                      {item.gurmukhi}
                    </p>
                    {item.roman ? <p className="roman text-sm">{item.roman}</p> : null}
                    {item.english ? (
                      <p className="text-sm text-text-muted">{item.english}</p>
                    ) : null}
                  </div>
                  <AudioButton text={item.gurmukhi} label={item.roman || item.gurmukhi} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {weak.length > 0 ? (
        <section>
          <SectionHeading>Worth another look</SectionHeading>
          <Card>
            <p className="text-sm text-text-muted">
              {weak.length} {weak.length === 1 ? "item has" : "items have"} tripped you up
              more than once. They are scheduled to come round sooner than the rest.
            </p>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
