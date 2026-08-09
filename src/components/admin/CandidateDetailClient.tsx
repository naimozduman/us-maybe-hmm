"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Check,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  Copy,
  Eye,
  FileText,
  HeartHandshake,
  Link2,
  MessageCircleQuestion,
  RefreshCw,
  RotateCw,
  Save,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import { createClient } from "@/lib/supabase/client";
import { DIMENSION_NAMES, LANGUAGE_META } from "@/lib/constants";
import { QUESTION_MAP, localize } from "@/lib/questionnaire";
import type { AnswerValue, Dimension, DimensionLabel, Language, ReviewDecision } from "@/lib/types";
import { cn, formatDate, isOnline, relativeTime } from "@/lib/utils";

type Candidate = {
  id: string;
  first_name: string;
  source: string | null;
  preferred_language: Language | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type Invitation = {
  id: string;
  status: string;
  opened_at: string | null;
  submitted_at: string | null;
  expires_at: string | null;
  questionnaire_version: string;
  standards_snapshot: Record<string, unknown>;
} | null;

type Session = {
  id: string;
  language: Language | null;
  current_stage: string | null;
  current_question: string | null;
  progress: number;
  state: string;
  consented_at: string | null;
  last_seen_at: string | null;
  created_at: string;
} | null;

type AnswerRow = {
  id: string;
  question_id: string;
  value: AnswerValue;
  language: Language;
  is_draft: boolean;
  translated_text?: string | null;
  updated_at: string;
  revision_count?: number;
};

type EventRow = {
  id: string | number;
  event_type: string;
  screen_id: string | null;
  question_id: string | null;
  payload: Record<string, unknown> | null;
  occurred_at: string;
};

type Assessment = {
  overall_score: number | null;
  dimensions: Record<Dimension, { key?: Dimension; score: number | null; label: DimensionLabel; answered?: number }> | null;
  hard_mismatches: string[] | null;
  character_concerns: string[] | null;
  discussion_flags: string[] | null;
  contradictions: string[] | null;
  follow_ups: string[] | null;
  updated_at: string;
} | null;

type Review = {
  decision: ReviewDecision;
  private_notes: string;
  manual_labels: string[];
} | null;

type Tab = "overview" | "answers" | "activity" | "review";

const TABS: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
  { id: "overview", label: "Overview", icon: ClipboardCheck },
  { id: "answers", label: "Answers", icon: FileText },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "review", label: "Review", icon: HeartHandshake },
];

const decisions: Array<{ id: ReviewDecision; label: string; description: string }> = [
  { id: "undecided", label: "Undecided", description: "Keep reviewing" },
  { id: "continue", label: "Continue talking", description: "Strong enough to continue" },
  { id: "discuss", label: "Discuss first", description: "Resolve important questions" },
  { id: "close", label: "Close respectfully", description: "Do not continue" },
  { id: "archive", label: "Archive", description: "Remove from active review" },
];

function statusTone(status: string) {
  if (status === "submitted") return "success" as const;
  if (["in_progress", "opened"].includes(status)) return "accent" as const;
  if (["revoked", "withdrawn", "expired", "declined"].includes(status)) return "danger" as const;
  return "info" as const;
}

function labelTone(label: DimensionLabel) {
  if (label === "aligned") return "success" as const;
  if (label === "mostly_aligned") return "info" as const;
  if (label === "needs_discussion" || label === "not_enough_information") return "warning" as const;
  return "danger" as const;
}

function answerText(value: AnswerValue, language: Language) {
  if (Array.isArray(value)) return value.map((id) => id).join(", ");
  return value;
}

export function CandidateDetailClient({
  candidate,
  invitation,
  session,
  answers,
  events,
  assessment,
  review,
}: {
  candidate: Candidate;
  invitation: Invitation;
  session: Session;
  answers: AnswerRow[];
  events: EventRow[];
  assessment: Assessment;
  review: Review;
}) {
  const router = useRouter();
  const [tab, setTab] = React.useState<Tab>("overview");
  const [copied, setCopied] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState("");
  const [decision, setDecision] = React.useState<ReviewDecision>(review?.decision ?? "undecided");
  const [notes, setNotes] = React.useState(review?.private_notes ?? "");
  const [reviewSaved, setReviewSaved] = React.useState(false);
  const online = isOnline(session?.last_seen_at);

  React.useEffect(() => {
    const supabase = createClient();
    let timer: ReturnType<typeof setTimeout> | null = null;
    const refresh = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => router.refresh(), 250);
    };
    const filter = `candidate_id=eq.${candidate.id}`;
    const channel = supabase
      .channel(`candidate-live-${candidate.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "public_sessions", filter }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "answers", filter }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "answer_revisions", filter }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "interaction_events", filter }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "assessments", filter }, refresh)
      .subscribe();
    return () => {
      if (timer) clearTimeout(timer);
      void supabase.removeChannel(channel);
    };
  }, [candidate.id, router]);

  React.useEffect(() => {
    setDecision(review?.decision ?? "undecided");
    setNotes(review?.private_notes ?? "");
  }, [review?.decision, review?.private_notes]);

  const copyLink = async () => {
    if (!invitation) return;
    setWorking(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/invitations/${invitation.id}/link`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Link unavailable");
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Link unavailable");
    } finally {
      setWorking(false);
    }
  };

  const invitationAction = async (action: "revoke" | "restore" | "rotate") => {
    if (!invitation) return;
    setWorking(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/invitations/${invitation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");
      if (data.url) {
        await navigator.clipboard.writeText(data.url);
        setCopied(true);
      }
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Update failed");
    } finally {
      setWorking(false);
    }
  };

  const saveReview = async () => {
    setWorking(true);
    setError("");
    setReviewSaved(false);
    try {
      const response = await fetch(`/api/admin/reviews/${candidate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, privateNotes: notes, manualLabels: review?.manual_labels ?? [] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Review save failed");
      setReviewSaved(true);
      router.refresh();
      window.setTimeout(() => setReviewSaved(false), 1700);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Review save failed");
    } finally {
      setWorking(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <Link href="/admin" className="inline-flex min-h-10 items-center gap-2 rounded-full text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="size-4" />Back to dashboard</Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="font-[family-name:var(--font-serif)] text-5xl font-semibold tracking-[-0.045em]">{candidate.first_name}</h1>
            <Badge tone={statusTone(candidate.status)}>{candidate.status.replaceAll("_", " ")}</Badge>
            {online ? <Badge tone="success"><span className="pulse-dot me-2 size-2 rounded-full bg-current" />Online now</Badge> : null}
          </div>
          <p className="mt-3 text-[var(--muted)]">{candidate.source || "No source"}{candidate.preferred_language ? ` · ${LANGUAGE_META[candidate.preferred_language].native}` : ""} · Created {formatDate(candidate.created_at, { dateStyle: "medium" })}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {invitation ? <Button variant="secondary" loading={working} onClick={() => void copyLink()}>{copied ? <Check className="size-4" /> : <Copy className="size-4" />}{copied ? "Copied" : "Copy link"}</Button> : null}
          {invitation?.status === "revoked" ? <Button variant="secondary" loading={working} onClick={() => void invitationAction("restore")}><Link2 className="size-4" />Restore</Button> : invitation ? <Button variant="secondary" loading={working} onClick={() => void invitationAction("revoke")}><ShieldX className="size-4" />Revoke</Button> : null}
          {invitation ? <Button variant="dark" loading={working} onClick={() => void invitationAction("rotate")}><RotateCw className="size-4" />Rotate link</Button> : null}
        </div>
      </div>

      {error ? <div className="mt-5 flex gap-2 rounded-2xl bg-[var(--danger-soft)] px-4 py-3 text-sm font-semibold text-[var(--danger)]"><CircleAlert className="mt-0.5 size-4 shrink-0" />{error}</div> : null}

      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard icon={<Eye className="size-5" />} label="Live state" value={online ? "Online" : session?.state ?? "Not opened"} note={session?.last_seen_at ? `Last seen ${relativeTime(session.last_seen_at)}` : "No session yet"} />
        <StatusCard icon={<Clock3 className="size-5" />} label="Progress" value={`${session?.progress ?? (candidate.status === "submitted" ? 100 : 0)}%`} note={session?.current_question ? `Current question: ${session.current_question}` : session?.current_stage ? `Current stage: ${session.current_stage}` : "Waiting"} />
        <StatusCard icon={<FileText className="size-5" />} label="Answers" value={String(answers.length)} note={`${answers.filter((answer) => answer.is_draft).length} current drafts`} />
        <StatusCard icon={<Sparkles className="size-5" />} label="Private score" value={assessment?.overall_score === null || assessment?.overall_score === undefined ? "Not ready" : `${Math.round(assessment.overall_score)}%`} note="Never shown to her" />
      </div>

      <div className="mt-7 flex gap-1 overflow-x-auto rounded-2xl border border-black/10 bg-white/55 p-1.5 scrollbar-thin">
        {TABS.map((item) => <button key={item.id} type="button" onClick={() => setTab(item.id)} className={cn("flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-bold transition", tab === item.id ? "bg-[#292624] text-white" : "text-[var(--muted)] hover:bg-white hover:text-[var(--foreground)]")}><item.icon className="size-4" />{item.label}</button>)}
      </div>

      <div className="mt-5">
        {tab === "overview" ? <Overview assessment={assessment} session={session} invitation={invitation} candidate={candidate} /> : null}
        {tab === "answers" ? <Answers answers={answers} /> : null}
        {tab === "activity" ? <ActivityTimeline events={events} /> : null}
        {tab === "review" ? (
          <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
            <Card className="p-5 sm:p-6">
              <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">Your decision</h2>
              <div className="mt-5 grid gap-2">
                {decisions.map((item) => <button key={item.id} type="button" onClick={() => setDecision(item.id)} className={cn("flex min-h-16 items-center gap-3 rounded-2xl border px-4 text-start transition", decision === item.id ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-white hover:border-[var(--accent)]")}><span className={cn("grid size-6 place-items-center rounded-full border", decision === item.id ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)]")}>{decision === item.id ? <Check className="size-3.5" /> : null}</span><span><span className="block text-sm font-bold">{item.label}</span><span className="mt-0.5 block text-xs text-[var(--muted)]">{item.description}</span></span></button>)}
              </div>
            </Card>
            <Card className="p-5 sm:p-6">
              <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">Private notes</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Only you see these. Record context, questions, and what you observed outside the form.</p>
              <Textarea className="mt-5 min-h-72" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What matters before you decide?" />
              <div className="mt-5 flex justify-end"><Button loading={working} onClick={() => void saveReview()}>{reviewSaved ? <Check className="size-4" /> : <Save className="size-4" />}{reviewSaved ? "Saved" : "Save review"}</Button></div>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatusCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return <Card className="p-5"><div className="flex items-center justify-between gap-3"><div className="grid size-10 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">{icon}</div><div className="text-end text-lg font-bold">{value}</div></div><div className="mt-5 font-bold">{label}</div><div className="mt-1 truncate text-xs text-[var(--muted)]">{note}</div></Card>;
}

function Overview({ assessment, session, invitation, candidate }: { assessment: Assessment; session: Session; invitation: Invitation; candidate: Candidate }) {
  const dimensions = assessment?.dimensions ?? null;
  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="grid gap-5">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><div><h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">Six-dimension review</h2><p className="mt-1 text-sm text-[var(--muted)]">Averages support review. They never make the decision.</p></div><Sparkles className="size-5 text-[var(--accent)]" /></div>
          {dimensions ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(Object.keys(DIMENSION_NAMES) as Dimension[]).map((dimension) => {
                const result = dimensions[dimension];
                return <div key={dimension} className="rounded-2xl border border-[var(--border)] bg-white p-4"><div className="flex items-start justify-between gap-3"><div className="text-sm font-bold">{DIMENSION_NAMES[dimension]}</div><Badge tone={labelTone(result?.label ?? "not_enough_information")}>{(result?.label ?? "not_enough_information").replaceAll("_", " ")}</Badge></div><div className="mt-5 flex items-end justify-between"><div className="font-[family-name:var(--font-serif)] text-4xl font-semibold">{result?.score === null || result?.score === undefined ? "—" : Math.round(result.score)}</div><span className="mb-1 text-xs text-[var(--muted)]">out of 100</span></div><Progress className="mt-3" value={result?.score ?? 0} /></div>;
              })}
            </div>
          ) : <div className="mt-6 rounded-2xl bg-black/5 p-5 text-sm leading-7 text-[var(--muted)]">The private assessment appears after a complete submission. Partial answers remain visible in the Answers tab.</div>}
        </Card>

        <FlagSection icon={<ShieldX className="size-5" />} title="Major mismatches" values={assessment?.hard_mismatches ?? []} tone="danger" empty="No major mismatch is calculated yet." />
        <FlagSection icon={<ShieldAlert className="size-5" />} title="Character concerns" values={assessment?.character_concerns ?? []} tone="danger" empty="No character concern is calculated yet." />
        <FlagSection icon={<AlertTriangle className="size-5" />} title="Contradictions to discuss" values={assessment?.contradictions ?? []} tone="warning" empty="No contradiction is calculated yet." />
      </div>

      <div className="grid content-start gap-5">
        <Card className="p-5 sm:p-6">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">Live context</h2>
          <div className="mt-5 grid gap-3 text-sm">
            <Row label="Current stage" value={session?.current_stage ?? "Not started"} />
            <Row label="Current question" value={session?.current_question ?? "None"} />
            <Row label="Selected language" value={session?.language ? LANGUAGE_META[session.language].native : candidate.preferred_language ? LANGUAGE_META[candidate.preferred_language].native : "Not selected"} />
            <Row label="Consent accepted" value={session?.consented_at ? formatDate(session.consented_at) : "No"} />
            <Row label="Invitation opened" value={invitation?.opened_at ? formatDate(invitation.opened_at) : "No"} />
            <Row label="Submitted" value={invitation?.submitted_at ? formatDate(invitation.submitted_at) : "No"} />
            <Row label="Expires" value={invitation?.expires_at ? formatDate(invitation.expires_at) : "Never"} />
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3"><MessageCircleQuestion className="size-5 text-[var(--accent)]" /><h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">Suggested follow-ups</h2></div>
          {(assessment?.follow_ups ?? []).length ? <div className="mt-5 grid gap-3">{assessment!.follow_ups!.map((item, index) => <div key={index} className="rounded-2xl border border-[var(--border)] bg-white p-4 text-sm leading-6"><span className="me-2 font-bold text-[var(--accent)]">{index + 1}.</span>{item}</div>)}</div> : <p className="mt-5 text-sm leading-7 text-[var(--muted)]">Follow-up questions appear after scoring or when the answers create a discussion flag.</p>}
        </Card>

        {candidate.notes ? <Card className="p-5 sm:p-6"><h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">Invitation notes</h2><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">{candidate.notes}</p></Card> : null}
      </div>
    </div>
  );
}

function FlagSection({ icon, title, values, tone, empty }: { icon: React.ReactNode; title: string; values: string[]; tone: "danger" | "warning"; empty: string }) {
  return <Card className="p-5 sm:p-6"><div className="flex items-center gap-3"><div className={cn("grid size-10 place-items-center rounded-2xl", tone === "danger" ? "bg-[var(--danger-soft)] text-[var(--danger)]" : "bg-[var(--warning-soft)] text-[var(--warning)]")}>{icon}</div><h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">{title}</h2></div>{values.length ? <div className="mt-5 flex flex-wrap gap-2">{values.map((value) => <Badge key={value} tone={tone}>{value}</Badge>)}</div> : <p className="mt-5 text-sm text-[var(--muted)]">{empty}</p>}</Card>;
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] py-2.5 last:border-0"><span className="text-[var(--muted)]">{label}</span><span className="max-w-[60%] text-end font-semibold capitalize">{value.replaceAll("_", " ")}</span></div>;
}

function Answers({ answers }: { answers: AnswerRow[] }) {
  if (!answers.length) return <Card className="grid place-items-center p-16 text-center"><FileText className="size-7 text-[var(--muted)]" /><h2 className="mt-5 font-[family-name:var(--font-serif)] text-3xl font-semibold">No saved answers yet.</h2><p className="mt-3 text-[var(--muted)]">Partial answers appear here as soon as she saves them.</p></Card>;
  const ordered = [...answers].sort((a, b) => {
    const ai = Array.from(QUESTION_MAP.keys()).indexOf(a.question_id);
    const bi = Array.from(QUESTION_MAP.keys()).indexOf(b.question_id);
    return ai - bi;
  });
  return <div className="grid gap-4">{ordered.map((answer) => {
    const question = QUESTION_MAP.get(answer.question_id);
    const originalLanguage = answer.language || "en";
    const selectedIds = Array.isArray(answer.value) ? answer.value : [answer.value];
    const isText = question?.type === "text";
    return <Card key={answer.id} className="p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">{answer.question_id} · {question?.chapter ?? "question"}</div><h2 className="mt-3 max-w-4xl font-[family-name:var(--font-serif)] text-2xl font-semibold leading-tight">{question ? localize(question.prompt, "en") : answer.question_id}</h2></div><div className="flex gap-2"><Badge tone={answer.is_draft ? "warning" : "success"}>{answer.is_draft ? "Draft" : "Saved"}</Badge>{answer.revision_count && answer.revision_count > 1 ? <Badge tone="info">{answer.revision_count} versions</Badge> : null}</div></div><div className="mt-5 rounded-2xl border border-[var(--border)] bg-white p-4">{isText ? <p dir={LANGUAGE_META[originalLanguage].dir} className="whitespace-pre-wrap text-[15px] leading-7">{answerText(answer.value, originalLanguage)}</p> : <div className="grid gap-2">{selectedIds.map((id) => { const option = question?.options?.find((item) => item.id === id); return <div key={String(id)} className="rounded-xl bg-black/4 px-3 py-2.5 text-sm"><div className="font-semibold">{option ? localize(option.label, originalLanguage) : String(id)}</div>{originalLanguage !== "en" && option ? <div className="mt-1 text-xs text-[var(--muted)]">English: {localize(option.label, "en")}</div> : null}</div>; })}</div>}</div>{isText && originalLanguage !== "en" ? <div className="mt-3 rounded-2xl bg-[var(--info-soft)] px-4 py-3 text-xs leading-5 text-[var(--info)]">Original language preserved: {LANGUAGE_META[originalLanguage].native}. An optional translation provider can populate English text without replacing the original.</div> : null}<div className="mt-3 text-xs text-[var(--muted)]">Updated {relativeTime(answer.updated_at)}</div></Card>;
  })}</div>;
}

function ActivityTimeline({ events }: { events: EventRow[] }) {
  if (!events.length) return <Card className="grid place-items-center p-16 text-center"><Activity className="size-7 text-[var(--muted)]" /><h2 className="mt-5 font-[family-name:var(--font-serif)] text-3xl font-semibold">No activity yet.</h2><p className="mt-3 text-[var(--muted)]">Meaningful events appear after the invitation opens.</p></Card>;
  return <Card className="overflow-hidden"><div className="border-b border-[var(--border)] p-5 sm:p-6"><h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">Meaningful activity</h2><p className="mt-1 text-sm text-[var(--muted)]">No keystrokes, empty-space taps, mouse coordinates, or device surveillance.</p></div><div className="divide-y divide-[var(--border)]">{events.map((event) => <div key={event.id} className="grid gap-3 p-4 sm:grid-cols-[52px_1fr_auto] sm:items-start sm:p-5"><div className="grid size-10 place-items-center rounded-2xl bg-black/5 text-[var(--muted)]"><EventIcon type={event.event_type} /></div><div><div className="font-bold capitalize">{event.event_type.replaceAll("_", " ")}</div><div className="mt-1 text-sm text-[var(--muted)]">{event.question_id ? `Question ${event.question_id}` : event.screen_id ? `Screen: ${event.screen_id}` : "Questionnaire"}</div>{event.payload && Object.keys(event.payload).length ? <pre className="mt-3 max-w-3xl overflow-auto rounded-xl bg-[#292624] p-3 text-xs leading-5 text-white/70 scrollbar-thin">{JSON.stringify(event.payload, null, 2)}</pre> : null}</div><div className="text-xs text-[var(--muted)] sm:text-end"><div>{formatDate(event.occurred_at, { timeStyle: "short" })}</div><div className="mt-1">{relativeTime(event.occurred_at)}</div></div></div>)}</div></Card>;
}

function EventIcon({ type }: { type: string }) {
  if (type.includes("submit") || type.includes("complete")) return <ShieldCheck className="size-4" />;
  if (type.includes("answer") || type.includes("option") || type.includes("draft")) return <FileText className="size-4" />;
  if (type.includes("view") || type.includes("open")) return <Eye className="size-4" />;
  if (type.includes("heartbeat") || type.includes("visibility")) return <RefreshCw className="size-4" />;
  return <Activity className="size-4" />;
}
