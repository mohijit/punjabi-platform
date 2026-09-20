import type { Metadata } from "next";
import Link from "next/link";
import { LetterGroups } from "@/components/gurmukhi/LetterGroups";
import { contentCounts } from "@/content";

export const metadata: Metadata = {
  title: "Learn the letters — Learn Punjabi",
  description:
    "The Gurmukhi letters a row at a time, with the sound, a word it appears in, stroke order and a surface to write on.",
};

/**
 * The taught version of the alphabet, as opposed to the reference grid on
 * /gurmukhi. One row at a sitting, because the rows are the pattern.
 */
export default function LettersPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <header>
        <Link
          href="/gurmukhi"
          className="text-sm text-text-muted transition-colors hover:text-text"
        >
          ← Gurmukhi
        </Link>
        <h1 className="mt-3 text-2xl font-medium">Learn the letters</h1>
        <p className="mt-2 max-w-prose text-text-muted">
          {contentCounts.letters} letters, but never all at once. Each row is one place in
          the mouth, and the letters in it differ only in breath and voice — which is the
          fastest way to learn them and the reason the traditional order is the order.
        </p>
      </header>

      <LetterGroups />
    </div>
  );
}
