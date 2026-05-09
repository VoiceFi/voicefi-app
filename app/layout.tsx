import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono, Calistoga, Space_Grotesk } from "next/font/google";
import { ClientPrivyProvider } from "@/components/providers/ClientPrivyProvider";
import { VoiceProviders } from "@/components/voice/voice-providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const calistoga = Calistoga({ subsets: ["latin"], weight: ["400"], variable: "--font-calistoga" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "VoiceFi · Voice-first money",
  description: "Talk to a friendly assistant to check your balance, send money, or exchange currencies.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} ${calistoga.variable} ${spaceGrotesk.variable}`}>
      <body>
        <ClientPrivyProvider>
          <VoiceProviders>{children}</VoiceProviders>
        </ClientPrivyProvider>
      </body>
    </html>
  );
}
