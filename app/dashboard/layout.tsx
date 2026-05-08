"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Topbar } from "@/components/layout/topbar";

function getInitials(email: string | null | undefined): string {
  if (!email) return "?";
  return email.slice(0, 2).toUpperCase();
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace("/onboarding");
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!authenticated) return null;

  const userEmail = user?.email?.address ?? null;
  const initials = getInitials(userEmail);

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          title="VoiceFi"
          right={
            <div className="flex items-center gap-2.5">
              <span className="text-[var(--muted-foreground)] text-[13px] flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full bg-[var(--secondary)]"
                />
                Connected
              </span>
              <span
                aria-hidden="true"
                className="w-[38px] h-[38px] rounded-full grid place-items-center text-white font-semibold text-sm"
                style={{ background: "linear-gradient(135deg, #4A90D9, #34C9A0)" }}
              >
                {initials}
              </span>
            </div>
          }
        />
        <main className="flex-1">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
