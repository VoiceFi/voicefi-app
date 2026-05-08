import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_4px_14px_rgba(47,125,225,0.28)] hover:bg-[var(--primary-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(47,125,225,0.38)] active:translate-y-0 active:scale-[0.98]",
        outline:
          "bg-transparent border-[1.5px] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] hover:border-[var(--border-strong)] hover:-translate-y-px active:translate-y-0",
        ghost:
          "bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
        danger:
          "bg-transparent text-[var(--destructive)] hover:bg-[rgba(229,57,53,0.08)]",
      },
      size: {
        default: "px-[22px] py-[14px] text-base rounded-2xl",
        sm: "h-8 px-4 text-sm rounded-xl",
        lg: "px-7 py-[18px] text-[17px] rounded-[22px]",
        icon: "p-2 rounded-xl",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  }
);
Button.displayName = "Button";

export { buttonVariants };
