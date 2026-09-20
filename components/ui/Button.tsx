import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "quiet";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-text hover:bg-accent-hover border border-transparent shadow-sm",
  secondary: "bg-surface text-text border border-border-strong hover:bg-surface-2",
  quiet: "bg-transparent text-text-muted hover:text-text hover:bg-surface-2 border border-transparent",
};

const SIZES: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 rounded-lg",
  md: "text-[0.95rem] px-4 py-2.5 rounded-xl",
  lg: "text-base px-6 py-3.5 rounded-xl font-medium",
};

const BASE =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-45 disabled:pointer-events-none select-none";

function classes(variant: Variant, size: Size, className?: string): string {
  return [BASE, VARIANTS[variant], SIZES[size], className].filter(Boolean).join(" ");
}

interface Shared {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Shared & ComponentProps<"button">) {
  return (
    <button className={classes(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Shared & ComponentProps<typeof Link>) {
  return (
    <Link className={classes(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
