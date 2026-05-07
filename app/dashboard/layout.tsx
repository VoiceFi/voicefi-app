import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Topbar } from "@/components/layout/topbar";

// NOTE: For per-route titles you can introspect usePathname in a client component.
// Here we use a single "Home" topbar; pages may render their own headers as needed.
export default function DashboardLayout({ children }: { children: ReactNode }) {
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
                EL
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
