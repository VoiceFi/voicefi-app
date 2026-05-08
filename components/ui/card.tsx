import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-[24px] p-9 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(20,20,30,0.06)]",
  {
    variants: {
      variant: {
        default: "bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[var(--border-subtle)] hover:border-[var(--border)]",
        tinted: "bg-[var(--accent)] border border-[var(--primary)]/8 hover:border-[var(--primary)]/15",
        stat: "bg-[#F9F8F5] border border-[var(--border-subtle)] hover:border-[var(--border)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
  )
);
Card.displayName = "Card";
