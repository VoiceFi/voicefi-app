import Link from "next/link";
import { ArrowRight, Lock, Mic, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BrandMark } from "@/components/brand/brand-mark";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]" data-screen-label="Landing">
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background: "rgba(248,247,244,0.78)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: "rgba(229,228,225,0.6)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark size={36} />
            <span className="font-bold text-lg tracking-tight">VoiceFi</span>
          </Link>
          <Button asChild>
            <Link href="/onboarding">
              Get started <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-20 text-center">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--accent)] text-[var(--primary)] text-[13px] font-medium">
            <Sparkles size={14} /> Simple, friendly, secure
          </span>
          <h1
            className="font-bold tracking-tight leading-[1.02] my-6 text-balance"
            style={{ fontSize: "clamp(48px, 7vw, 92px)", letterSpacing: "-0.035em" }}
          >
            Your money. <span className="text-[var(--primary)]">Your voice.</span>
          </h1>
          <p
            className="text-[var(--muted-foreground)] max-w-[620px] mx-auto mb-8 text-balance"
            style={{ fontSize: "clamp(18px, 2vw, 22px)", lineHeight: 1.5 }}
          >
            Talk to a friendly assistant to check your balance, send money, or exchange currencies. No passwords. No
            jargon. Just speak.
          </p>

          {/* Hero mic — tap to sign in */}
          <Link
            href="/onboarding"
            aria-label="Sign in"
            className="mx-auto relative grid place-items-center cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent)] rounded-full transition-transform hover:scale-[1.02]"
            style={{ width: 380, maxWidth: "90vw", aspectRatio: "1" }}
          >
            <div className="hero-mic-halo outer" aria-hidden="true" />
            <div className="hero-mic-halo" aria-hidden="true" />
            <div className="hero-mic-orb">
              <Mic size={64} strokeWidth={1.6} aria-hidden="true" />
            </div>
          </Link>
          <p className="text-[var(--muted-foreground)]/40 text-xs mt-4 font-light tracking-wide">Tap the microphone to sign in</p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-[1100px] mx-auto px-5 md:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              Icon: Lock,
              title: "No passwords to remember",
              body: "Sign in with your email or Google. We create a secure account for you, automatically.",
            },
            {
              Icon: Mic,
              title: "Speak naturally",
              body: "“Send fifty dollars to Maria.” That’s it. No menus, no forms, no jargon.",
            },
            {
              Icon: Zap,
              title: "Fast and reliable",
              body: "Money moves in seconds with low fees. Built on technology trusted by millions.",
            },
          ].map((f, i) => (
            <Card
              key={i}
              className="hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(20,20,30,0.06)] hover:border-[#d9d8d4]"
            >
              <div
                aria-hidden="true"
                className="w-[52px] h-[52px] rounded-2xl bg-[var(--accent)] text-[var(--primary)] grid place-items-center mb-5"
              >
                <f.Icon size={26} />
              </div>
              <h3 className="text-[22px] font-semibold tracking-tight mb-2.5">{f.title}</h3>
              <p className="text-[var(--muted-foreground)] text-base leading-relaxed">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-[1100px] mx-auto px-5 md:px-8 py-20">
        <div className="text-center max-w-[640px] mx-auto">
          <h2
            className="font-bold tracking-tight mb-4"
            style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.025em" }}
          >
            How it works
          </h2>
          <p className="text-[var(--muted-foreground)] text-lg">Three steps from setup to your first conversation.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            { n: 1, title: "Sign in", body: "Use your email or Google. We’ll set everything up in the background." },
            { n: 2, title: "Tap and speak", body: "Press the microphone and say what you’d like to do." },
            { n: 3, title: "Confirm and done", body: "Press and hold to confirm any payment. That’s your signature." },
          ].map((s) => (
            <div key={s.n}>
              <div
                aria-hidden="true"
                className="w-12 h-12 rounded-full bg-[var(--primary)] text-white grid place-items-center font-bold text-[19px] mb-4"
              >
                {s.n}
              </div>
              <h3 className="text-[22px] font-semibold tracking-tight mb-2.5">{s.title}</h3>
              <p className="text-[var(--muted-foreground)] text-base leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1100px] mx-auto px-5 md:px-8 py-20 text-center">
        <div
          className="rounded-[32px] py-[72px] px-8 border border-[var(--border)]"
          style={{ background: "linear-gradient(135deg, #EDF4FC 0%, #f8f7f4 100%)" }}
        >
          <h2
            className="font-bold tracking-tight mb-3.5 text-balance"
            style={{ fontSize: "clamp(32px, 4.5vw, 48px)", letterSpacing: "-0.025em" }}
          >
            Ready to try it?
          </h2>
          <p className="text-[var(--muted-foreground)] text-lg mb-7 max-w-[480px] mx-auto">
            Set up takes less than a minute. No card required.
          </p>
          <Button asChild size="lg">
            <Link href="/onboarding">
              Get started <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-8 text-[var(--muted-foreground)] text-sm">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 flex justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2.5">
            <BrandMark size={28} />
            <span>VoiceFi · 2026</span>
          </div>
          <div className="flex gap-6">
            <a>Privacy</a>
            <a>Terms</a>
            <a>Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
