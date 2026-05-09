"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarUserMenuProps {
  initials: string;
  email: string | null;
}

export function TopbarUserMenu({ initials, email }: TopbarUserMenuProps) {
  const router = useRouter();
  const { logout } = usePrivy();

  const handleLogout = async () => {
    await logout();
    router.replace("/onboarding");
  };

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[var(--muted-foreground)] text-[13px] flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className="w-2 h-2 rounded-full bg-[var(--secondary)]"
        />
        Connected
      </span>

      {/* Desktop: static avatar (no interactive menu) */}
      <span
        aria-hidden="true"
        className="hidden md:grid w-[38px] h-[38px] rounded-full place-items-center text-white font-semibold text-sm"
        style={{ background: "linear-gradient(135deg, #4A90D9, #168060)" }}
      >
        {initials}
      </span>

      {/* Mobile: interactive dropdown with sign-out */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Open user menu for ${email ?? "user"}`}
              className="w-[38px] h-[38px] rounded-full grid place-items-center text-white font-semibold text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
              style={{ background: "linear-gradient(135deg, #4A90D9, #168060)" }}
            >
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
