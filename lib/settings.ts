"use client";

import { createStore } from "@/lib/store";
import type { PlaybackRate } from "@/lib/audio";

/**
 * How Punjabi is rendered throughout the app. Roman is a learning aid, so the
 * default shows both and the learner is encouraged to move to Gurmukhi only.
 */
export type ScriptMode = "gurmukhi" | "both" | "roman";

export type ThemeChoice = "system" | "light" | "dark";

export interface Settings {
  theme: ThemeChoice;
  scriptMode: ScriptMode;
  /** The reading trainer's own transliteration toggle, separate from scriptMode. */
  showTransliteration: boolean;
  playbackRate: PlaybackRate;
}

export const defaultSettings: Settings = {
  theme: "system",
  scriptMode: "both",
  showTransliteration: true,
  playbackRate: 1,
};

export const settingsStore = createStore<Settings>("settings", defaultSettings);

export function useSettings(): Settings {
  return settingsStore.useValue();
}

export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
  settingsStore.set((previous) => ({ ...previous, [key]: value }));
}

export const SCRIPT_MODE_LABELS: Record<ScriptMode, string> = {
  gurmukhi: "ਗੁਰਮੁਖੀ only",
  both: "ਗੁਰਮੁਖੀ + Roman",
  roman: "Roman only",
};
