"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { Mic } from "lucide-react";

export function HeroMicOrb() {
  const [state, setState] = useState<"idle" | "listening">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { authenticated } = usePrivy();
  const router = useRouter();

  const cancel = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setState("idle");
  }, []);

  const handleClick = useCallback(() => {
    if (state === "listening") {
      cancel();
      return;
    }

    setState("listening");
    timerRef.current = setTimeout(() => {
      if (authenticated) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
      setState("idle");
    }, 1500);
  }, [state, authenticated, router, cancel]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative grid place-items-center cursor-pointer group"
      style={{ width: "clamp(260px, 30vw, 340px)", maxWidth: "85vw", aspectRatio: "1" }}
      aria-label={state === "idle" ? "Tap to try VoiceFi" : "Listening — tap to cancel"}
      aria-pressed={state !== "idle"}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Halos */}
      {state === "listening" && (
        <>
          <div
            className="absolute inset-[-4%] rounded-full animate-halo-breathe"
            style={{
              background: "radial-gradient(circle, rgba(47,125,225,0.25) 0%, rgba(47,125,225,0) 65%)",
              animationDelay: "0.5s",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-[6%] rounded-full animate-halo-breathe"
            style={{
              background: "radial-gradient(circle, rgba(47,125,225,0.3) 0%, rgba(47,125,225,0) 65%)",
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Orb */}
      <div
        className="relative grid place-items-center text-white transition-transform duration-200 group-hover:scale-[1.04] active:scale-[0.96]"
        style={{
          width: "82%",
          height: "82%",
          borderRadius: "999px",
          background: "radial-gradient(circle at 28% 28%, #6BB8FF 0%, #2F7DE1 40%, #1A5CBF 80%, #0E3D8A 100%)",
          boxShadow: "0 40px 100px rgba(47,125,225,0.45), inset 0 0 0 1px rgba(255,255,255,0.12), inset 0 2px 0 rgba(255,255,255,0.25)",
          animation: state === "idle" ? "orb-float 8s ease-in-out infinite, orb-glow-pulse 4s ease-in-out infinite" : "none",
        }}
        aria-hidden="true"
      >
        {/* Reflection */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 70% 70%, rgba(255,255,255,0.06) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {state === "idle" ? (
          <Mic size={56} strokeWidth={1.5} />
        ) : (
          <span className="flex gap-[5px] items-center h-[38px]" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="block w-[5px] bg-white rounded-[6px] animate-sound-wave"
                style={{
                  height: 20 + i * 4,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </span>
        )}
      </div>
    </button>
  );
}
