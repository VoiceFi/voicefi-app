import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono, Calistoga, Space_Grotesk } from "next/font/google";
import { ClientPrivyProvider } from "@/components/providers/ClientPrivyProvider";
import { VoiceProviders } from "@/components/voice/voice-providers";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const calistoga = Calistoga({ subsets: ["latin"], weight: ["400"], variable: "--font-calistoga" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "VoiceFi · Voice-first money",
  description: "Send money, check your balance, and exchange currencies — just by speaking. No forms. No passwords. Just your voice.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${geistMono.variable} ${calistoga.variable} ${spaceGrotesk.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <ClientPrivyProvider>
            <VoiceProviders>{children}</VoiceProviders>
          </ClientPrivyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
