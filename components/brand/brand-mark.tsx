import { cn } from "@/lib/utils";
import { VoicefiLogo } from "./voicefi-logo";

export function BrandMark({ size = 40, className }: { size?: number; className?: string }) {
  const logoSize = Math.round(size * 0.8);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center shrink-0",
        className
      )}
      style={{ width: size, height: size }}
    >
      <VoicefiLogo size={logoSize} />
    </span>
  );
}
