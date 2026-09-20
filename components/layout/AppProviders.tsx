"use client";

import { useEffect, useSyncExternalStore } from "react";
import { progressStore } from "@/lib/progress";
import { settingsStore, useSettings } from "@/lib/settings";

/**
 * Hydration is a one-way external signal rather than component state: the
 * stores read localStorage once, and every subscriber is told at the same
 * moment. Kept out of React state so reading it never cascades a re-render.
 */
let hydrated = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * True once persisted progress and settings have been read from storage.
 * Screens that would otherwise flash an empty state — "Continue learning",
 * progress figures — wait on this rather than rendering zeros first.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => hydrated,
    () => false,
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    settingsStore.hydrate();
    progressStore.hydrate();
    if (hydrated) return;
    hydrated = true;
    for (const listener of listeners) listener();
  }, []);

  return (
    <>
      <ThemeSync />
      {children}
    </>
  );
}

/** Keeps <html data-theme> in step with the learner's choice. */
function ThemeSync() {
  const { theme } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}
