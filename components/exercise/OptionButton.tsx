"use client";

import type { ReactNode } from "react";

export type OptionState = "idle" | "chosen-correct" | "chosen-wrong" | "revealed";

const STATES: Record<OptionState, string> = {
  idle: "border-border bg-surface hover:border-border-strong hover:bg-surface-2",
  "chosen-correct": "border-correct bg-correct-soft text-correct",
  "chosen-wrong": "border-incorrect bg-incorrect-soft text-incorrect",
  // The right answer, shown after a wrong guess. Outlined, not filled: the
  // learner should read it, not feel it shouting.
  revealed: "border-correct bg-surface text-text",
};

export function OptionButton({
  state = "idle",
  disabled,
  onClick,
  children,
}: {
  state?: OptionState;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={state !== "idle" && state !== "revealed" ? true : undefined}
      className={[
        "w-full rounded-xl border px-4 py-3.5 text-left transition-colors",
        "disabled:pointer-events-none",
        STATES[state],
      ].join(" ")}
    >
      {children}
    </button>
  );
}
