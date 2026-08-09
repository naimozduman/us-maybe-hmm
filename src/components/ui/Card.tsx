import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] shadow-[0_10px_32px_rgba(74,52,38,0.06)]", className)}
      {...props}
    />
  );
}
