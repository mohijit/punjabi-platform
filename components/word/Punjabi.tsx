"use client";

import type { ReactNode } from "react";
import { useSettings } from "@/lib/settings";

type Size = "hero" | "xl" | "lg" | "md" | "sm";

const GURMUKHI_CLASS: Record<Size, string> = {
  hero: "pa-hero",
  xl: "pa-xl",
  lg: "pa-lg",
  md: "pa-md",
  sm: "pa",
};

const ROMAN_CLASS: Record<Size, string> = {
  hero: "text-lg sm:text-xl",
  xl: "text-base sm:text-lg",
  lg: "text-[0.95rem]",
  md: "text-sm",
  sm: "text-sm",
};

/**
 * The one place Punjabi is rendered, so the global script mode is honoured
 * everywhere without every component remembering to check it.
 *
 * `alwaysGurmukhi` exists for the cases where hiding the script would defeat
 * the exercise — a reading drill in Roman-only mode is not a reading drill.
 */
export function Punjabi({
  gurmukhi,
  roman,
  english,
  size = "md",
  alwaysGurmukhi = false,
  hideRoman = false,
  className,
  children,
}: {
  gurmukhi: string;
  roman?: string;
  english?: string;
  size?: Size;
  alwaysGurmukhi?: boolean;
  /** Hides the transliteration regardless of settings, for recall exercises. */
  hideRoman?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const { scriptMode, showTransliteration } = useSettings();

  const romanOnly = scriptMode === "roman" && !alwaysGurmukhi && roman !== undefined;
  const showRoman =
    !hideRoman && roman !== undefined && (scriptMode !== "gurmukhi" || showTransliteration);

  return (
    <div className={["flex flex-col items-center gap-1 text-center", className].filter(Boolean).join(" ")}>
      {romanOnly ? (
        <p className={[ROMAN_CLASS[size], "roman font-medium text-text"].join(" ")}>{roman}</p>
      ) : (
        <>
          <p className={GURMUKHI_CLASS[size]} lang="pa">
            {gurmukhi}
          </p>
          {showRoman ? <p className={["roman", ROMAN_CLASS[size]].join(" ")}>{roman}</p> : null}
        </>
      )}
      {english ? <p className="text-sm text-text-muted">{english}</p> : null}
      {children}
    </div>
  );
}

/** Inline variant, for Punjabi inside a line of English prose. */
export function PunjabiInline({
  gurmukhi,
  roman,
  className,
}: {
  gurmukhi: string;
  roman?: string;
  className?: string;
}) {
  const { scriptMode } = useSettings();
  if (scriptMode === "roman" && roman) {
    return <span className={["roman", className].filter(Boolean).join(" ")}>{roman}</span>;
  }
  return (
    <span className={["pa", className].filter(Boolean).join(" ")} lang="pa">
      {gurmukhi}
    </span>
  );
}
