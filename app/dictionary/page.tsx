import type { Metadata } from "next";
import { DictionarySearch } from "@/components/dictionary/Search";

export const metadata: Metadata = {
  title: "Dictionary — Learn Punjabi",
  description: "Look up a Punjabi word in Gurmukhi, romanised Punjabi or English.",
};

export default function DictionaryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-medium">Dictionary</h1>
      <p className="mt-2 text-text-muted">Every word the course has taught you.</p>
      <div className="mt-8">
        <DictionarySearch />
      </div>
    </div>
  );
}
