"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Home", Icon: Home },
  { to: "/dashboard/contacts", label: "Contacts", Icon: Users },
  { to: "/dashboard/settings", label: "Settings", Icon: Settings },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary navigation"
      className="md:hidden flex sticky bottom-0 bg-[var(--card)] border-t border-[var(--border)] py-2.5 px-3 justify-around z-30"
      style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
    >
      {NAV_ITEMS.map(({ to, label, Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            href={to}
            aria-current={active ? "page" : undefined}
            aria-label={label}
            className={cn(
              "flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-medium",
              active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
            )}
          >
            <Icon size={22} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
