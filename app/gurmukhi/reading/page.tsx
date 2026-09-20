import type { Metadata } from "next";
import Link from "next/link";
import { ReadingTrainer } from "@/components/gurmukhi/ReadingTrainer";
import { contentCounts } from "@/content";

export const metadata: Metadata = {
  title: "Reading trainer — Learn Punjabi",
  description:
    "Read Gurmukhi in five steps: single letters, letters with vowel signs, simple words, words with marks, then whole sentences.",
};

/**
 * The part of the course that fixes the usual failure: learners who can name
 * all thirty-five letters and still cannot read a line of Punjabi. Knowing a
 * letter and reading a word are different skills, and only the second one is
 * practised here.
 */
export default function ReadingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <header>
        <Link
          href="/gurmukhi"
          className="text-sm text-text-muted transition-colors hover:text-text"
        >
          ← Gurmukhi
        </Link>
        <h1 className="mt-3 text-2xl font-medium">Reading trainer</h1>
        <p className="mt-2 max-w-prose text-text-muted">
          Five levels, from one letter to a whole sentence. Each one is a short session of
          twelve, drawn from whatever you have seen least or got wrong most — so coming
          back to a level does not mean starting it again.
        </p>
        <p className="mt-3 max-w-prose text-sm text-text-faint">
          The transliteration starts visible and can be switched off at any point. Turning
          it off is the whole exercise: it is the difference between reading Gurmukhi and
          reading English letters that happen to sit underneath it.
        </p>
      </header>

      <ReadingTrainer />

      <p className="text-sm text-text-faint">
        Built from the same {contentCounts.words} words and {contentCounts.sentences}{" "}
        sentences taught elsewhere in the course, so nothing here is a word you have not
        met — {contentCounts.readingItems} items across {contentCounts.readingLevels} levels.
      </p>
    </div>
  );
}
