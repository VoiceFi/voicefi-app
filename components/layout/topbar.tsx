import type { ReactNode } from "react";

export function Topbar({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <header
      className="h-[72px] border-b border-[var(--border)] flex items-center justify-between px-5 md:px-8 sticky top-0 z-20"
      style={{
        background: "var(--surface-overlay)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">{right}</div>
    </header>
  );
}
