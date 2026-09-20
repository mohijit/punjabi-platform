/**
 * Audio service.
 *
 * Punjabi audio is played from recordings only.
 *
 * There was a speech-synthesis fallback here, reading Gurmukhi through
 * whatever pa-IN (or, failing that, hi-IN) voice the device happened to ship.
 * It is gone. Those voices flatten the aspirates, miss the retroflexes and put
 * the tone in the wrong place, so a beginner with no reference would have
 * learned the wrong pronunciation from the first lesson — and it is nobody's
 * idea of respect to hand someone a machine mangling their language.
 *
 * So: a recording, or nothing. Every content entry keeps its `audio` field.
 * As real recordings land, the buttons appear on their own, with no change to
 * any component.
 */

export type PlaybackRate = 0.75 | 1 | 1.25;

export const PLAYBACK_RATES: PlaybackRate[] = [0.75, 1, 1.25];

export interface SpeakOptions {
  /** A recorded clip for this exact text. Without one, nothing plays. */
  audio?: string;
  rate?: PlaybackRate;
}

/** True when this entry has a recording behind it. */
export function hasRecording(audio?: string): boolean {
  return typeof audio === "string" && audio.length > 0;
}

let currentAudio: HTMLAudioElement | null = null;

export function stop(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

/**
 * Play the recording for a piece of Punjabi. Resolves when playback finishes,
 * or immediately when there is no recording — callers never need to handle
 * the absence.
 */
export function play(options: SpeakOptions = {}): Promise<void> {
  stop();
  if (!hasRecording(options.audio)) return Promise.resolve();

  return new Promise((resolve) => {
    const el = new Audio(options.audio);
    el.playbackRate = options.rate ?? 1;
    currentAudio = el;
    el.addEventListener("ended", () => resolve(), { once: true });
    el.addEventListener("error", () => resolve(), { once: true });
    void el.play().catch(() => resolve());
  });
}
