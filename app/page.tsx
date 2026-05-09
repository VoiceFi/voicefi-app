import Link from "next/link";
import { ArrowRight, Lock, Mic, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StickyHeader } from "@/components/layout/sticky-header";
import { LandingFooter } from "@/components/layout/landing-footer";
import { Reveal } from "@/components/ui/reveal";
import { HeroMicOrb } from "@/components/voice/hero-mic-orb";
import { SkipLink } from "@/components/ui/skip-link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]" data-screen-label="Landing">
      <SkipLink />
      <StickyHeader />

      {/* Hero */}
      <section id="main-content" className="hero-bg pt-20 pb-6 text-center">
        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--accent)] text-[var(--primary)] text-[12px] font-semibold uppercase tracking-[0.08em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-[pulse-soft_2.5s_ease-in-out_infinite]" />
            Voice-first payments · Solana
          </span>

          {/* Headline */}
          <h1
            className="font-display font-normal tracking-tight leading-[1.05] my-6 text-balance"
            style={{ fontSize: "clamp(56px, 10vw, 140px)" }}
          >
            Your money.{" "}
            <em className="not-italic bg-gradient-to-br from-[#2F7DE1] to-[#5BA8F5] bg-clip-text text-transparent">
              Your voice.
            </em>
          </h1>

          {/* Subtitle */}
          <p
            className="text-[var(--muted-foreground)] max-w-[480px] mx-auto mb-6 text-balance"
            style={{ fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.5 }}
          >
            Your financial assistant, always ready to listen.
          </p>

          {/* Hero Orb */}
          <div className="flex justify-center">
            <HeroMicOrb />
          </div>
        </div>
      </section>

      {/* Features — Bento Grid */}
      <div className="bg-[var(--surface-sunken)]">
      <section className="max-w-[1120px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <Reveal>
          {/* Section header */}
          <div className="text-center max-w-[640px] mx-auto mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--primary)] block mb-3">
              Built different
            </span>
            <h2
              className="font-display font-normal tracking-tight mb-4"
              style={{ fontSize: "clamp(34px, 5vw, 54px)" }}
            >
              Banking that listens
            </h2>
            <p className="text-[var(--muted-foreground)] text-base leading-relaxed max-w-[520px] mx-auto">
              Send money, check your balance, or exchange currencies — just by talking.
              No forms to fill out, no passwords to remember, no app to learn.
            </p>
          </div>

          <div className="features-bento">
            {/* Card 1 — No passwords */}
            <Card variant="default" className="group">
              <div
                aria-hidden="true"
                className="w-14 h-14 rounded-2xl bg-[var(--accent)] text-[var(--primary)] grid place-items-center mb-7"
              >
                <Lock size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-[22px] font-semibold tracking-tight mb-3">
                No passwords to remember
              </h3>
              <p className="text-[var(--muted-foreground)] text-base leading-relaxed">
                Sign in with your email or Google. We create a secure wallet for you,
                automatically — no seed phrases required.
              </p>
            </Card>

            {/* Card 2 — Speak naturally */}
            <Card variant="default" className="group flex flex-col justify-between overflow-hidden">
              <div>
                <div
                  aria-hidden="true"
                  className="w-14 h-14 rounded-2xl bg-[rgba(22,128,96,0.14)] text-[var(--secondary)] grid place-items-center mb-7"
                >
                  <Mic size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-[22px] font-semibold tracking-tight mb-3">
                  Speak naturally
                </h3>
                <p className="text-[var(--muted-foreground)] text-base leading-relaxed">
                  &ldquo;Send fifty dollars to Maria.&rdquo; That&rsquo;s it. No menus, no
                  forms, no jargon.
                </p>
              </div>
              {/* Decorative waveform */}
              <div className="wave-bars mt-8" aria-hidden="true">
                {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 1, 0.75, 0.45].map((h, i) => (
                  <span
                    key={i}
                    className="animate-speaking-wave"
                    style={{
                      background: "var(--secondary)",
                      opacity: 0.4 + h * 0.4,
                      height: `${h * 100}%`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                ))}
              </div>
            </Card>

            {/* Card 3 — Fast and reliable */}
            <Card variant="default" className="group">
              <div
                aria-hidden="true"
                className="w-14 h-14 rounded-2xl bg-[var(--accent)] text-[var(--primary)] grid place-items-center mb-7"
              >
                <Zap size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-[22px] font-semibold tracking-tight mb-3 mt-2">
                Fast and reliable
              </h3>
              <p className="text-[var(--muted-foreground)] text-base leading-relaxed">
                Transactions settle in seconds with near-zero fees. Built on Solana — one of the fastest blockchains on the planet.
              </p>
            </Card>
          </div>
        </Reveal>
      </section>
      </div>

      {/* How it works */}
      <section
        id="how-it-works"
        className="max-w-[1120px] mx-auto px-5 md:px-8 py-12 md:py-16"
      >
        <div className="text-center max-w-[640px] mx-auto mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--primary)] block mb-3">
            Up and running
          </span>
          <h2
            className="font-display font-normal tracking-tight mb-4"
            style={{ fontSize: "clamp(34px, 5vw, 54px)" }}
          >
            How it works
          </h2>
          <p className="text-[var(--muted-foreground)] text-lg">
            From setup to your first conversation in under a minute.
          </p>
        </div>

        <div className="relative">
          {/* Connector line — desktop only */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-7 left-[18%] right-[18%] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--border-strong) 20%, var(--border-strong) 80%, transparent)",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {[
              {
                n: 1,
                title: "Sign in",
                body: "Use your email or Google. We'll set up your secure wallet in the background.",
                delay: 0,
              },
              {
                n: 2,
                title: "Tap and speak",
                body: "Press the microphone and say what you'd like to do.",
                delay: 100,
              },
              {
                n: 3,
                title: "Confirm and go",
                body: "Press and hold to confirm any payment. That's your voice signature.",
                delay: 200,
              },
            ].map((s) => (
              <Reveal key={s.n} delay={s.delay}>
                <div className="flex flex-col items-center md:items-start gap-5 text-center md:text-left">
                  <div className="w-14 h-14 rounded-full border-2 border-[var(--primary)]/30 bg-[var(--accent)] grid place-items-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white grid place-items-center font-bold text-sm">
                      {s.n}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[21px] font-semibold tracking-tight mb-2">{s.title}</h3>
                    <p className="text-[var(--muted-foreground)] text-base leading-relaxed">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <Reveal>
        <section className="max-w-[1120px] mx-auto px-5 md:px-8 py-10 md:py-12 text-center">
          <div className="cta-section py-10 px-6 md:py-14 md:px-10">

            {/* Voice wave decoration */}
            <div className="flex items-end justify-center gap-[3px] mb-8" aria-hidden="true">
              {[0.35, 0.55, 0.8, 1, 0.7, 1, 0.85, 0.55, 0.35].map((h, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-[var(--primary)] animate-speaking-wave"
                  style={{
                    height: `${h * 32}px`,
                    opacity: 0.15 + h * 0.2,
                    animationDelay: `${i * 0.09}s`,
                  }}
                />
              ))}
            </div>

            <h2
              className="font-display font-normal tracking-tight mb-4 text-balance"
              style={{ fontSize: "clamp(34px, 5vw, 58px)" }}
            >
              Your first voice transaction is one tap away.
            </h2>
            <p className="text-[var(--muted-foreground)] text-base mb-8 max-w-[380px] mx-auto leading-relaxed">
              Set up takes less than a minute. Your voice is all you need.
            </p>
            <Button asChild size="lg" className="shadow-[0_8px_32px_var(--primary-glow)]">
              <Link href="/onboarding">
                Try VoiceFi Free <ArrowRight size={18} />
              </Link>
            </Button>

            {/* Trust pills */}
            <div className="mt-6 flex items-center justify-center flex-wrap gap-2.5">
              {["No card required", "60-second setup", "Built on Solana"].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--background)] border border-[var(--border)] text-[12px] text-[var(--muted-foreground)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-[pulse-soft_2.5s_ease-in-out_infinite]" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <LandingFooter />
    </div>
  );
}
