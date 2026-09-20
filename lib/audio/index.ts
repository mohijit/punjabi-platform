/**
 * Audio service.
 *
 * Punjabi audio is spoken at runtime with the Web Speech API using a pa-IN
 * voice. Every content entry also carries an `audio` field: when that field
 * holds a file URL it is played instead, so recorded narration can replace
 * synthesis later without touching a single component.
 */

export type PlaybackRate = 0.75 | 1 | 1.25;

export const PLAYBACK_RATES: PlaybackRate[] = [0.75, 1, 1.25];

export type VoiceStatus = "unknown" | "ready" | "missing" | "unsupported";

export interface SpeakOptions {
  /** A recorded clip for this exact text, when one exists. */
  audio?: string;
  rate?: PlaybackRate;
}

function synth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

/**
 * Prefer a true Punjabi voice. Hindi is an imperfect but intelligible
 * stand-in on systems that ship no pa-IN voice, and is far better than
 * an English voice mangling Gurmukhi text.
 */
function pickVoice(): SpeechSynthesisVoice | null {
  const s = synth();
  if (!s) return null;
  const voices = s.getVoices();
  if (voices.length === 0) return null;

  const byLang = (prefix: string) =>
    voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith(prefix));

  return byLang("pa-in") ?? byLang("pa") ?? byLang("hi-in") ?? byLang("hi") ?? null;
}

export function voiceStatus(): VoiceStatus {
  const s = synth();
  if (!s) return "unsupported";
  if (s.getVoices().length === 0) return "unknown";
  const voice = pickVoice();
  if (!voice) return "missing";
  return "ready";
}

/** True when the chosen voice is a real Punjabi voice rather than a fallback. */
export function hasPunjabiVoice(): boolean {
  const voice = pickVoice();
  return Boolean(voice && voice.lang.toLowerCase().startsWith("pa"));
}

/** Voice lists load asynchronously in some browsers. */
export function onVoicesReady(callback: () => void): () => void {
  const s = synth();
  if (!s) return () => {};
  const handler = () => callback();
  s.addEventListener("voiceschanged", handler);
  if (s.getVoices().length > 0) callback();
  return () => s.removeEventListener("voiceschanged", handler);
}

let currentAudio: HTMLAudioElement | null = null;

export function stop(): void {
  synth()?.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

/**
 * Speak a piece of Punjabi. Resolves when playback finishes, or immediately
 * when no audio is available — callers never need to handle the absence.
 */
export function speak(text: string, options: SpeakOptions = {}): Promise<void> {
  const rate = options.rate ?? 1;
  stop();

  if (options.audio) {
    return new Promise((resolve) => {
      const el = new Audio(options.audio);
      el.playbackRate = rate;
      currentAudio = el;
      el.addEventListener("ended", () => resolve(), { once: true });
      el.addEventListener("error", () => resolve(), { once: true });
      void el.play().catch(() => resolve());
    });
  }

  const s = synth();
  if (!s) return Promise.resolve();

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? "pa-IN";
    // Synthesised Punjabi is easier to follow slightly under normal speed.
    utterance.rate = rate * 0.9;
    utterance.addEventListener("end", () => resolve(), { once: true });
    utterance.addEventListener("error", () => resolve(), { once: true });
    s.speak(utterance);
  });
}
