export type TransactionType = "sent" | "received" | "exchange";

export interface Transaction {
  id: number;
  type: TransactionType;
  title: string;
  date: string;
  amount: number;
  currency: string;
  note?: string;
}

export interface Voice {
  id: string;
  name: string;
  tag: string;
  desc: string;
}

export interface Session {
  id: number;
  device: string;
  icon: "phone" | "laptop";
  location: string;
  time: string;
}

export const mockTransactions: Transaction[] = [
  { id: 1, type: "sent", title: "Maria Lopez", date: "Today, 2:14 PM", amount: -50, currency: "USD" },
  { id: 2, type: "received", title: "James Chen", date: "Yesterday, 9:30 AM", amount: 120, currency: "USD" },
  { id: 3, type: "exchange", title: "Exchange", date: "May 4, 6:12 PM", amount: -200, currency: "USD", note: "USD → EUR" },
];

export const mockVoices: Voice[] = [
  { id: "aria", name: "Aria", tag: "English", desc: "Warm, friendly tone" },
  { id: "sofia", name: "Sofía", tag: "Spanish", desc: "Clear and reassuring" },
  { id: "mateus", name: "Mateus", tag: "Portuguese", desc: "Calm, steady pace" },
  { id: "noor", name: "Noor", tag: "English", desc: "Bright and crisp" },
  { id: "leo", name: "Léo", tag: "French", desc: "Soft, measured cadence" },
  { id: "kenji", name: "Kenji", tag: "Japanese", desc: "Polite and gentle" },
];

export const mockSessions: Session[] = [
  { id: 1, device: "iPhone 15", icon: "phone", location: "Brooklyn, NY", time: "Active now" },
  { id: 2, device: "MacBook Pro", icon: "laptop", location: "Brooklyn, NY", time: "Today, 9:14 AM" },
  { id: 3, device: "iPhone 15", icon: "phone", location: "Boston, MA", time: "May 3, 4:22 PM" },
];
