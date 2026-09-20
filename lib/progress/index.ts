"use client";

import { createStore } from "@/lib/store";

/**
 * Progress is tracked per *item* (a letter, a vowel sign, a word, a sentence,
 * a grammar point) rather than as a streak, so the app can answer the only
 * questions that matter to a learner: what do I know, and what needs review?
 */
export type ItemKind = "letter" | "vowel" | "symbol" | "word" | "sentence" | "grammar";

export interface ItemRecord {
  kind: ItemKind;
  seen: number;
  correct: number;
  wrong: number;
  /** Consecutive correct answers; resets to 0 on a mistake. */
  streak: number;
  lastSeen: string;
  /** Spaced-repetition state. Recorded from day one; scheduled fully in Phase 2. */
  interval: number;
  ease: number;
  due: string;
}

export interface LessonRecord {
  completed: boolean;
  accuracy: number;
  completedAt?: string;
  /** Where the learner stopped, so a lesson can be resumed after a refresh. */
  stepIndex: number;
}

export type Ability =
  | "complete-beginner"
  | "understands-some"
  | "speaks-not-reads"
  | "reads-some"
  | "intermediate";

export type Goal =
  | "learn-gurmukhi"
  | "speak-with-family"
  | "understand-punjabi"
  | "read-punjabi"
  | "improve-vocabulary"
  | "become-fluent";

export interface ProgressState {
  onboarded: boolean;
  ability?: Ability;
  goal?: Goal;
  lessons: Record<string, LessonRecord>;
  items: Record<string, ItemRecord>;
  savedWords: string[];
  listening: { correct: number; total: number };
  sentencesCompleted: number;
  /** The lesson the homepage offers to continue. */
  currentLessonId?: string;
}

export const emptyProgress: ProgressState = {
  onboarded: false,
  lessons: {},
  items: {},
  savedWords: [],
  listening: { correct: 0, total: 0 },
  sentencesCompleted: 0,
};

export const progressStore = createStore<ProgressState>(
  "progress",
  emptyProgress,
  (raw, fallback) => {
    if (!raw || typeof raw !== "object") return fallback;
    return { ...fallback, ...(raw as Partial<ProgressState>) };
  },
);

export function useProgress(): ProgressState {
  return progressStore.useValue();
}

/** A stable key for any trackable item, e.g. "word:ਪਾਣੀ". */
export function itemId(kind: ItemKind, value: string): string {
  return kind + ":" + value;
}

function blankRecord(kind: ItemKind): ItemRecord {
  const now = new Date().toISOString();
  return {
    kind,
    seen: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    lastSeen: now,
    interval: 0,
    ease: 2.5,
    due: now,
  };
}

const DAY = 24 * 60 * 60 * 1000;

/**
 * A deliberately gentle SM-2 variant: intervals grow slowly at first so a
 * learner sees new material again soon, and a mistake sends an item back to
 * the next day rather than into a long relearning chain.
 */
function schedule(record: ItemRecord, wasCorrect: boolean): ItemRecord {
  const now = Date.now();
  let interval = record.interval;
  let ease = record.ease;

  if (wasCorrect) {
    ease = Math.min(2.8, ease + 0.05);
    if (interval === 0) interval = 1;
    else if (interval === 1) interval = 3;
    else interval = Math.round(interval * ease);
  } else {
    ease = Math.max(1.3, ease - 0.2);
    interval = 1;
  }

  return {
    ...record,
    ease,
    interval,
    due: new Date(now + interval * DAY).toISOString(),
    lastSeen: new Date(now).toISOString(),
  };
}

/** Record one answer against an item. This is the single write path. */
export function recordAnswer(kind: ItemKind, value: string, wasCorrect: boolean): void {
  const id = itemId(kind, value);
  progressStore.set((state) => {
    const existing = state.items[id] ?? blankRecord(kind);
    const updated = schedule(
      {
        ...existing,
        seen: existing.seen + 1,
        correct: existing.correct + (wasCorrect ? 1 : 0),
        wrong: existing.wrong + (wasCorrect ? 0 : 1),
        streak: wasCorrect ? existing.streak + 1 : 0,
      },
      wasCorrect,
    );
    return { ...state, items: { ...state.items, [id]: updated } };
  });
}

export function recordListening(wasCorrect: boolean): void {
  progressStore.set((state) => ({
    ...state,
    listening: {
      correct: state.listening.correct + (wasCorrect ? 1 : 0),
      total: state.listening.total + 1,
    },
  }));
}

export function recordSentenceCompleted(): void {
  progressStore.set((state) => ({
    ...state,
    sentencesCompleted: state.sentencesCompleted + 1,
  }));
}

export function saveLessonPosition(lessonId: string, stepIndex: number): void {
  progressStore.set((state) => {
    const existing =
      state.lessons[lessonId] ?? { completed: false, accuracy: 0, stepIndex: 0 };
    return {
      ...state,
      currentLessonId: lessonId,
      lessons: { ...state.lessons, [lessonId]: { ...existing, stepIndex } },
    };
  });
}

export function completeLesson(lessonId: string, accuracy: number): void {
  progressStore.set((state) => {
    const existing =
      state.lessons[lessonId] ?? { completed: false, accuracy: 0, stepIndex: 0 };
    return {
      ...state,
      lessons: {
        ...state.lessons,
        [lessonId]: {
          completed: true,
          // Keep the learner's best run rather than their most recent one.
          accuracy: Math.max(existing.accuracy, accuracy),
          completedAt: new Date().toISOString(),
          stepIndex: 0,
        },
      },
    };
  });
}

export function setCurrentLesson(lessonId: string): void {
  progressStore.set((state) => ({ ...state, currentLessonId: lessonId }));
}

export function setOnboarding(ability: Ability, goal: Goal, recommendedLessonId: string): void {
  progressStore.set((state) => ({
    ...state,
    onboarded: true,
    ability,
    goal,
    currentLessonId: state.currentLessonId ?? recommendedLessonId,
  }));
}

export function skipOnboarding(firstLessonId: string): void {
  progressStore.set((state) => ({
    ...state,
    onboarded: true,
    currentLessonId: state.currentLessonId ?? firstLessonId,
  }));
}

export function toggleSavedWord(gurmukhi: string): void {
  progressStore.set((state) => ({
    ...state,
    savedWords: state.savedWords.includes(gurmukhi)
      ? state.savedWords.filter((word) => word !== gurmukhi)
      : [...state.savedWords, gurmukhi],
  }));
}

export function resetProgress(): void {
  progressStore.reset();
}

/* ----------------------------- derived reads ----------------------------- */

/** An item counts as mastered once it is answered correctly three times running. */
export const MASTERY_STREAK = 3;

export function isMastered(state: ProgressState, kind: ItemKind, value: string): boolean {
  const record = state.items[itemId(kind, value)];
  return Boolean(record && record.streak >= MASTERY_STREAK);
}

export function masteredCount(state: ProgressState, kind: ItemKind): number {
  return Object.values(state.items).filter(
    (record) => record.kind === kind && record.streak >= MASTERY_STREAK,
  ).length;
}

/** Any item seen at least once counts as learned, mastered or not. */
export function learnedCount(state: ProgressState, kind: ItemKind): number {
  return Object.values(state.items).filter(
    (record) => record.kind === kind && record.seen > 0,
  ).length;
}

export function dueItems(state: ProgressState, now = Date.now()): Array<[string, ItemRecord]> {
  return Object.entries(state.items)
    .filter(([, record]) => new Date(record.due).getTime() <= now)
    .sort((a, b) => new Date(a[1].due).getTime() - new Date(b[1].due).getTime());
}

/** Items the learner keeps getting wrong, worst first. */
export function weakItems(state: ProgressState): Array<[string, ItemRecord]> {
  return Object.entries(state.items)
    .filter(([, record]) => record.wrong > 0 && record.streak < MASTERY_STREAK)
    .sort((a, b) => b[1].wrong - a[1].wrong);
}

export function completedLessonCount(state: ProgressState): number {
  return Object.values(state.lessons).filter((lesson) => lesson.completed).length;
}

export function listeningAccuracy(state: ProgressState): number | null {
  if (state.listening.total === 0) return null;
  return Math.round((state.listening.correct / state.listening.total) * 100);
}
