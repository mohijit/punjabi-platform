"use client";

import { useEffect, useRef } from "react";
import { AudioButton, useVoiceStatus } from "@/components/ui/AudioButton";
import { OptionButton, type OptionState } from "./OptionButton";
import { Prompt } from "./Prompt";
import { optionsOf, normaliseAnswer } from "@/lib/exercises";
import { speak } from "@/lib/audio";
import { useSettings } from "@/lib/settings";
import type { ExerciseProps } from "./types";
import type { Exercise } from "@/content/schema";

type Listening = Extract<Exercise, { type: "listening" }>;

/**
 * "Which word did you hear?" The Punjabi is never shown until the answer is
 * in — otherwise the learner reads instead of listening. If the device has no
 * Punjabi voice the exercise says so and reveals the text, rather than asking
 * someone to identify silence.
 */
export function ListeningExercise({
  exercise,
  given,
  result,
  onSubmit,
}: ExerciseProps<Listening>) {
  const options = optionsOf(exercise);
  const answered = result !== null;
  const { playbackRate } = useSettings();
  const status = useVoiceStatus();
  const playedFor = useRef<string | null>(null);

  const silent = status === "unsupported" || (status === "missing" && !exercise.audio);

  // Play once when the exercise appears, so the learner is not left tapping.
  useEffect(() => {
    if (silent || status === "unknown") return;
    if (playedFor.current === exercise.say) return;
    playedFor.current = exercise.say;
    void speak(exercise.say, { audio: exercise.audio, rate: playbackRate });
  }, [exercise.say, exercise.audio, playbackRate, silent, status]);

  function stateOf(option: string): OptionState {
    if (!answered) return "idle";
    const isChosen = normaliseAnswer(option) === normaliseAnswer(String(given));
    const isAnswer = normaliseAnswer(option) === normaliseAnswer(exercise.answer);
    if (isChosen) return isAnswer ? "chosen-correct" : "chosen-wrong";
    if (isAnswer) return "revealed";
    return "idle";
  }

  return (
    <div className="space-y-6">
      <Prompt>{exercise.prompt}</Prompt>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface-2 px-4 py-8">
        {silent ? (
          <>
            <p className="pa-xl" lang="pa">
              {exercise.say}
            </p>
            <p className="text-sm text-text-muted">
              No Punjabi voice on this device, so the word is shown instead.
            </p>
          </>
        ) : (
          <>
            <AudioButton text={exercise.say} audio={exercise.audio} size="lg" label="the word" />
            <p className="text-sm text-text-muted">Tap to hear it again</p>
          </>
        )}
      </div>

      <div className="grid gap-2.5">
        {options.map((option) => (
          <OptionButton
            key={option}
            state={stateOf(option)}
            disabled={answered}
            onClick={() => onSubmit(option)}
          >
            {exercise.optionScript === "gurmukhi" ? (
              <span className="pa-md" lang="pa">
                {option}
              </span>
            ) : (
              <span>{option}</span>
            )}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
