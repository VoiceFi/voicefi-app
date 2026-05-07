import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3.5 bg-[var(--input)] border-[1.5px] border-transparent rounded-xl text-base transition-all",
          "focus:outline-none focus:border-[var(--primary)] focus:bg-[var(--card)]",
          "placeholder:text-[var(--muted-foreground)]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("block text-sm font-medium text-[var(--muted-foreground)] mb-2", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";
