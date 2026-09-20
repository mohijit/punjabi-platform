import type { Metadata } from "next";
import Link from "next/link";
import { soundGroups, getLetter } from "@/content";

export const metadata: Metadata = {
  title: "Sounds that get confused — Learn Punjabi",
  description:
    "The Punjabi contrasts English does not have: aspirated and unaspirated, dental and retroflex, ਰ and ੜ, ਨ and ਣ.",
};

/**
 * The contrasts, side by side.
 *
 * The plan had listening drills here — "which sound did you hear, ਕ or ਖ".
 * They are not built, and not because they were forgotten: without recordings
 * there is nothing to hear, and a synthetic voice gets these exact contrasts
 * wrong more often than it gets them right. Teaching someone to tell ਤ from ਟ
 * with a voice that pronounces both as an English t is worse than not trying.
 *
 * So this page does what can be done honestly on paper: shows the pairs, says
 * where the tongue goes, and gives a real word for each one.
 */
export default function SoundsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 px-4 py-10">
      <header>
        <Link
          href="/gurmukhi"
          className="text-sm text-text-muted transition-colors hover:text-text"
        >
          ← Gurmukhi
        </Link>
        <h1 className="mt-3 text-2xl font-medium">Sounds that get confused</h1>
        <p className="mt-2 max-w-prose text-text-muted">
          Punjabi separates sounds that English runs together, and English separates some
          that Punjabi does not. These are the pairs worth slowing down for — swapping
          them does not make a word sound foreign, it makes it a different word.
        </p>
      </header>

      <div className="space-y-10">
        {soundGroups.map((group) => (
          <section key={group.id}>
            <h2 className="text-lg font-medium">
              <span className="pa" lang="pa">
                {group.title}
              </span>
            </h2>
            <p className="mt-2 max-w-prose text-text-muted">{group.explanation}</p>
            <p className="mt-3 max-w-prose rounded-xl bg-surface-2 px-4 py-3 text-sm">
              {group.mouthHint}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {group.letters.map((char) => {
                const letter = getLetter(char);
                if (!letter) return null;
                return (
                  <div
                    key={char}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4"
                  >
                    <span className="pa-lg w-14 shrink-0 text-center leading-none" lang="pa">
                      {letter.letter}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium">{letter.name}</p>
                      <p className="text-sm text-text-muted">{letter.sound}</p>
                      <p className="mt-1 text-sm">
                        <span className="pa" lang="pa">
                          {letter.example.gurmukhi}
                        </span>
                        <span className="roman ml-2">{letter.example.roman}</span>
                        <span className="ml-2 text-text-muted">{letter.example.english}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="max-w-prose rounded-2xl border border-border bg-surface p-5 text-sm text-text-muted">
        These contrasts really want ears rather than eyes, and the listening drills that
        belong here are waiting on recorded audio. There is none yet, and a synthetic voice
        mispronounces exactly these sounds — so rather than drill you against a wrong
        model, the page stops here. Find a Punjabi speaker and read these words at them;
        they will correct you in seconds.
      </p>
    </div>
  );
}
