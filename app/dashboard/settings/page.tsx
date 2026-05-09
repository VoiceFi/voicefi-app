"use client";

import { VoiceSection } from "@/components/settings/voice-section";
import { SecuritySection } from "@/components/settings/security-section";

export default function SettingsPage() {
  return (
    <div
      className="max-w-[720px] mx-auto px-5 md:px-8 py-8 w-full"
      data-screen-label="Settings"
    >
      <header className="mb-8">
        <h2 className="text-[28px] font-bold tracking-tight m-0">Settings</h2>
        <p className="text-[var(--muted-foreground)] mt-2 text-base leading-relaxed">
          Manage your voice preferences and security controls.
        </p>
      </header>

      <div className="flex flex-col gap-10">
        <VoiceSection />
        <SecuritySection />
      </div>
    </div>
  );
}
