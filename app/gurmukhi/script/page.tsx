import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { scriptNotes } from "@/content";

export const metadata: Metadata = {
  title: "How the script works — Learn Punjabi",
  description:
    "Seven short ideas about how Gurmukhi works, before any letter is memorised: the top bar, the built-in vowel, vowel signs, carriers and the marks.",
};

/**
 * Stage 1. Read once, come back to twice.
 *
 * Nothing here needs memorising, which the page says outright — a learner who
 * treats this as material to revise will get stuck on it, when the whole point
 * is that it makes the letters afterwards take a fraction of the effort.
 */
export default function ScriptPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header>
        <Link
          href="/gurmukhi"
          className="text-sm text-text-muted transition-colors hover:text-text"
        >
          ← Gurmukhi
        </Link>
        <h1 className="mt-3 text-2xl font-medium">How the script works</h1>
        <p className="mt-2 max-w-prose text-text-muted">
          Seven ideas, and none of them need memorising. They are the things that are
          obvious to everyone who reads Gurmukhi and invisible to everyone who does not —
          which is why learners who skip them spend a month wondering why ਘਰ is read
          &ldquo;ghar&rdquo; when there is no vowel in it.
        </p>
      </header>

      <div className="mt-12 space-y-14">
        {scriptNotes.map((note, index) => (
          <section key={note.id}>
            <p className="text-sm tabular-nums text-text-faint">
              {index + 1} of {scriptNotes.length}
            </p>
            <h2 className="mt-1 text-xl font-medium">{note.title}</h2>
            <p className="mt-2 max-w-prose text-text-muted">{note.summary}</p>

            {note.demo.length > 0 ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {note.demo.map((demo) => (
                  <div
                    key={demo.gurmukhi + demo.caption}
                    className="rounded-2xl border border-border bg-surface-2 px-4 py-5 text-center"
                  >
                    <p className="pa-lg" lang="pa">
                      {demo.gurmukhi}
                    </p>
                    <p className="roman mt-1 text-sm text-text-muted">{demo.roman}</p>
                    <p className="mt-2 text-sm text-text-faint">{demo.caption}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-5 space-y-3">
              {note.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="max-w-prose text-text">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-border bg-surface p-6 text-center">
        <p className="max-w-prose text-text-muted">
          That is the whole system. The letters are next, and they are easier than they
          look now.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/gurmukhi">The letters</ButtonLink>
          <ButtonLink href="/gurmukhi/reading" variant="secondary">
            Reading trainer
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
