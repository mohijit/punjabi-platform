import type { Metadata } from "next";
import { CardLink } from "@/components/ui/Card";
import { lessons } from "@/content";

export const metadata: Metadata = {
  title: "The course — Learn Punjabi",
  description: "Gurmukhi and spoken Punjabi lessons, in order.",
};

/**
 * A plain list for now. The full course map — the alternating Gurmukhi and
 * spoken path with per-lesson progress — arrives with the rest of the units.
 */
export default function LearnPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-medium">The course</h1>
      <p className="mt-2 text-text-muted">
        Gurmukhi and spoken Punjabi, alternating. Nothing is locked — start anywhere.
      </p>

      <div className="mt-8 space-y-3">
        {lessons.map((lesson) => (
          <CardLink key={lesson.id} href={"/learn/" + lesson.id}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-xs uppercase tracking-[0.12em] text-text-faint">
                {lesson.unit}
              </span>
              <span className="text-xs text-text-faint">{lesson.minutes} min</span>
            </div>
            <h2 className="mt-2 text-lg font-medium">
              {lesson.number}. {lesson.title}
            </h2>
            <p className="mt-1 text-sm text-text-muted">{lesson.goal}</p>
          </CardLink>
        ))}
      </div>
    </div>
  );
}
