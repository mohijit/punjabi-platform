import type { Lesson } from "@/content/schema";
import { lessonFirstWords } from "./lesson-01-first-words";

/**
 * The course, in order.
 *
 * Gurmukhi lessons and spoken-Punjabi lessons alternate deliberately: a
 * learner should never have to finish the whole script before they can say
 * anything, and should never get twenty lessons deep in speaking without being
 * able to read a word of it.
 *
 * Nothing here is locked. `recommendedNext` is a suggestion the course map
 * highlights, not a gate.
 */

export const lessons: Lesson[] = [lessonFirstWords];

export const lessonsById = new Map(lessons.map((lesson) => [lesson.id, lesson]));

export function getLesson(id: string): Lesson | undefined {
  return lessonsById.get(id);
}

export function lessonIndex(id: string): number {
  return lessons.findIndex((lesson) => lesson.id === id);
}

/** The lesson after this one, or undefined at the end of what exists. */
export function nextLesson(id: string): Lesson | undefined {
  const index = lessonIndex(id);
  return index === -1 ? undefined : lessons[index + 1];
}

/** The first lesson a learner has not completed, else the last one. */
export function recommendedNext(completed: (id: string) => boolean): Lesson {
  return lessons.find((lesson) => !completed(lesson.id)) ?? lessons[lessons.length - 1];
}
