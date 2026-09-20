"use client";

import type { ReactNode } from "react";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  /** Announced to screen readers when the visible label is Gurmukhi. */
  srLabel?: string;
}

/**
 * A small set of mutually exclusive choices: script mode, playback speed,
 * card direction. Preferred over a dropdown so the options stay visible.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const padding = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm";

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex gap-1 rounded-xl border border-border bg-surface p-1"
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.srLabel}
            onClick={() => onChange(option.value)}
            className={[
              "rounded-lg font-medium transition-colors",
              padding,
              selected
                ? "bg-accent text-accent-text"
                : "text-text-muted hover:bg-surface-2 hover:text-text",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
