"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Mic, Shield } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Home", Icon: Home },
  { to: "/dashboard/contacts", label: "Contacts", Icon: Users },
  { to: "/dashboard/voice-settings", label: "Voice", Icon: Mic },
  { to: "/dashboard/security", label: "Security", Icon: Shield },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside
      aria-label="Primary navigation"
      className="hidden md:flex w-[260px] shrink-0 border-r border-[var(--border)] bg-[var(--card)] p-7 px-5 flex-col gap-1 sticky top-0 h-screen"
    >
      <div className="flex items-center gap-3 px-2 pb-7 pt-1 font-bold text-[19px] tracking-tight">
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
      <div className="mt-auto p-4 rounded-[18px] bg-[var(--muted)] flex gap-3 items-center">
        <span
          aria-hidden="true"
          className="w-[38px] h-[38px] rounded-full grid place-items-center text-white font-semibold text-sm"
          style={{ background: "linear-gradient(135deg, #4A90D9, #34C9A0)" }}
        >
          EL
        </span>
        <div className="min-w-0">
          <div className="font-semibold text-sm leading-tight">Elena Ruiz</div>
          <div className="text-xs text-[var(--muted-foreground)] leading-tight mt-0.5">elena@email.com</div>
        </div>
      </div>
    </aside>
  );
}
