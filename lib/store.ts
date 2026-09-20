"use client";

import { useSyncExternalStore } from "react";
import { storage } from "@/lib/storage";

/**
 * A minimal persisted store. Deliberately not a state library: the app has a
 * handful of long-lived slices (settings, progress) and this keeps them
 * readable, synchronous and easy to move behind a server later.
 */
export interface Store<T> {
  get(): T;
  set(updater: T | ((previous: T) => T)): void;
  reset(): void;
  subscribe(listener: () => void): () => void;
  /** Reads the persisted value once the browser is available. */
  hydrate(): void;
  useValue(): T;
}

export function createStore<T>(
  key: string,
  initial: T,
  migrate: (raw: unknown, fallback: T) => T = (raw, fallback) =>
    raw && typeof raw === "object" ? { ...fallback, ...(raw as object) } : fallback,
): Store<T> {
  let value = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((listener) => listener());

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const hydrate = () => {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    const raw = storage.get<unknown>(key, null);
    if (raw !== null) {
      value = migrate(raw, initial);
      emit();
    }
  };

  return {
    get: () => value,
    set(updater) {
      const next =
        typeof updater === "function" ? (updater as (previous: T) => T)(value) : updater;
      if (Object.is(next, value)) return;
      value = next;
      storage.set(key, value);
      emit();
    },
    reset() {
      value = initial;
      storage.remove(key);
      emit();
    },
    subscribe,
    hydrate,
    useValue() {
      // The server snapshot is always `initial`, so the first client render
      // matches the server and hydration never mismatches; the persisted
      // value is applied immediately afterwards by StoreHydrator.
      return useSyncExternalStore(
        subscribe,
        () => value,
        () => initial,
      );
    },
  };
}
