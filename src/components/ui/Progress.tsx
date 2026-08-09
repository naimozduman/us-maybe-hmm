import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
  const safe = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-black/8", className)} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safe}>
      <div className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500" style={{ width: `${safe}%` }} />
    </div>
  );
}
