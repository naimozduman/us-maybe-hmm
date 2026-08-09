"use client";

import * as React from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  React.useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/35 p-0 backdrop-blur-sm sm:place-items-center sm:p-5" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 cursor-default" aria-label="Close dialog" onClick={onClose} />
      <div className={cn("soft-enter relative z-10 max-h-[92vh] w-full overflow-auto rounded-t-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl sm:max-w-lg sm:rounded-[28px] sm:p-6", className)}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">{title}</h2>
          <button className="grid size-11 place-items-center rounded-full bg-black/5 transition hover:bg-black/10" onClick={onClose} aria-label="Close">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
