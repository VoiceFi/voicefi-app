"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const HOLD_MS = 2000;

interface ConfirmationOverlayProps {
  amount: number;
  recipient: string;
  note?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationOverlay({
  amount,
  recipient,
  note,
  onConfirm,
  onCancel,
}: ConfirmationOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const startRef = useRef(0);
  const rafRef = useRef(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  // Focus trap + initial focus + Escape
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Move focus to confirm button when overlay opens
    confirmBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
        return;
      }

      // Focus trap: cycle Tab within the overlay
      if (e.key === "Tab") {
        const focusable = overlay.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent scrolling on body
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      cancelAnimationFrame(rafRef.current);
    };
  }, [onCancel]);

  const tick = useCallback(() => {
    const elapsed = performance.now() - startRef.current;
    const p = Math.min(1, elapsed / HOLD_MS);
    setProgress(p);
    if (p >= 1) {
      setHolding(false);
      cancelAnimationFrame(rafRef.current);
      onConfirm();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [onConfirm]);

  const startHold = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-hold]")) return;
    startRef.current = performance.now();
    setHolding(true);
    rafRef.current = requestAnimationFrame(tick);
  };

  const stopHold = () => {
    cancelAnimationFrame(rafRef.current);
    setHolding(false);
    const start = performance.now();
    const startVal = progress;
    const decay = (now: number) => {
      const t = Math.min(1, (now - start) / 220);
      const v = startVal * (1 - t);
      setProgress(v);
      if (t < 1) requestAnimationFrame(decay);
    };
    if (startVal > 0) requestAnimationFrame(decay);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const R = 64;
  const C = 2 * Math.PI * R;
  const dash = C * (1 - progress);

  return (
    <div
      ref={overlayRef}
      className="confirm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onPointerDown={startHold}
      onPointerUp={stopHold}
      onPointerLeave={stopHold}
      onPointerCancel={stopHold}
    >
      <div
        className={`relative bg-[var(--card)] rounded-[28px] p-10 max-w-[440px] w-full text-center shadow-[0_30px_80px_rgba(20,20,30,0.18)] ${
          !holding && progress === 0 ? "animate-pulse-soft" : ""
        }`}
      >
        <div className="relative w-[88px] h-[88px] mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-[rgba(74,144,217,0.12)]" />
          <div className="relative w-[88px] h-[88px] grid place-items-center text-[var(--primary)]">
            <Shield size={36} />
          </div>
        </div>

        <p className="text-[var(--muted-foreground)] text-[15px] mb-2">You&rsquo;re about to send</p>
        <div
          id="confirm-title"
          className="font-bold tracking-tight leading-none mb-1.5"
          style={{ fontSize: "clamp(36px, 6vw, 48px)" }}
        >
          ${amount.toFixed(2)}
        </div>
        <div className="text-[var(--muted-foreground)] text-[17px] mb-7">
          to <span className="text-[var(--foreground)] font-semibold">{recipient}</span>
          {note && <> · <span>{note}</span></>}
        </div>

        {/* Press-and-hold target */}
        <div className="relative w-[168px] h-[168px] mx-auto mb-6">
          <svg
            width="168"
            height="168"
            viewBox="0 0 168 168"
            aria-hidden="true"
            className="absolute inset-0"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle cx="84" cy="84" r={R} fill="none" stroke="var(--muted)" strokeWidth="6" />
            <circle
              cx="84"
              cy="84"
              r={R}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={dash}
              style={{ transition: holding ? "none" : "stroke-dashoffset 0.18s ease" }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-[var(--primary)]">
            <div className="text-center">
              <Mic size={28} strokeWidth={2} className="mx-auto" />
              <div className="text-[13px] font-semibold mt-1">
                {holding ? `${Math.round(progress * 100)}%` : "Hold"}
              </div>
            </div>
          </div>
        </div>

        <p
          aria-live="polite"
          className="text-[var(--primary)] font-semibold text-[17px] mb-5 tracking-tight"
        >
          {holding ? "Keep holding…" : "Press and hold to confirm"}
        </p>

        {/* Accessible alternative: Confirm button */}
        <div className="flex flex-col gap-3 items-center">
          <Button
            ref={confirmBtnRef}
            onClick={onConfirm}
            data-no-hold
            className="w-full"
            size="lg"
          >
            Confirm ${amount.toFixed(2)}
          </Button>

          <Button
            ref={cancelBtnRef}
            variant="ghost"
            onClick={onCancel}
            data-no-hold
            aria-label="Cancel transaction"
            className="text-sm text-[var(--muted-foreground)]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
