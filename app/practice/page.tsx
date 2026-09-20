import type { Metadata } from "next";
import { PracticeScreen } from "@/components/practice/PracticeScreen";

export const metadata: Metadata = {
  title: "Practice — Learn Punjabi",
  description: "What is due for review, and what keeps catching you out.",
};

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-medium">Practice</h1>
      <p className="mt-2 max-w-prose text-text-muted">
        Review is spaced on purpose: things you know well come back rarely, things you keep
        missing come back soon.
      </p>
      <PracticeScreen />
    </div>
  );
}
