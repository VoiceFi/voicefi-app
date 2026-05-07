import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ size = 38, className }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("grid place-items-center bg-[var(--primary)] text-white", className)}
      style={{ width: size, height: size, borderRadius: size / 3 }}
    >
      <Mic size={size * 0.5} strokeWidth={2} />
    </span>
  );
}
