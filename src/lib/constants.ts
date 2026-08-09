import type { Dimension, Language } from "@/lib/types";

export const QUESTIONNAIRE_VERSION = "2026-08-v2";
export const PUBLIC_SESSION_COOKIE = "usmaybe_session";
export const PUBLIC_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export const LANGUAGE_META: Record<Language, { label: string; native: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", native: "English", dir: "ltr" },
  ru: { label: "Russian", native: "Русский", dir: "ltr" },
  id: { label: "Indonesian", native: "Bahasa Indonesia", dir: "ltr" },
  ar: { label: "Arabic", native: "العربية", dir: "rtl" },
  tr: { label: "Turkish", native: "Türkçe", dir: "ltr" },
};

export const DIMENSION_WEIGHTS: Record<Dimension, number> = {
  intent_pace: 0.15,
  affection_presence: 0.2,
  conflict_regulation: 0.2,
  faith_boundaries: 0.2,
  future_structure: 0.15,
  honesty_self_awareness: 0.1,
};

export const DIMENSION_NAMES: Record<Dimension, string> = {
  intent_pace: "Intent and pace",
  affection_presence: "Affection and presence",
  conflict_regulation: "Conflict and regulation",
  faith_boundaries: "Faith and boundaries",
  future_structure: "Future structure",
  honesty_self_awareness: "Honesty and self-awareness",
};

export const DEFAULT_STANDARDS = {
  questionnaireVersion: QUESTIONNAIRE_VERSION,
  marriageIntent: "serious_slow",
  dailyCommunication: "throughout_day",
  videoCalls: "two_three_weekly",
  faith: "central_growing",
  oppositeSexBoundaries: "necessity_only",
  workHomeRoles: "provider_flexible",
  children: "yes",
  relocation: ["us", "turkiye", "flexible"],
  finances: "husband_primary_provider",
  familyInfluence: "advice_couple_decides",
  conflict: "direct_space_return_time",
  nonNegotiables: ["serious_intent", "shared_faith", "loyalty", "honest_communication", "children"],
};
