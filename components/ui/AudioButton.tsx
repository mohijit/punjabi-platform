"use client";

import { useState } from "react";
import { hasRecording, play } from "@/lib/audio";
import { useSettings } from "@/lib/settings";

/**
 * The play button for a recording.
 *
 * With no recording for this entry it renders nothing at all — not a greyed
 * out speaker, not a tooltip apologising. A disabled control on every card
 * would be its own kind of noise, and the absence is temporary: the button
 * appears by itself the moment a file is added to the entry.
 */
export function AudioButton({
  audio,
  label,
  size = "md",
}: {
  /** The recording's URL. No recording, no button. */
  audio?: string;
  /** What is being played, for screen readers. */
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const { playbackRate } = useSettings();
  const [playing, setPlaying] = useState(false);

  if (!hasRecording(audio)) return null;

  const dimensions = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-14 w-14" }[size];
  const iconSize = { sm: 14, md: 17, lg: 24 }[size];

  async function onClick() {
    setPlaying(true);
    await play({ audio, rate: playbackRate });
    setPlaying(false);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={"Play audio" + (label ? ": " + label : "")}
      className={[
        dimensions,
        "inline-flex shrink-0 items-center justify-center rounded-full border transition-colors",
        playing
          ? "border-accent bg-accent text-accent-text"
          : "border-border bg-surface text-text-muted hover:border-accent hover:text-accent",
      ].join(" ")}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path d="M18.5 5.5a9 9 0 0 1 0 13" />
      </svg>
    </button>
  );
}
