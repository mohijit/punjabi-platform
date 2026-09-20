export function ProgressBar({
  value,
  total,
  label,
  showPercent = false,
}: {
  value: number;
  total: number;
  label?: string;
  showPercent?: boolean;
}) {
  const percent = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;

  return (
    <div>
      {(label || showPercent) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
          {label ? <span className="text-text-muted">{label}</span> : <span />}
          {showPercent ? <span className="tabular-nums text-text">{percent}%</span> : null}
        </div>
      )}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={label ?? "Progress"}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: percent + "%" }}
        />
      </div>
    </div>
  );
}

/** A large single number with a caption, used across the progress page. */
export function Stat({
  value,
  caption,
  sub,
}: {
  value: string | number;
  caption: string;
  sub?: string;
}) {
  return (
    <div>
      <div className="text-3xl font-semibold tabular-nums tracking-tight">{value}</div>
      <div className="mt-1 text-sm text-text-muted">{caption}</div>
      {sub ? <div className="mt-0.5 text-xs text-text-faint">{sub}</div> : null}
    </div>
  );
}
