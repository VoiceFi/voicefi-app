"use client";

import { useEffect, useRef } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationOverlayProps {
  amount: number;
  recipient: string;
  note?: string;
  token?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function formatAmount(amount: number, token: string): string {
  const t = token.trim().toUpperCase();
  if (t === "SOL") {
    return `${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} SOL`;
  }
  if (t === "USDC") {
    return `$${amount.toFixed(2)}`;
  }
  return `${amount} ${t}`;
}

export function ConfirmationOverlay({
  amount,
  recipient,
  note,
  token = "USDC",
  onConfirm,
  onCancel,
}: ConfirmationOverlayProps) {
  const formattedAmount = formatAmount(amount, token);
  const overlayRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    confirmBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
        return;
      }
      if (e.key === "Tab") {
        const focusable = overlay.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
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
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onCancel]);

  return (
    <div
      ref={overlayRef}
      className="confirm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="relative bg-[var(--card)] rounded-[28px] p-10 max-w-[440px] w-full text-center shadow-[0_30px_80px_rgba(20,20,30,0.18)]">
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
          {formattedAmount}
        </div>
        <div className="text-[var(--muted-foreground)] text-[17px] mb-8">
          to <span className="text-[var(--foreground)] font-semibold">{recipient}</span>
          {note && <> · <span>{note}</span></>}
        </div>

        <div className="flex flex-col gap-3 items-center">
          <Button
            ref={confirmBtnRef}
            onClick={onConfirm}
            className="w-full"
            size="lg"
          >
            Confirm {formattedAmount}
          </Button>

          <Button
            variant="ghost"
            onClick={onCancel}
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
