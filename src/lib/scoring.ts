import { DIMENSION_NAMES, DIMENSION_WEIGHTS } from "@/lib/constants";
import { DIMENSIONS, type AnswerValue, type AssessmentResult, type Dimension, type DimensionLabel, type StoredAnswer } from "@/lib/types";
import { QUESTION_MAP } from "@/lib/questionnaire";

function machineLabel(flag: string) {
  const [, slug = flag] = flag.split(":");
  return slug.replaceAll("_", " ").replace(/^./, (value) => value.toUpperCase());
}

function textDepth(value: string) {
  const text = value.trim();
  if (!text) return 0;
  const words = text.split(/\s+/).filter(Boolean).length;
  const sentenceSignals = (text.match(/[.!?؟]/g) || []).length;
  const reflectionSignals = ["because", "learn", "understand", "respons", "apolog", "change", "feel", "need", "boundary", "respect", "trust", "karena", "belajar", "paham", "maaf", "чувств", "поним", "потому", "ответствен", "çünkü", "öğren", "anla", "sorum", "لأن", "أفهم", "أعتذر", "مسؤول"]
    .filter((keyword) => text.toLowerCase().includes(keyword)).length;
  return Math.min(100, 20 + words * 2.1 + sentenceSignals * 5 + reflectionSignals * 7);
}

function labelFor(score: number | null, flags: string[], answered: number): DimensionLabel {
  if (!answered || score === null) return "not_enough_information";
  if (flags.some((flag) => flag.startsWith("concern:"))) return "character_concern";
  if (flags.some((flag) => flag.startsWith("hard:"))) return "major_mismatch";
  if (score >= 82) return "aligned";
  if (score >= 68) return "mostly_aligned";
  if (score >= 45) return "needs_discussion";
  return "major_mismatch";
}

function getValue(record: Record<string, AnswerValue>, id: string) {
  return record[id];
}

function selected(value: AnswerValue | undefined, id: string) {
  return Array.isArray(value) ? value.includes(id) : value === id;
}

function contradictions(record: Record<string, AnswerValue>) {
  const results: string[] = [];

  if ((selected(getValue(record, "q11"), "space_return") || selected(getValue(record, "q11"), "explain_then_space")) && selected(getValue(record, "q10"), "cold")) {
    results.push("Says she communicates directly during conflict, but also chose coldness as a way to signal hurt.");
  }

  if (selected(getValue(record, "q20"), "same") && selected(getValue(record, "q18"), "separate")) {
    results.push("Supports equal standards, but also chose separate boundary rules for each partner.");
  }

  if (selected(getValue(record, "q26"), "advice") && selected(getValue(record, "q27"), "family_final")) {
    results.push("Says parents should advise while the couple decides, but would let family make the final marriage decision.");
  }

  if (selected(getValue(record, "q5"), "throughout") && (selected(getValue(record, "q6"), "obligation") || selected(getValue(record, "q6"), "annoying"))) {
    results.push("Prefers messages throughout the day, but experiences simple daily greetings as burdensome.");
  }

  const q15 = typeof record.q15 === "string" ? record.q15.toLowerCase() : "";
  if ((q15.includes("password") || q15.includes("phone") || q15.includes("парол") || q15.includes("kata sandi") || q15.includes("şifre") || q15.includes("كلمة المرور")) && selected(getValue(record, "q12"), "all_passwords")) {
    results.push("Her privacy definition and reassurance answer both rely heavily on account access. Discuss whether trust equals surveillance for her.");
  }

  if (selected(getValue(record, "q10"), "jealous") && selected(getValue(record, "q13"), "public")) {
    results.push("Rejects public embarrassment during conflict, but would use a public post to provoke jealousy.");
  }

  return results;
}

function followUps(record: Record<string, AnswerValue>, hard: string[], concerns: string[], discussions: string[], conflicts: string[]) {
  const results: string[] = [];

  if (hard.some((item) => item.toLowerCase().includes("relocation")) || selected(record.q23, "current") || selected(record.q23, "other")) {
    results.push("What countries and timelines would you realistically consider, and what support would make relocation fair?");
  }
  if (selected(record.q22, "career") || selected(record.q22, "business") || selected(record.q22, "study")) {
    results.push("How would you want work, study, home responsibilities, and children to fit together after marriage?");
  }
  if (selected(record.q18, "group_only") || selected(record.q18, "close_private") || selected(record.q18, "unconsidered")) {
    results.push("What specific opposite-sex boundaries would you freely choose for yourself, and would the same principle apply to both partners?");
  }
  if (selected(record.q11, "disappear") || selected(record.q11, "keep_arguing") || selected(record.q11, "chase")) {
    results.push("What exact message would you send when you need space, and when would you return to the conversation?");
  }
  if (selected(record.q12, "all_passwords") || concerns.some((item) => item.toLowerCase().includes("surveillance"))) {
    results.push("How do you distinguish reassurance from monitoring, and what privacy should remain healthy after marriage?");
  }
  if (selected(record.q26, "approve") || selected(record.q26, "parents_first") || selected(record.q27, "family_final")) {
    results.push("Which decisions belong to the couple after marriage, and which decisions require parental approval?");
  }
  if (selected(record.q24, "unsure")) {
    results.push("What makes you uncertain about children, and what would help you reach a clear decision?");
  }
  if (selected(record.q33, "discuss") || selected(record.q33, "unsure")) {
    results.push("Which answers made you hesitate most, and what would you need to understand before continuing?");
  }
  if (conflicts.length) {
    results.push("Some answers point in different directions. Ask which response best reflects her real behavior under stress.");
  }
  if (!results.length && discussions.length) {
    results.push("Which topic in this questionnaire deserves a real conversation instead of another written answer?");
  }
  return Array.from(new Set(results)).slice(0, 8);
}

export function scoreAnswers(answers: StoredAnswer[] | Record<string, AnswerValue>): AssessmentResult {
  const record = Array.isArray(answers)
    ? Object.fromEntries(answers.filter((answer) => !answer.isDraft).map((answer) => [answer.questionId, answer.value]))
    : answers;

  const totals = Object.fromEntries(DIMENSIONS.map((dimension) => [dimension, { sum: 0, count: 0, flags: [] as string[] }])) as Record<Dimension, { sum: number; count: number; flags: string[] }>;
  const allFlags = new Set<string>();

  for (const [questionId, value] of Object.entries(record)) {
    const question = QUESTION_MAP.get(questionId);
    if (!question) continue;

    if (question.type === "text" && typeof value === "string") {
      const depth = textDepth(value);
      const target: Dimension = question.chapter === "honesty" ? "honesty_self_awareness" : question.chapter === "conflict" ? "conflict_regulation" : question.chapter === "faith" ? "faith_boundaries" : question.chapter === "future" ? "future_structure" : question.chapter === "connection" ? "affection_presence" : "intent_pace";
      totals[target].sum += depth;
      totals[target].count += 1;
      continue;
    }

    const selectedIds = Array.isArray(value) ? value : [value];
    for (const selectedId of selectedIds) {
      const selectedOption = question.options?.find((item) => item.id === selectedId);
      if (!selectedOption) continue;
      for (const [dimension, score] of Object.entries(selectedOption.scores ?? {}) as Array<[Dimension, number]>) {
        totals[dimension].sum += score;
        totals[dimension].count += 1;
      }
      for (const flag of selectedOption.flags ?? []) {
        allFlags.add(flag);
        for (const dimension of DIMENSIONS) {
          if (selectedOption.scores?.[dimension] !== undefined) totals[dimension].flags.push(flag);
        }
      }
    }
  }

  const hardMismatches = Array.from(allFlags).filter((flag) => flag.startsWith("hard:")).map(machineLabel);
  const characterConcerns = Array.from(allFlags).filter((flag) => flag.startsWith("concern:")).map(machineLabel);
  const discussionFlags = Array.from(allFlags).filter((flag) => flag.startsWith("discussion:")).map(machineLabel);

  const dimensions = Object.fromEntries(
    DIMENSIONS.map((dimension) => {
      const entry = totals[dimension];
      const score = entry.count ? Math.round(entry.sum / entry.count) : null;
      return [
        dimension,
        {
          key: dimension,
          score,
          label: labelFor(score, entry.flags, entry.count),
          answered: entry.count,
          possible: entry.count,
        },
      ];
    }),
  ) as AssessmentResult["dimensions"];

  let weighted = 0;
  let usedWeight = 0;
  for (const dimension of DIMENSIONS) {
    const score = dimensions[dimension].score;
    if (score === null) continue;
    weighted += score * DIMENSION_WEIGHTS[dimension];
    usedWeight += DIMENSION_WEIGHTS[dimension];
  }
  const overallScore = usedWeight ? Math.round(weighted / usedWeight) : null;
  const foundContradictions = contradictions(record);

  return {
    overallScore,
    dimensions,
    hardMismatches: Array.from(new Set(hardMismatches)),
    characterConcerns: Array.from(new Set(characterConcerns)),
    discussionFlags: Array.from(new Set(discussionFlags)),
    contradictions: foundContradictions,
    followUps: followUps(record, hardMismatches, characterConcerns, discussionFlags, foundContradictions),
  };
}

export function dimensionSummary(result: AssessmentResult) {
  return DIMENSIONS.map((dimension) => ({
    key: dimension,
    name: DIMENSION_NAMES[dimension],
    ...result.dimensions[dimension],
  }));
}
