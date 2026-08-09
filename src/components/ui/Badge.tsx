import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-black/5 text-[var(--muted)]",
  accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
  success: "bg-[var(--sage-soft)] text-[var(--sage)]",
  warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  info: "bg-[var(--info-soft)] text-[var(--info)]",
};

export function Badge({ className, tone = "neutral", ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn("inline-flex min-h-7 items-center rounded-full px-2.5 text-xs font-bold", tones[tone], className)}
      {...props}
    />
  );
}
