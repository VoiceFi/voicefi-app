"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="relative inline-flex items-center justify-center rounded-xl p-2.5"
        aria-hidden="true"
      >
        <div className="w-5 h-5" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl p-2.5",
        "transition-colors duration-200",
        "hover:bg-[var(--muted)] active:scale-95",
        "focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Moon
        size={20}
        className={cn(
          "transition-all duration-300 ease-out",
          "text-[var(--primary)]",
          isDark ? "rotate-90 opacity-0 scale-75" : "rotate-0 opacity-100 scale-100"
        )}
        aria-hidden="true"
      />
      <Sun
        size={20}
        className={cn(
          "absolute transition-all duration-300 ease-out",
          "text-[var(--foreground)]",
          isDark ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-75"
        )}
        aria-hidden="true"
      />
    </button>
  );
}
