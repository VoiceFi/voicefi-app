"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Check } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useWallets } from "@privy-io/react-auth/solana";
import { useConversation } from "@elevenlabs/react";
import { MicOrb } from "@/components/voice/mic-orb";
import { ConfirmationOverlay } from "@/components/voice/confirmation-overlay";
import { mockTransactions } from "@/lib/mock-data";
import { truncateAddress } from "@/lib/utils";
import type { VoiceState, DetectedIntent, IntentType } from "@/types/voice";

type PendingConfirmation = {
  summary: string;
  resolve: (confirmed: boolean) => void;
};

export default function DashboardPage() {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const walletAddress = wallets[0]?.address ?? "";

  const userName = useMemo(() => {
    const email = user?.email?.address;
    if (!email) return "there";
    const local = email.split("@")[0] ?? "";
    const first = local.split(/[._-]/)[0] ?? local;
    return first ? first.charAt(0).toUpperCase() + first.slice(1) : "there";
  }, [user?.email?.address]);

  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const res = await fetch(`/api/balance?walletAddress=${walletAddress}`);
      const data = await res.json();
      setBalance(data.totalUsd ?? 0);
    } catch {
      setBalance(0);
    } finally {
      setBalanceLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 30_000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  const [userTranscript, setUserTranscript] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  const [currentIntent, setCurrentIntent] = useState<DetectedIntent | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentIntentRef = useRef<DetectedIntent | null>(null);

  useEffect(() => {
    currentIntentRef.current = currentIntent;
  }, [currentIntent]);

  useEffect(() => () => {
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
  }, []);

  const conversation = useConversation({
    clientTools: {
      detectIntent: async (params) => {
        const intent: DetectedIntent = {
          intent: params.intent as IntentType,
          amount: typeof params.amount === "number" ? params.amount : undefined,
          token: typeof params.token === "string" ? params.token : undefined,
          recipient: typeof params.recipient === "string" ? params.recipient : undefined,
          timestamp: Date.now(),
        };
        setCurrentIntent(intent);
        return JSON.stringify({ acknowledged: true });
      },
      requestConfirmation: async (params) => {
        const summary = typeof params.summary === "string" ? params.summary : "";
        const confirmed = await new Promise<boolean>((resolve) => {
          setPendingConfirmation({ summary, resolve });
        });
        return JSON.stringify({ confirmed });
      },
      executeMockTransaction: async () => {
        await new Promise((r) => setTimeout(r, 800));
        setShowSuccess(true);
        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        successTimerRef.current = setTimeout(() => setShowSuccess(false), 2800);
        const intent = currentIntentRef.current;
        return JSON.stringify({
          success: true,
          mockHash: "5xY...mock...abc",
          intent: intent?.intent ?? null,
        });
      },
    },
    onMessage: ({ message, source }) => {
      if (source === "user") {
        setUserTranscript(message);
      } else {
        setAgentResponse(message);
      }
    },
    onError: (message) => {
      console.error("ElevenLabs error:", message);
    },
  });

  const voiceState: VoiceState = useMemo(() => {
    if (pendingConfirmation) return "awaiting-confirmation";
    if (conversation.isSpeaking) return "speaking";
    if (conversation.status === "connected") return "listening";
    return "idle";
  }, [pendingConfirmation, conversation.isSpeaking, conversation.status]);

  const handleMicClick = async () => {
    if (pendingConfirmation) return;

    if (conversation.status === "connected" || isStarting) {
      await conversation.endSession();
      setUserTranscript("");
      setAgentResponse("");
      setCurrentIntent(null);
      return;
    }

    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
    if (!agentId) {
      console.error("Missing NEXT_PUBLIC_ELEVENLABS_AGENT_ID");
      alert("Agent ID is missing. Set NEXT_PUBLIC_ELEVENLABS_AGENT_ID in .env.local and restart.");
      return;
    }

    try {
      setIsStarting(true);
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setUserTranscript("");
      setAgentResponse("");
      setCurrentIntent(null);
      await conversation.startSession({
        agentId,
        connectionType: "websocket",
      });
    } catch (err) {
      console.error("Failed to start voice session:", err);
      alert("Couldn't access the microphone. Check browser permissions and try again.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleConfirm = () => {
    pendingConfirmation?.resolve(true);
    setPendingConfirmation(null);
  };

  const handleCancel = () => {
    pendingConfirmation?.resolve(false);
    setPendingConfirmation(null);
  };

  const overlayProps = useMemo(() => {
    if (!pendingConfirmation) return null;
    const intent = currentIntent;
    if (intent?.intent === "swap") {
      return {
        amount: intent.amount ?? 0,
        recipient: intent.token ? `${intent.token} swap` : "swap",
        note: pendingConfirmation.summary,
      };
    }
    return {
      amount: intent?.amount ?? 0,
      recipient: intent?.recipient ?? "your wallet",
      note: undefined,
    };
  }, [pendingConfirmation, currentIntent]);

  const successMessage = useMemo(() => {
    if (!currentIntent) return "Transaction confirmed";
    if (currentIntent.intent === "swap") {
      return `Swap confirmed`;
    }
    const amt = currentIntent.amount ?? 0;
    const who = currentIntent.recipient ?? "your wallet";
    return `$${amt} sent to ${who}`;
  }, [currentIntent]);

  const status = {
    idle: { text: isStarting ? "Connecting…" : "Tap to speak", color: "var(--muted-foreground)" },
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
            {balanceLoading ? (
              <span className="text-[var(--muted-foreground)] opacity-40">$···</span>
            ) : (
              `$${(balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            )}
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
      <section aria-label="Voice assistant" className="pt-3 pb-10 text-center">
        <div
          aria-live="polite"
          aria-atomic="true"
          className="min-h-[64px] mt-1 mb-1 text-center flex items-end justify-center"
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
              Hi {userName}. What can I help with?
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

      {overlayProps && (
        <ConfirmationOverlay
          amount={overlayProps.amount}
          recipient={overlayProps.recipient}
          note={overlayProps.note}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {showSuccess && !pendingConfirmation && (
        <div
          role="status"
          className="fixed bottom-[88px] left-1/2 -translate-x-1/2 bg-[var(--secondary)] text-white py-3 px-5 rounded-full font-semibold text-[15px] flex items-center gap-2.5 shadow-[0_12px_32px_rgba(52,201,160,0.3)] z-80 animate-fade-in-up"
          style={{ zIndex: 80 }}
        >
          <Check size={18} strokeWidth={2.5} /> {successMessage}
        </div>
      )}
    </div>
  );
}
