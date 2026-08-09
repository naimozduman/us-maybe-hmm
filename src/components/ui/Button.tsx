import * as React from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "dark";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] border-transparent",
  secondary: "bg-white text-[var(--foreground)] border-[var(--border)] hover:border-[var(--accent)]",
  ghost: "bg-transparent text-[var(--foreground)] border-transparent hover:bg-black/5",
  danger: "bg-[var(--danger)] text-white border-transparent hover:brightness-95",
  dark: "bg-[#292624] text-white border-transparent hover:bg-black",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-3.5 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-sm",
  icon: "size-11 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading, disabled, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border font-bold transition duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-55",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
});
