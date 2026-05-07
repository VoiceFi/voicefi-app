"use client";

import { Mic } from "lucide-react";
import type { VoiceState } from "@/types/voice";
import { cn } from "@/lib/utils";

interface MicOrbProps {
  state: VoiceState;
  onClick: () => void;
}

export function MicOrb({ state, onClick }: MicOrbProps) {
  // TODO: ElevenLabs integration here — wire `useConversation` from `@elevenlabs/react`
  // to drive `state` (idle/listening/speaking) and pipe audio in/out.
  const ariaLabel =
    state === "idle" ? "Tap to speak" :
    state === "listening" ? "Listening — tap to stop" :
    state === "speaking" ? "Assistant is speaking" :
    "Awaiting confirmation";

  return (
    <div className="mic-stage" role="group" aria-label="Voice control">
      {(state === "listening" || state === "speaking") && (
        <span className={cn("mic-halo", state)} aria-hidden="true" />
      )}
      <span className={cn("mic-orb-bg", state)} aria-hidden="true" />
      <button
        type="button"
        onClick={onClick}
        className={cn("mic-button", state === "idle" && "idle")}
        aria-label={ariaLabel}
        aria-pressed={state !== "idle"}
      >
        {state === "idle" && <Mic size={48} strokeWidth={2} />}
        {state === "listening" && (
          <span className="wave-bars" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="animate-sound-wave"
                style={{ height: 20 + i * 4, animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </span>
        )}
        {state === "speaking" && (
          <span className="wave-bars" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="animate-speaking-wave"
                style={{ height: 24 + (i % 2) * 8, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </span>
        )}
      </button>
    </div>
  );
}
