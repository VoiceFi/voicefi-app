"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { BrandMark } from "@/components/brand/brand-mark";
import { createClient } from "@/lib/supabase/client";

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

export default function OnboardingPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailContinue = async () => {
    if (!email.includes("@")) return;
    setSubmitting(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  };

  const handleGoogle = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
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
          style={{ width: sent ? "100%" : "50%" }}
        />
      </div>
      <div className="text-center text-[var(--muted-foreground)] text-sm font-medium mt-3 mb-14">
        {sent ? "Check your email" : "Sign in"}
      </div>

      {!sent && (
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
            disabled={submitting || !email.includes("@")}
          >
            {submitting ? "Sending…" : "Continue"} <ArrowRight size={18} />
          </Button>

          {error && (
            <p className="text-sm text-[var(--destructive)] mt-4 text-center">{error}</p>
          )}

          <p className="text-[var(--muted-foreground)] text-[13px] text-center mt-6 leading-normal">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      )}

      {sent && (
        <div className="max-w-[480px] w-full mx-auto bg-[var(--card)] border border-[var(--border)] rounded-[28px] p-9 animate-fade-in-up">
          <div
            className="w-16 h-16 rounded-[22px] grid place-items-center mx-auto mb-5"
            style={{ background: "rgba(52,201,160,0.15)", color: "var(--secondary)" }}
          >
            <Mail size={32} />
          </div>
          <h2 className="text-[30px] font-bold tracking-tight mb-3 text-center">Check your inbox</h2>
          <p className="text-[var(--muted-foreground)] mb-7 text-base text-center">
            We sent a sign-in link to <span className="font-semibold text-[var(--foreground)]">{email}</span>. Open it
            on this device to finish signing in.
          </p>
          <ul className="list-none p-0 my-6 flex flex-col gap-3">
            {[
              "The link expires in 1 hour",
              "Didn’t get it? Check spam, then try again",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px]">
                <span className="w-[22px] h-[22px] rounded-full bg-[var(--accent)] text-[var(--primary)] grid place-items-center shrink-0 mt-0.5">
                  <Check size={14} strokeWidth={2.5} />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
          >
            Use a different email
          </Button>
        </div>
      )}
    </div>
  );
}
