"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, Settings, LogOut } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { BrandMark } from "@/components/brand/brand-mark";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Home", Icon: Home },
  { to: "/dashboard/contacts", label: "Contacts", Icon: Users },
  { to: "/dashboard/settings", label: "Settings", Icon: Settings },
] as const;

function getInitials(email: string | null | undefined): string {
  if (!email) return "?";
  return email.slice(0, 2).toUpperCase();
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = usePrivy();

  const userEmail = user?.email?.address ?? null;
  const initials = getInitials(userEmail);

  const handleLogout = async () => {
    await logout();
    router.replace("/onboarding");
  };

  return (
    <aside
      aria-label="Primary navigation"
      className="hidden md:flex w-[260px] shrink-0 border-r border-[var(--border)] bg-[var(--card)] p-7 px-5 flex-col gap-1 sticky top-0 h-screen"
    >
      <div className="flex items-center gap-3 px-2 pb-7 pt-1 font-display font-normal text-[19px] tracking-[0.12em]">
        <BrandMark />
        <span>VoiceFi</span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              href={to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-medium text-base transition-all",
                active
                  ? "bg-[var(--accent)] text-[var(--primary)] font-semibold"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-[18px] bg-[var(--muted)] overflow-hidden">
        <div className="p-4 flex gap-3 items-center">
          <span
            aria-hidden="true"
            className="w-[38px] h-[38px] rounded-full grid place-items-center text-white font-semibold text-sm shrink-0"
            style={{ background: "linear-gradient(135deg, #4A90D9, #168060)" }}
          >
            {initials}
          </span>
          <div className="min-w-0">
            <div className="text-xs text-[var(--muted-foreground)] leading-tight truncate">
              {userEmail ?? "—"}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-colors border-t border-[var(--border)]"
        >
          <LogOut size={16} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
