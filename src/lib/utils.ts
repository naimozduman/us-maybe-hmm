import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function firstName(value: string | null | undefined) {
  return value?.trim().split(/\s+/)[0] || "there";
}

export function formatDate(value: string | null | undefined, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-US", options ?? { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function relativeTime(value: string | null | undefined) {
  if (!value) return "Never";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Unknown";
  const seconds = Math.round((timestamp - Date.now()) / 1000);
  const abs = Math.abs(seconds);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (abs < 60) return rtf.format(seconds, "second");
  if (abs < 3600) return rtf.format(Math.round(seconds / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(seconds / 3600), "hour");
  return rtf.format(Math.round(seconds / 86400), "day");
}

export function isOnline(value: string | null | undefined, thresholdSeconds = 75) {
  if (!value) return false;
  return Date.now() - new Date(value).getTime() < thresholdSeconds * 1000;
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function safeJson<T>(value: unknown, fallback: T): T {
  return value && typeof value === "object" ? (value as T) : fallback;
}
