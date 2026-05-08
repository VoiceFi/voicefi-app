"use client";

import { ConversationProvider } from "@elevenlabs/react";

export function VoiceProviders({ children }: { children: React.ReactNode }) {
  return <ConversationProvider>{children}</ConversationProvider>;
}
