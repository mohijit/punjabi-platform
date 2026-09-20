import { AudioButton } from "@/components/ui/AudioButton";
import type { Letter } from "@/content/schema";

/**
 * One letter, at the size the brief insists on: the Gurmukhi dominates and
 * everything else is support. Tracing and stroke animation join this card in
 * the writing section; the reference grid does not need them.
 */
export function LetterTile({ letter }: { letter: Letter }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="pa-lg leading-none" lang="pa">
          {letter.letter}
        </span>
        <AudioButton audio={letter.audio} label={letter.name} />
      </div>
      <p className="mt-3 font-medium">{letter.name}</p>
      <p className="text-sm text-text-muted">{letter.sound}</p>
      <p className="mt-2 text-sm">
        <span className="pa" lang="pa">
          {letter.example.gurmukhi}
        </span>
        <span className="roman ml-2">{letter.example.roman}</span>
        <span className="ml-2 text-text-muted">{letter.example.english}</span>
      </p>
    </div>
  );
}

/** How the traditional rows are named for an English-speaking beginner. */
export const GROUP_LABELS: Record<string, string> = {
  carriers: "Vowel carriers",
  fricatives: "ਸ and ਹ",
  velars: "Back of the mouth",
  palatals: "Middle of the mouth",
  retroflexes: "Tongue curled back",
  dentals: "Tongue on the teeth",
  labials: "Lips",
  sonorants: "The last row",
  extra: "Pairī̃ bindī letters",
};
