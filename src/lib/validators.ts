import { z } from "zod";
import { LANGUAGES } from "@/lib/types";

const language = z.enum(LANGUAGES);
const answerValue = z.union([z.string().max(5000), z.array(z.string().max(120)).max(30)]);

export const bootstrapSchema = z.object({
  token: z.string().min(20).max(200),
  language: language.optional(),
});

export const eventSchema = z.object({
  invitationId: z.string().uuid(),
  events: z.array(z.object({
    eventType: z.string().min(2).max(80),
    screenId: z.string().max(120).optional().nullable(),
    questionId: z.string().max(120).optional().nullable(),
    payload: z.record(z.string(), z.unknown()).optional().default({}),
    occurredAt: z.string().datetime().optional(),
  })).min(1).max(30),
  currentStage: z.string().max(120).optional().nullable(),
  currentQuestion: z.string().max(120).optional().nullable(),
  progress: z.number().int().min(0).max(100).optional(),
  language: language.optional(),
});

export const answerSchema = z.object({
  invitationId: z.string().uuid(),
  questionId: z.string().min(1).max(120),
  value: answerValue,
  language,
  isDraft: z.boolean().default(false),
});

export const submitSchema = z.object({
  invitationId: z.string().uuid(),
});

export const deleteSchema = z.object({
  invitationId: z.string().uuid(),
});

export const createInvitationSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  source: z.string().trim().max(120).optional().nullable(),
  preferredLanguage: language.optional().nullable(),
  notes: z.string().trim().max(3000).optional().nullable(),
  expiresInDays: z.number().int().min(1).max(120).default(30),
});

export const invitationActionSchema = z.object({
  action: z.enum(["revoke", "restore", "expire", "rotate"]),
});

export const reviewSchema = z.object({
  decision: z.enum(["continue", "discuss", "close", "archive", "undecided"]),
  privateNotes: z.string().max(10000).default(""),
  manualLabels: z.array(z.string().max(120)).max(30).default([]),
});

export const standardsSchema = z.object({
  standards: z.record(z.string(), z.unknown()),
});
