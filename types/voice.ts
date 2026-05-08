export type VoiceState = "idle" | "listening" | "speaking" | "awaiting-confirmation";

export interface PendingTransaction {
  amount: number;
  recipient: string;
  note?: string;
}

export type IntentType = "send" | "balance" | "swap";

export interface DetectedIntent {
  intent: IntentType;
  amount?: number;
  token?: string;
  recipient?: string;
  timestamp: number;
}
