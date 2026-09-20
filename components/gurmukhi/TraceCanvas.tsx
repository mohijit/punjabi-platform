"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Trace a letter over a faded outline of itself.
 *
 * There is no score. A pixel-overlap number would be easy to compute and would
 * mean nothing about handwriting — it rewards covering the guide rather than
 * making the strokes in the right order, which is the only part that matters.
 * So this shows the shape, gets out of the way, and lets the learner judge.
 */
export function TraceCanvas({ letter, guide }: { letter: string; guide: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  /** Bumped by Clear, to redraw the guide on an empty surface. */
  const [clearedAt, setClearedAt] = useState(0);

  const prepare = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const ratio = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    canvas.width = size * ratio;
    canvas.height = size * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, size, size);

    // The guide and the ink share one surface, so both colours come from the
    // stylesheet and both follow the theme.
    const styles = getComputedStyle(canvas);
    const guideColour = styles.getPropertyValue("--trace-guide").trim();
    const inkColour = styles.getPropertyValue("--trace-ink").trim();

    context.fillStyle = guideColour || "#d4d4d8";
    // The canvas element carries the Gurmukhi font class, so the exact family
    // the rest of the app renders with is read back rather than guessed at.
    context.font = Math.round(size * 0.68) + "px " + styles.fontFamily;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(letter, size / 2, size / 2);

    context.strokeStyle = inkColour || "#18181b";
    context.lineWidth = Math.max(4, size * 0.022);
    context.lineCap = "round";
    context.lineJoin = "round";
  }, [letter]);

  useEffect(() => {
    prepare();
  }, [prepare, clearedAt]);

  function positionOf(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    const { x, y } = positionOf(event);
    context.beginPath();
    context.moveTo(x, y);
  }

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    const { x, y } = positionOf(event);
    context.lineTo(x, y);
    context.stroke();
  }

  function end() {
    drawing.current = false;
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        aria-label={"Tracing area for the letter " + letter}
        className="font-gurmukhi aspect-square w-full touch-none rounded-2xl border border-border bg-surface"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerLeave={end}
      />
      <div className="mt-3 flex items-start justify-between gap-4">
        <p className="max-w-prose text-sm text-text-muted">{guide}</p>
        <button
          type="button"
          onClick={() => setClearedAt((value) => value + 1)}
          className="shrink-0 text-sm text-text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
