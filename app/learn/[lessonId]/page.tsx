import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { getLesson, lessons } from "@/content";

/**
 * Every lesson is data, so every lesson route is prerendered at build time and
 * the player is the only client code involved.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonId: lesson.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/learn/[lessonId]">): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) return { title: "Lesson not found" };
  return { title: lesson.title + " — Learn Punjabi", description: lesson.goal };
}

export default async function LessonPage({ params }: PageProps<"/learn/[lessonId]">) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();

  return (
    <div className="px-4 py-6 sm:py-8">
      <LessonPlayer lesson={lesson} />
    </div>
  );
}
