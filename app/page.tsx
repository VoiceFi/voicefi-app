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
      <section id="main-content" className="hero-bg pt-24 pb-8 text-center">
        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--accent)] text-[var(--primary)] text-[12px] font-semibold uppercase tracking-[0.08em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-[pulse-soft_2.5s_ease-in-out_infinite]" />
            Voice-first banking · Solana
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
            Touch the mic to start
          </p>

          {/* Hero Orb */}
          <div className="flex justify-center">
            <HeroMicOrb />
          </div>
        </div>
      </section>

      {/* Features — Bento Grid */}
      <section className="max-w-[1120px] mx-auto px-5 md:px-8 py-16">
        <Reveal>
          {/* Section header */}
          <div className="text-center max-w-[640px] mx-auto mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--primary)] block mb-3">
              Why VoiceFi
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
                  className="w-14 h-14 rounded-2xl bg-[rgba(22,128,96,0.10)] text-[var(--secondary)] grid place-items-center mb-7"
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
              <p className="font-mono text-[40px] font-bold text-[var(--foreground)] leading-none mb-2">
                &lt;2s
              </p>
              <h3 className="text-[22px] font-semibold tracking-tight mb-3">
                Fast and reliable
              </h3>
              <p className="text-[var(--muted-foreground)] text-base leading-relaxed">
                Money moves in seconds with near-zero fees. Built on Solana, trusted by millions.
              </p>
            </Card>
          </div>
        </Reveal>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="max-w-[1120px] mx-auto px-5 md:px-8 py-16"
      >
        <div className="text-center max-w-[640px] mx-auto mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--primary)] block mb-3">
            Three steps
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
                title: "Confirm and done",
                body: "Press and hold to confirm any payment. That's your voice signature.",
                delay: 200,
              },
            ].map((s) => (
              <Reveal key={s.n} delay={s.delay}>
                <div className="flex flex-col items-center md:items-start gap-5 text-center md:text-left">
                  <div className="w-14 h-14 rounded-full border-2 border-[var(--primary)]/20 bg-white grid place-items-center flex-shrink-0">
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
        <section className="max-w-[1120px] mx-auto px-5 md:px-8 py-14 text-center">
          <div className="cta-section py-14 px-8">
            <h2
              className="font-display font-normal tracking-tight mb-3.5 text-balance"
              style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}
            >
              Ready to try it?
            </h2>
            <p className="text-[var(--muted-foreground)] text-lg mb-6 max-w-[440px] mx-auto">
              Set up takes less than a minute. Your voice is all you need.
            </p>
            <Button asChild size="lg">
              <Link href="/onboarding">
                Get started free <ArrowRight size={18} />
              </Link>
            </Button>
            <p className="mt-4 text-[13px] text-[var(--foreground-tertiary)] flex items-center justify-center gap-2">
              <Lock size={12} />
              No card required · Setup in under 60 seconds · Built on Solana
            </p>
          </div>
        </section>
      </Reveal>

      <LandingFooter />
    </div>
  );
}
