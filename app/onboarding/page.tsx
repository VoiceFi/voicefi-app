"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Copy, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { BrandMark } from "@/components/brand/brand-mark";
import { truncateAddress } from "@/lib/utils";

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 5.7 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 5.7 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3c-2 1.5-4.5 2.5-7.3 2.5-5.2 0-9.6-3.3-11.3-8L6 33C9.4 39.7 16.1 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4 5.7l6.3 5.3C40.7 36.3 44 31 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

const MOCK_WALLET = "7xKp9zM4nVc8aBn5fT2wX9pQrL3yJk1mN8cR2dV4";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  // TODO: Privy wallet integration here — replace local step transitions with
  // `usePrivy()` / `useLogin()` and read the embedded Solana wallet from `useWallets()`.
  const handleEmailContinue = () => setStep(2);
  const handleGoogle = () => setStep(2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(MOCK_WALLET);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-screen flex flex-col p-6" data-screen-label="Onboarding">
      <Link href="/" className="flex items-center gap-3 mb-8 self-start">
        <BrandMark size={32} />
        <span className="font-bold text-base">VoiceFi</span>
      </Link>

      <div className="h-1.5 bg-[var(--muted)] rounded-full max-w-[480px] w-full mx-auto overflow-hidden">
        <div
          className="h-full bg-[var(--primary)] rounded-full transition-[width] duration-400"
          style={{ width: `${step * 50}%` }}
        />
      </div>
      <div className="text-center text-[var(--muted-foreground)] text-sm font-medium mt-3 mb-14">
        Step {step} of 2
      </div>

      {step === 1 && (
        <div className="max-w-[480px] w-full mx-auto bg-[var(--card)] border border-[var(--border)] rounded-[28px] p-9 px-9 animate-fade-in-up">
          <h2 className="text-[30px] font-bold tracking-tight mb-3">Welcome</h2>
          <p className="text-[var(--muted-foreground)] mb-7 text-base">
            Sign in with your email or Google. We’ll create a secure account for you in the background — no passwords or
            seed phrases to remember.
          </p>

          <Button variant="outline" className="w-full" onClick={handleGoogle}>
            <GoogleIcon size={20} /> Continue with Google
          </Button>

          <div className="flex items-center gap-3.5 my-5 text-[var(--muted-foreground)] text-[13px]">
            <span className="flex-1 h-px bg-[var(--border)]" />
            or
            <span className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />

          <Button
            className="w-full mt-4"
            onClick={handleEmailContinue}
            disabled={email !== "" && !email.includes("@")}
          >
            Continue <ArrowRight size={18} />
          </Button>

          <p className="text-[var(--muted-foreground)] text-[13px] text-center mt-6 leading-normal">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-[480px] w-full mx-auto bg-[var(--card)] border border-[var(--border)] rounded-[28px] p-9 animate-fade-in-up">
          <div
            className="w-16 h-16 rounded-[22px] grid place-items-center mx-auto mb-5"
            style={{ background: "rgba(52,201,160,0.15)", color: "var(--secondary)" }}
          >
            <Check size={32} />
          </div>
          <h2 className="text-[30px] font-bold tracking-tight mb-3 text-center">You’re all set</h2>
          <p className="text-[var(--muted-foreground)] mb-7 text-base text-center">
            Your secure account is ready. Tap the microphone on the next screen and say something like “check my
            balance.”
          </p>

          <div className="bg-[var(--input)] rounded-2xl py-3.5 px-4.5 px-[18px] flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[var(--muted-foreground)] text-xs font-medium mb-0.5">Account ID</div>
              <div className="mono text-sm font-medium overflow-hidden whitespace-nowrap text-ellipsis">
                {truncateAddress(MOCK_WALLET)}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              aria-label="Copy account ID"
              className="px-3 py-2.5"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </Button>
          </div>

          <ul className="list-none p-0 my-6 flex flex-col gap-3">
            {[
              "Speak naturally — “send 20 dollars to James”",
              "Press and hold to confirm any payment",
              "Say “cancel” any time to stop",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px]">
                <span className="w-[22px] h-[22px] rounded-full bg-[var(--accent)] text-[var(--primary)] grid place-items-center shrink-0 mt-0.5">
                  <Check size={14} strokeWidth={2.5} />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <Button className="w-full" onClick={() => router.push("/dashboard")}>
            Start talking <Mic size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
