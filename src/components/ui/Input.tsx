import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "min-h-12 w-full rounded-2xl border border-[var(--border)] bg-white px-4 text-[15px] outline-none transition placeholder:text-[var(--muted)]/65 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]",
        className,
      )}
      {...props}
    />
  );
});

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-36 w-full resize-y rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-[15px] leading-7 outline-none transition placeholder:text-[var(--muted)]/65 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]",
        className,
      )}
      {...props}
    />
  );
});
