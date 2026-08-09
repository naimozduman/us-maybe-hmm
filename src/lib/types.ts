export const LANGUAGES = ["en", "ru", "id", "ar", "tr"] as const;
export type Language = (typeof LANGUAGES)[number];

export const DIMENSIONS = [
  "intent_pace",
  "affection_presence",
  "conflict_regulation",
  "faith_boundaries",
  "future_structure",
  "honesty_self_awareness",
] as const;
export type Dimension = (typeof DIMENSIONS)[number];

export type LocalizedText = Record<Language, string>;
export type AnswerValue = string | string[];
export type QuestionType = "single" | "multi" | "text";

export interface QuestionCondition {
  questionId: string;
  values: string[];
}

export interface QuestionOption {
  id: string;
  label: LocalizedText;
  scores?: Partial<Record<Dimension, number>>;
  flags?: string[];
  hardStop?: "underage" | "not_interested" | "friendship" | "casual" | "not_marriage_open";
}

export interface QuestionDefinition {
  id: string;
  chapter: string;
  type: QuestionType;
  prompt: LocalizedText;
  helper?: LocalizedText;
  placeholder?: LocalizedText;
  options?: QuestionOption[];
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  condition?: QuestionCondition;
  gate?: boolean;
}

export interface ChapterDefinition {
  id: string;
  title: LocalizedText;
  eyebrow: LocalizedText;
  description: LocalizedText;
}

export interface StoredAnswer {
  questionId: string;
  value: AnswerValue;
  language: Language;
  isDraft: boolean;
  updatedAt?: string;
}

export type DimensionLabel =
  | "aligned"
  | "mostly_aligned"
  | "needs_discussion"
  | "major_mismatch"
  | "character_concern"
  | "not_enough_information";

export interface DimensionResult {
  key: Dimension;
  score: number | null;
  label: DimensionLabel;
  answered: number;
  possible: number;
}

export interface AssessmentResult {
  overallScore: number | null;
  dimensions: Record<Dimension, DimensionResult>;
  hardMismatches: string[];
  characterConcerns: string[];
  discussionFlags: string[];
  contradictions: string[];
  followUps: string[];
}

export interface PublicBootstrap {
  invitationId: string;
  candidateId: string;
  firstName: string;
  preferredLanguage: Language | null;
  selectedLanguage: Language | null;
  status: string;
  consented: boolean;
  submitted: boolean;
  withdrawn: boolean;
  expiresAt: string | null;
  answers: StoredAnswer[];
  session: {
    currentStage: string | null;
    currentQuestion: string | null;
    progress: number;
  } | null;
}

export interface CandidateSummary {
  id: string;
  firstName: string;
  source: string | null;
  preferredLanguage: Language | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  invitationId: string | null;
  invitationStatus: string | null;
  expiresAt: string | null;
  openedAt: string | null;
  submittedAt: string | null;
  lastSeenAt: string | null;
  progress: number;
  currentStage: string | null;
  currentQuestion: string | null;
  overallScore: number | null;
}

export type ReviewDecision = "continue" | "discuss" | "close" | "archive" | "undecided";
