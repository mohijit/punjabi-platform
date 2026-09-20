import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const BASE = "bg-surface border border-border rounded-2xl";

export function Card({
  className,
  children,
  ...props
}: { children: ReactNode } & ComponentProps<"div">) {
  return (
    <div className={[BASE, "p-5 sm:p-6", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

/** A card that is itself a link, used for lesson and section entry points. */
export function CardLink({
  className,
  children,
  ...props
}: { children: ReactNode } & ComponentProps<typeof Link>) {
  return (
    <Link
      className={[
        BASE,
        "block p-5 sm:p-6 transition-colors hover:border-border-strong hover:bg-surface-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Link>
  );
}

export function SectionHeading({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-text-faint">
        {children}
      </h2>
      {hint ? <span className="text-sm text-text-muted">{hint}</span> : null}
    </div>
  );
}
