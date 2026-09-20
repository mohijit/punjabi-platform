"use client";

import { useEffect, useState } from "react";
import { onVoicesReady, speak, voiceStatus, type VoiceStatus } from "@/lib/audio";
import { useSettings } from "@/lib/settings";

/** Shared across every audio button so one voice check serves the whole app. */
export function useVoiceStatus(): VoiceStatus {
  const [status, setStatus] = useState<VoiceStatus>("unknown");
  useEffect(() => onVoicesReady(() => setStatus(voiceStatus())), []);
  return status;
}

export function AudioButton({
  text,
  audio,
  label,
  size = "md",
}: {
  text: string;
  audio?: string;
  /** What is being read aloud, for screen readers. */
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const { playbackRate } = useSettings();
  const status = useVoiceStatus();
  const [playing, setPlaying] = useState(false);

  const unavailable = status === "unsupported" || (status === "missing" && !audio);

  const dimensions = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  }[size];

  const iconSize = { sm: 14, md: 17, lg: 24 }[size];

  async function play() {
    if (unavailable) return;
    setPlaying(true);
    await speak(text, { audio, rate: playbackRate });
    setPlaying(false);
  }

  return (
    <button
      type="button"
      onClick={play}
      disabled={unavailable}
      aria-label={
        unavailable
          ? "Audio unavailable on this device"
          : "Play audio" + (label ? ": " + label : "")
      }
      title={unavailable ? "No Punjabi voice available on this device" : undefined}
      className={[
        dimensions,
        "inline-flex shrink-0 items-center justify-center rounded-full border transition-colors",
        unavailable
          ? "cursor-not-allowed border-border text-text-faint opacity-50"
          : playing
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
