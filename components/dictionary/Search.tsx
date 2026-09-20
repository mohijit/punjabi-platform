"use client";

import { useMemo, useState } from "react";
import { WordCard } from "@/components/word/WordCard";
import { words } from "@/content";
import { toSearchKey } from "@/lib/transliteration";
import type { Word } from "@/content/schema";

/**
 * One search box over everything. Gurmukhi, romanisation and English all match
 * the same entry, and the romanisation is folded to plain ASCII first, so
 * "paani", "pani" and "ਪਾਣੀ" find ਪਾਣੀ.
 */
const INDEX: Array<{ word: Word; keys: string[]; english: string }> = words.map((word) => ({
  word,
  keys: [toSearchKey(word.gurmukhi), toSearchKey(word.roman)],
  english: word.english.toLowerCase(),
}));

export function DictionarySearch() {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const results = useMemo(() => {
    if (!trimmed) return [];
    const key = toSearchKey(trimmed);
    const english = trimmed.toLowerCase();
    return INDEX.filter(
      (entry) =>
        (key.length > 0 && entry.keys.some((candidate) => candidate.includes(key))) ||
        entry.english.includes(english),
    ).map((entry) => entry.word);
  }, [trimmed]);

  return (
    <div className="space-y-6">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="water, paani, ਪਾਣੀ"
        aria-label="Search the dictionary"
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-base outline-none placeholder:text-text-faint focus:border-border-strong"
      />

      {!trimmed ? (
        <p className="text-sm text-text-muted">
          Search in Gurmukhi, in romanised Punjabi or in English — all three find the same
          word.
        </p>
      ) : results.length === 0 ? (
        <p className="text-sm text-text-muted">
          Nothing for &ldquo;{trimmed}&rdquo; yet. The dictionary covers the{" "}
          {words.length} words taught so far and grows with the course.
        </p>
      ) : (
        <>
          <p className="text-sm text-text-faint">
            {results.length} {results.length === 1 ? "match" : "matches"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((word) => (
              <WordCard key={word.gurmukhi} word={word} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
