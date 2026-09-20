import type { Metadata } from "next";
import { Card, CardLink } from "@/components/ui/Card";
import { SentenceExplorer } from "@/components/word/SentenceExplorer";
import { sentences } from "@/content";

export const metadata: Metadata = {
  title: "Grammar — Learn Punjabi",
  description: "How Punjabi sentences are put together, explained through examples first.",
};

/**
 * Grammar, examples first. Every topic here opens with a sentence the learner
 * can already read and takes it apart; the tables come after the explanation,
 * never before it.
 *
 * The topic pages are being written. What exists now is the tool they are
 * built on, applied to the sentences the course has taught so far.
 */
export default function GrammarPage() {
  const examples = sentences.slice(0, 3);

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <header>
        <h1 className="text-2xl font-medium">Grammar</h1>
        <p className="mt-2 max-w-prose text-text-muted">
          Punjabi puts the verb at the end: <span className="pa" lang="pa">ਮੈਂ ਪੰਜਾਬੀ ਸਿੱਖ ਰਿਹਾ ਹਾਂ</span>{" "}
          is literally &ldquo;I Punjabi learning am&rdquo;. Once that clicks, most sentences
          stop looking scrambled.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-faint">
          Take a sentence apart
        </h2>
        {examples.map((sentence) => (
          <SentenceExplorer key={sentence.id} sentence={sentence} />
        ))}
      </section>

      <Card>
        <h2 className="font-medium">Still being written</h2>
        <p className="mt-2 text-sm text-text-muted">
          The topic pages — ਹੋਣਾ (to be), pronouns and ਤੂੰ vs ਤੁਸੀਂ, gender and agreement,
          postpositions, the tenses, questions and negation — are next. Until then, grammar
          is taught inside the lessons themselves, where each point arrives with the
          sentence that needs it.
        </p>
      </Card>

      <CardLink href="/learn">
        <span className="font-medium">Go to the course</span>
        <p className="mt-1 text-sm text-text-muted">
          Grammar is explained as it comes up, in order.
        </p>
      </CardLink>
    </div>
  );
}
