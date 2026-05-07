export type VoiceState = "idle" | "listening" | "speaking" | "awaiting-confirmation";

export interface PendingTransaction {
  amount: number;
  recipient: string;
  note?: string;
}
