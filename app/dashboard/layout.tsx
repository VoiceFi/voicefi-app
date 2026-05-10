"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Topbar } from "@/components/layout/topbar";
import { TopbarUserMenu } from "@/components/layout/topbar-user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { SkipLink } from "@/components/ui/skip-link";

function getInitials(email: string | null | undefined): string {
  if (!email) return "?";
  return email.slice(0, 2).toUpperCase();
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Home",
  "/dashboard/contacts": "Contacts",
  "/dashboard/settings": "Settings",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, authenticated, user } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace("/onboarding");
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-[var(--background)]"
        aria-busy="true"
        aria-live="polite"
      >
        <div role="status" className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
          <span className="sr-only">Loading your dashboard…</span>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  const userEmail = user?.email?.address ?? null;
  const initials = getInitials(userEmail);
  const pageTitle = PAGE_TITLES[pathname] ?? "VoiceFi";

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      <SkipLink />
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          title={pageTitle}
          right={
            <>
              <ThemeToggle />
              <TopbarUserMenu initials={initials} email={userEmail} />
            </>
          }
        />
        <main id="main-content" className="flex-1">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
