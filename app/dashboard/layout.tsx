import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Topbar } from "@/components/layout/topbar";
import { createClient } from "@/lib/supabase/server";

function initialsFor(email: string | undefined): string {
  if (!email) return "?";
  return email[0]?.toUpperCase() ?? "?";
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/onboarding");

  const email = user.email ?? "";
  const initial = initialsFor(email);

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      <Sidebar email={email} initial={initial} />
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
                {initial}
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
