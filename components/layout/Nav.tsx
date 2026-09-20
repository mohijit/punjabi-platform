"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { setSetting, useSettings } from "@/lib/settings";

/** The whole of the app's navigation. Seven destinations, nothing more. */
const NAV = [
  { href: "/learn", label: "Learn" },
  { href: "/gurmukhi", label: "Gurmukhi" },
  { href: "/vocabulary", label: "Vocabulary" },
  { href: "/grammar", label: "Grammar" },
  { href: "/practice", label: "Practice" },
  { href: "/dictionary", label: "Dictionary" },
  { href: "/progress", label: "Progress" },
] as const;

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-6 px-4">
        <Link
          href="/"
          className="pa text-xl font-medium leading-none tracking-tight"
          aria-label="Home"
        >
          ਸਿੱਖ
        </Link>

        <nav aria-label="Main" className="hidden flex-1 md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className={[
                    "rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive(pathname, item.href)
                      ? "bg-surface-2 font-medium text-text"
                      : "text-text-muted hover:text-text",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto md:ml-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

/** On phones the same seven destinations live in a scrollable bottom bar. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="sticky bottom-0 z-30 border-t border-border bg-bg/95 backdrop-blur md:hidden"
    >
      <ul className="flex overflow-x-auto px-2 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV.map((item) => (
          <li key={item.href} className="shrink-0">
            <Link
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={[
                "block rounded-lg px-3.5 py-2 text-sm transition-colors",
                isActive(pathname, item.href)
                  ? "bg-surface-2 font-medium text-text"
                  : "text-text-muted",
              ].join(" ")}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** The OS colour-scheme preference, read as the external signal it is. */
function subscribeSystemTheme(listener: () => void): () => void {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

export function ThemeToggle() {
  const { theme } = useSettings();
  const systemDark = useSyncExternalStore(
    subscribeSystemTheme,
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    () => false,
  );
  const resolved = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  return (
    <button
      type="button"
      onClick={() => setSetting("theme", resolved === "dark" ? "light" : "dark")}
      aria-label={resolved === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
    >
      {resolved === "dark" ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
