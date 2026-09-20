import type { Metadata } from "next";
import { ProgressScreen } from "@/components/progress/ProgressScreen";

export const metadata: Metadata = {
  title: "Progress — Learn Punjabi",
  description: "What you can read, say and recognise so far.",
};

export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-medium">Progress</h1>
      <p className="mt-2 text-text-muted">What you can do now, not how often you showed up.</p>
      <ProgressScreen />
    </div>
  );
}
