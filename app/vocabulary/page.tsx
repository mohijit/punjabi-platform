import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/Card";
import { WordCard } from "@/components/word/WordCard";
import { populatedCategories, words, wordsIn } from "@/content";
import type { WordCategory } from "@/content/schema";

export const metadata: Metadata = {
  title: "Vocabulary — Learn Punjabi",
  description: "Punjabi words by topic, each with an example sentence and audio.",
};

/** Category ids are snake_case in the data; this is how they read on screen. */
const LABELS: Partial<Record<WordCategory, string>> = {
  food_drink: "Food and drink",
  question_words: "Question words",
};

function label(category: WordCategory): string {
  return (
    LABELS[category] ?? category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, " ")
  );
}

export default function VocabularyPage() {
  const categories = populatedCategories();

  return (
    <div className="mx-auto max-w-3xl space-y-12 px-4 py-10">
      <header>
        <h1 className="text-2xl font-medium">Vocabulary</h1>
        <p className="mt-2 max-w-prose text-text-muted">
          {words.length} {words.length === 1 ? "word" : "words"}, each one checked before it
          was added. Tap ☆ to keep a word for review.
        </p>
      </header>

      {categories.map((category) => (
        <section key={category}>
          <SectionHeading hint={`${wordsIn(category).length} words`}>
            {label(category)}
          </SectionHeading>
          <div className="grid gap-3 sm:grid-cols-2">
            {wordsIn(category).map((word) => (
              <WordCard key={word.gurmukhi} word={word} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
