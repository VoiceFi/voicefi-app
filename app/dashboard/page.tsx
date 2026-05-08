"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Check } from "lucide-react";
import { useWallets } from "@privy-io/react-auth/solana";
import { MicOrb } from "@/components/voice/mic-orb";
import { ConfirmationOverlay } from "@/components/voice/confirmation-overlay";
import { mockTransactions } from "@/lib/mock-data";
import { truncateAddress } from "@/lib/utils";
import type { VoiceState, PendingTransaction } from "@/types/voice";

export default function DashboardPage() {
  const { wallets } = useWallets();
  const walletAddress = wallets[0]?.address ?? "";

  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [userTranscript, setUserTranscript] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  const [pendingTx, setPendingTx] = useState<PendingTransaction | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const animateUserTranscript = (text: string, onDone?: () => void) => {
    setUserTranscript("");
    let i = 0;
    const step = () => {
      i++;
      setUserTranscript(text.slice(0, i));
      if (i < text.length) timersRef.current.push(setTimeout(step, 45));
      else onDone?.();
    };
    step();
  };

  const animateAgentResponse = (text: string, onDone?: () => void) => {
    setAgentResponse("");
    const words = text.split(" ");
    let i = 0;
    const step = () => {
      i++;
      setAgentResponse(words.slice(0, i).join(" "));
      if (i < words.length) timersRef.current.push(setTimeout(step, 110));
      else onDone?.();
    };
    step();
  };

  const handleMicClick = () => {
    // TODO: ElevenLabs integration here — call `useConversation().startSession()`
    // and let the SDK drive `voiceState`, `userTranscript`, and `agentResponse`.
    if (voiceState !== "idle") {
      clearTimers();
      setVoiceState("idle");
      setUserTranscript("");
      setAgentResponse("");
      return;
    }

    setVoiceState("listening");
    setUserTranscript("");
    setAgentResponse("");

    timersRef.current.push(
      setTimeout(() => {
        animateUserTranscript("send fifty dollars to maria", () => {
          timersRef.current.push(
            setTimeout(() => {
              setVoiceState("speaking");
              timersRef.current.push(setTimeout(() => setUserTranscript(""), 4500));
              animateAgentResponse("Press and hold to confirm sending $50 to Maria.", () => {
                timersRef.current.push(
                  setTimeout(() => {
                    setPendingTx({ amount: 50, recipient: "Maria Lopez" });
                    setVoiceState("awaiting-confirmation");
                  }, 600)
                );
              });
            }, 500)
          );
        });
      }, 1200)
    );
  };

  const handleConfirm = () => {
    // TODO: Solana web3.js / Jupiter v6 — sign + send the prepared transaction.
    setPendingTx(null);
    setVoiceState("speaking");
    setShowSuccess(true);
    animateAgentResponse("Done. $50 sent to Maria.", () => {
      timersRef.current.push(
        setTimeout(() => {
          setVoiceState("idle");
          setAgentResponse("");
          timersRef.current.push(setTimeout(() => setShowSuccess(false), 600));
        }, 2000)
      );
    });
  };

  const handleCancel = () => {
    clearTimers();
    setPendingTx(null);
    setVoiceState("idle");
    setAgentResponse("");
    setUserTranscript("");
  };

  const status = {
    idle: { text: "Tap to speak", color: "var(--muted-foreground)" },
    listening: { text: "Listening…", color: "var(--primary)" },
    speaking: { text: "Speaking…", color: "var(--secondary)" },
    "awaiting-confirmation": { text: "Press and hold to confirm", color: "var(--primary)" },
  }[voiceState];

  return (
    <div className="max-w-[720px] mx-auto px-5 md:px-8 py-8 w-full">
      {/* Balance */}
      <section
        aria-label="Account balance"
        className="rounded-[26px] border border-[var(--border)] py-7 px-8 flex items-end justify-between gap-5"
        style={{ background: "linear-gradient(135deg, #EDF4FC 0%, #ffffff 100%)" }}
      >
        <div>
          <div className="text-[var(--muted-foreground)] text-sm font-medium">Your balance</div>
          <div
            className="font-bold tracking-tight leading-none mt-1.5"
            style={{ fontSize: "clamp(40px, 6vw, 56px)", letterSpacing: "-0.025em" }}
          >
            $1,234.56
          </div>
          {walletAddress && (
            <div className="mono text-xs text-[var(--muted-foreground)] mt-2">
              {truncateAddress(walletAddress)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[var(--secondary)] font-semibold text-sm pb-1.5">
          <ArrowUpRight size={16} /> +$120 this week
        </div>
      </section>

      {/* Voice region */}
      <section aria-label="Voice assistant" className="py-10 text-center">
        <div
          aria-live="polite"
          aria-atomic="true"
          className="min-h-[100px] my-4 mb-1 text-center flex items-end justify-center"
        >
          {agentResponse && (
            <div
              key={agentResponse}
              className="font-semibold tracking-tight leading-snug text-balance max-w-[600px] animate-fade-in-up"
              style={{ fontSize: "clamp(20px, 2.6vw, 28px)" }}
            >
              {agentResponse}
            </div>
          )}
          {!agentResponse && voiceState === "idle" && (
            <div
              className="font-medium text-[var(--muted-foreground)] text-balance max-w-[600px]"
              style={{ fontSize: 22 }}
            >
              Hi Elena. What can I help with?
            </div>
          )}
        </div>

        <MicOrb state={voiceState} onClick={handleMicClick} />

        <div
          className="text-center mt-4.5 mt-[18px] font-medium text-[15px] tracking-wide"
          style={{ color: status.color }}
          aria-live="polite"
        >
          {status.text}
        </div>

        <div
          className="italic text-[var(--muted-foreground)] text-[15px] mt-3.5 min-h-[22px] text-center"
          aria-live="polite"
          aria-atomic="true"
        >
          {userTranscript && <span>“{userTranscript}”</span>}
        </div>
      </section>

      {/* Recent activity */}
      <section aria-label="Recent activity" className="mt-8">
        <header className="flex justify-between items-baseline mb-2">
          <h2 className="text-[22px] font-semibold tracking-tight m-0">Recent activity</h2>
          <a className="text-[var(--primary)] text-sm font-medium cursor-pointer">View all</a>
        </header>
        <div className="flex flex-col gap-1">
          {mockTransactions.map((t) => {
            const isReceived = t.type === "received";
            return (
              <article
                key={t.id}
                className="flex items-center gap-4 py-4 px-2 rounded-2xl transition-colors hover:bg-[var(--muted)]"
              >
                <div
                  aria-hidden="true"
                  className={`w-11 h-11 rounded-2xl grid place-items-center shrink-0 ${
                    isReceived
                      ? "bg-[rgba(52,201,160,0.12)] text-[var(--secondary)]"
                      : "bg-[var(--accent)] text-[var(--primary)]"
                  }`}
                >
                  {t.type === "sent" && <ArrowUpRight size={20} />}
                  {t.type === "received" && <ArrowDownLeft size={20} />}
                  {t.type === "exchange" && <ArrowLeftRight size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base">{t.title}</div>
                  <div className="text-[var(--muted-foreground)] text-[13px] mt-0.5">
                    {t.note ? `${t.date} · ${t.note}` : t.date}
                  </div>
                </div>
                <div className={`font-semibold text-base shrink-0 ${isReceived ? "text-[var(--secondary)]" : ""}`}>
                  {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {pendingTx && (
        <ConfirmationOverlay
          amount={pendingTx.amount}
          recipient={pendingTx.recipient}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {showSuccess && !pendingTx && (
        <div
          role="status"
          className="fixed bottom-[88px] left-1/2 -translate-x-1/2 bg-[var(--secondary)] text-white py-3 px-5 rounded-full font-semibold text-[15px] flex items-center gap-2.5 shadow-[0_12px_32px_rgba(52,201,160,0.3)] z-80 animate-fade-in-up"
          style={{ zIndex: 80 }}
        >
          <Check size={18} strokeWidth={2.5} /> $50 sent to Maria
        </div>
      )}
    </div>
  );
}
