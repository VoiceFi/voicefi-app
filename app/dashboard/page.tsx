"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Check } from "lucide-react";
import { useSignAndSendTransaction, useWallets } from "@privy-io/react-auth/solana";
import { useConversation } from "@elevenlabs/react";
import { Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { MicOrb } from "@/components/voice/mic-orb";
import { ConfirmationOverlay } from "@/components/voice/confirmation-overlay";
import { mockTransactions } from "@/lib/mock-data";
import { SOLANA_RPC_URL } from "@/lib/solana/constants";
import { buildSolTransferTx, buildUsdcTransferTx } from "@/lib/solana/transfer";
import { createClient } from "@/lib/supabase/client";
import { truncateAddress } from "@/lib/utils";
import type { VoiceState, DetectedIntent, IntentType } from "@/types/voice";

type PendingConfirmation = {
  summary: string;
  resolve: (confirmed: boolean) => void;
};

function TokenChip({
  symbol,
  amount,
  fractionDigits,
}: {
  symbol: string;
  amount: number;
  fractionDigits: number;
}) {
  return (
    <div className="inline-flex items-center gap-2 bg-white/70 border border-[var(--border)] rounded-full pl-2.5 pr-3.5 py-1.5">
      <span
        aria-hidden="true"
        className="w-6 h-6 rounded-full grid place-items-center text-white text-[10px] font-bold"
        style={{ background: "linear-gradient(135deg, #4A90D9, #168060)" }}
      >
        {symbol[0]}
      </span>
      <span className="text-[13px] font-semibold tracking-tight">
        {amount.toLocaleString("en-US", {
          minimumFractionDigits: fractionDigits,
          maximumFractionDigits: fractionDigits,
        })}{" "}
        <span className="text-[var(--muted-foreground)] font-medium">{symbol}</span>
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const walletAddress = wallet?.address ?? "";
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const supabase = useMemo(() => createClient(), []);
  const connection = useMemo(
    () => new Connection(SOLANA_RPC_URL, "confirmed"),
    [],
  );

  type Balance = { sol: number; usdc: number; totalUsd: number };
  const [balance, setBalance] = useState<Balance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [lastSignature, setLastSignature] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const res = await fetch(`/api/balance?walletAddress=${walletAddress}`);
      const data = await res.json();
      setBalance({
        sol: data.sol ?? 0,
        usdc: data.usdc ?? 0,
        totalUsd: data.totalUsd ?? 0,
      });
    } catch {
      setBalance({ sol: 0, usdc: 0, totalUsd: 0 });
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
        console.log("[voice] detectIntent called", params);
        const intent: DetectedIntent = {
          intent: params.intent as IntentType,
          amount: typeof params.amount === "number" ? params.amount : undefined,
          token: typeof params.token === "string" ? params.token : undefined,
          recipient: typeof params.recipient === "string" ? params.recipient : undefined,
          timestamp: Date.now(),
        };

        if (intent.intent === "send" && intent.recipient && walletAddress) {
          const { data } = await supabase
            .from("contacts")
            .select("address, name")
            .eq("wallet_address", walletAddress)
            .ilike("name", intent.recipient)
            .limit(1)
            .maybeSingle();
          if (data?.address) {
            intent.recipientAddress = data.address;
            intent.recipient = data.name;
          } else {
            intent.unresolved = true;
          }
        }

        setCurrentIntent(intent);
        const response = {
          acknowledged: true,
          recipientResolved: !!intent.recipientAddress,
          recipientUnresolved: !!intent.unresolved,
        };
        console.log("[voice] detectIntent response →", response, "intent:", intent);
        return JSON.stringify(response);
      },
      requestConfirmation: async (params) => {
        console.log("[voice] requestConfirmation called", params);
        const summary = typeof params.summary === "string" ? params.summary : "";
        const confirmed = await new Promise<boolean>((resolve) => {
          setPendingConfirmation({ summary, resolve });
        });
        console.log("[voice] requestConfirmation resolved →", { confirmed });
        return JSON.stringify({ confirmed });
      },
      executeTransaction: async () => {
        console.log("[voice] executeTransaction called");
        const intent = currentIntentRef.current;
        if (!intent || intent.intent !== "send") {
          return JSON.stringify({ success: false, error: "No send intent active." });
        }
        if (!intent.recipientAddress) {
          return JSON.stringify({ success: false, error: "Recipient not resolved." });
        }
        if (!intent.amount || intent.amount <= 0) {
          return JSON.stringify({ success: false, error: "Amount must be greater than zero." });
        }
        if (!wallet) {
          return JSON.stringify({ success: false, error: "Wallet not connected." });
        }

        const tokenSymbol = (intent.token ?? "USDC").trim().toUpperCase();
        if (tokenSymbol !== "SOL" && tokenSymbol !== "USDC") {
          return JSON.stringify({
            success: false,
            error: `Unsupported token "${tokenSymbol}". Only SOL and USDC are supported.`,
          });
        }

        try {
          const senderPk = new PublicKey(wallet.address);
          const recipientPk = new PublicKey(intent.recipientAddress);
          const txBytes =
            tokenSymbol === "SOL"
              ? await buildSolTransferTx({
                  connection,
                  sender: senderPk,
                  recipient: recipientPk,
                  amountSol: intent.amount,
                })
              : await buildUsdcTransferTx({
                  connection,
                  sender: senderPk,
                  recipient: recipientPk,
                  amountUsdc: intent.amount,
                });

          const { signature } = await signAndSendTransaction({
            transaction: txBytes,
            wallet,
            chain: "solana:devnet",
          });

          const sigB58 = bs58.encode(signature);
          await connection.confirmTransaction(sigB58, "confirmed");

          setLastSignature(sigB58);
          setShowSuccess(true);
          if (successTimerRef.current) clearTimeout(successTimerRef.current);
          successTimerRef.current = setTimeout(() => setShowSuccess(false), 6000);
          fetchBalance();

          return JSON.stringify({
            success: true,
            signature: sigB58,
            explorerUrl: `https://explorer.solana.com/tx/${sigB58}?cluster=devnet`,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          console.error("executeTransaction failed:", err);
          return JSON.stringify({ success: false, error: message });
        }
      },
    },
    onMessage: ({ message, source }) => {
      console.log(`[voice] message from ${source}:`, message);
      if (source === "user") {
        setUserTranscript(message);
      } else {
        setAgentResponse(message);
      }
    },
    onError: (message) => {
      console.error("[voice] ElevenLabs error:", message);
    },
    onConnect: () => {
      console.log("[voice] connected to agent");
    },
    onDisconnect: () => {
      console.log("[voice] disconnected from agent");
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
        token: "USDC",
      };
    }
    const displayName = intent?.recipient ?? "your wallet";
    const recipient = intent?.recipientAddress
      ? `${displayName} (${truncateAddress(intent.recipientAddress)})`
      : displayName;
    return {
      amount: intent?.amount ?? 0,
      recipient,
      note: undefined,
      token: (intent?.token ?? "USDC").trim().toUpperCase(),
    };
  }, [pendingConfirmation, currentIntent]);

  const successMessage = useMemo(() => {
    if (!currentIntent) return "Transaction confirmed";
    if (currentIntent.intent === "swap") {
      return `Swap confirmed`;
    }
    const amt = currentIntent.amount ?? 0;
    const token = (currentIntent.token ?? "USDC").trim().toUpperCase();
    const who = currentIntent.recipient ?? "your wallet";
    return `${amt} ${token} sent to ${who}`;
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
        className="rounded-[26px] border border-[var(--border)] py-7 px-8"
        style={{ background: "linear-gradient(135deg, #EDF4FC 0%, #ffffff 100%)" }}
      >
        <div className="text-[var(--muted-foreground)] text-sm font-medium">Your balance</div>
        <div
          className="font-bold tracking-tight leading-none mt-1.5"
          style={{ fontSize: "clamp(40px, 6vw, 56px)", letterSpacing: "-0.025em" }}
        >
          {balanceLoading ? (
            <span className="text-[var(--muted-foreground)] opacity-40">$···</span>
          ) : (
            `$${(balance?.totalUsd ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          )}
        </div>
        {walletAddress && (
          <div className="mono text-xs text-[var(--muted-foreground)] mt-2">
            {truncateAddress(walletAddress)}
          </div>
        )}
        {!balanceLoading && balance && (
          <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap gap-2.5">
            <TokenChip symbol="SOL" amount={balance.sol} fractionDigits={4} />
            <TokenChip symbol="USDC" amount={balance.usdc} fractionDigits={2} />
          </div>
        )}
      </section>

      {/* Voice region */}
      <section aria-label="Voice assistant" className="py-6 text-center">
        <div
          aria-live="polite"
          aria-atomic="true"
          className="min-h-[80px] mt-2 mb-1 text-center flex items-end justify-center"
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
          <button
            type="button"
            className="text-[var(--primary)] text-sm font-medium cursor-pointer bg-transparent border-none p-0"
            aria-label="View all transactions"
          >
            View all
          </button>
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
                      ? "bg-[rgba(22,128,96,0.12)] text-[var(--secondary)]"
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
          token={overlayProps.token}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {showSuccess && !pendingConfirmation && (
        <div
          role="status"
          className="fixed bottom-[88px] left-1/2 -translate-x-1/2 bg-[var(--secondary)] text-white py-3 px-5 rounded-full font-semibold text-[15px] flex items-center gap-2.5 shadow-[0_12px_32px_rgba(22,128,96,0.3)] animate-fade-in-up"
          style={{ zIndex: 80 }}
        >
          <Check size={18} strokeWidth={2.5} /> {successMessage}
          {lastSignature && (
            <a
              href={`https://explorer.solana.com/tx/${lastSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline ml-1"
            >
              View on explorer
            </a>
          )}
        </div>
      )}
    </div>
  );
}
