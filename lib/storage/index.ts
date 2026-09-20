/**
 * Storage lives behind an interface so the whole app can later be pointed at
 * a server or a native store by swapping the adapter, with no other changes.
 */

export interface StorageAdapter {
  get<T>(key: string, fallback: T): T;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  /** All app-owned keys, without the internal prefix. */
  keys(): string[];
}

const PREFIX = "punjabi.v1.";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

class LocalStorageAdapter implements StorageAdapter {
  /** Used before hydration and when localStorage is unavailable (private mode). */
  private memory = new Map<string, string>();

  private read(key: string): string | null {
    if (!isBrowser()) return this.memory.get(key) ?? null;
    try {
      return window.localStorage.getItem(PREFIX + key);
    } catch {
      return this.memory.get(key) ?? null;
    }
  }

  private write(key: string, raw: string): void {
    this.memory.set(key, raw);
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(PREFIX + key, raw);
    } catch {
      // Quota exceeded or storage blocked: the in-memory copy still serves
      // this session, so the learner is never interrupted mid-lesson.
    }
  }

  get<T>(key: string, fallback: T): T {
    const raw = this.read(key);
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      this.write(key, JSON.stringify(value));
    } catch {
      // Value could not be serialised; nothing useful to store.
    }
  }

  remove(key: string): void {
    this.memory.delete(key);
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(PREFIX + key);
    } catch {
      // Ignore.
    }
  }

  keys(): string[] {
    if (!isBrowser()) return [...this.memory.keys()];
    try {
      const found: string[] = [];
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (key?.startsWith(PREFIX)) found.push(key.slice(PREFIX.length));
      }
      return found;
    } catch {
      return [...this.memory.keys()];
    }
  }
}

export const storage: StorageAdapter = new LocalStorageAdapter();

/** Everything the learner has built up, as a portable JSON backup. */
export function exportAll(): string {
  const data: Record<string, unknown> = {};
  for (const key of storage.keys()) {
    data[key] = storage.get(key, null);
  }
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data }, null, 2);
}

export function importAll(json: string): { ok: true } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: "That file is not valid JSON." };
  }
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("data" in parsed) ||
    typeof (parsed as { data: unknown }).data !== "object" ||
    (parsed as { data: unknown }).data === null
  ) {
    return { ok: false, error: "That file is not a Punjabi progress backup." };
  }
  const data = (parsed as { data: Record<string, unknown> }).data;
  for (const [key, value] of Object.entries(data)) {
    storage.set(key, value);
  }
  return { ok: true };
}
