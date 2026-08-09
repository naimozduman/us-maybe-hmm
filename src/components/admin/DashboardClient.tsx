"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  CircleAlert,
  Clock3,
  Copy,
  ExternalLink,
  Eye,
  Link2,
  MoreHorizontal,
  Plus,
  RotateCw,
  Send,
  ShieldX,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Progress } from "@/components/ui/Progress";
import { createClient } from "@/lib/supabase/client";
import { LANGUAGE_META } from "@/lib/constants";
import type { CandidateSummary, Language } from "@/lib/types";
import { LANGUAGES } from "@/lib/types";
import { formatDate, isOnline, relativeTime } from "@/lib/utils";

type CreateResult = { url: string; candidate: { id: string; first_name: string } };

function statusTone(status: string | null): "neutral" | "accent" | "success" | "warning" | "danger" | "info" {
  if (status === "submitted") return "success";
  if (["in_progress", "opened"].includes(status ?? "")) return "accent";
  if (["revoked", "expired", "declined", "withdrawn"].includes(status ?? "")) return "danger";
  if (status === "active" || status === "invited") return "info";
  return "neutral";
}

function humanStatus(status: string | null) {
  return (status || "draft").replaceAll("_", " ").replace(/^./, (value) => value.toUpperCase());
}

export function DashboardClient({ candidates }: { candidates: CandidateSummary[] }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [created, setCreated] = React.useState<CreateResult | null>(null);
  const [firstName, setFirstName] = React.useState("");
  const [source, setSource] = React.useState("");
  const [language, setLanguage] = React.useState<Language | "">("");
  const [notes, setNotes] = React.useState("");
  const [expiresInDays, setExpiresInDays] = React.useState(30);
  const [creating, setCreating] = React.useState(false);
  const [error, setError] = React.useState("");
  const [copied, setCopied] = React.useState<string | null>(null);
  const [menuId, setMenuId] = React.useState<string | null>(null);
  const [workingId, setWorkingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const supabase = createClient();
    let timer: ReturnType<typeof setTimeout> | null = null;
    const refresh = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => router.refresh(), 350);
    };
    const channel = supabase
      .channel("admin-dashboard-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "candidates" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "invitations" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "public_sessions" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "assessments" }, refresh)
      .subscribe();
    return () => {
      if (timer) clearTimeout(timer);
      void supabase.removeChannel(channel);
    };
  }, [router]);

  const submitted = candidates.filter((candidate) => candidate.status === "submitted").length;
  const inProgress = candidates.filter((candidate) => ["in_progress", "opened"].includes(candidate.status)).length;
  const online = candidates.filter((candidate) => isOnline(candidate.lastSeenAt)).length;

  const resetCreate = () => {
    setFirstName("");
    setSource("");
    setLanguage("");
    setNotes("");
    setExpiresInDays(30);
    setError("");
    setCreated(null);
  };

  const createInvitation = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreating(true);
    setError("");
    try {
      const response = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          source: source || null,
          preferredLanguage: language || null,
          notes: notes || null,
          expiresInDays,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invitation creation failed.");
      setCreated(data as CreateResult);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Invitation creation failed.");
    } finally {
      setCreating(false);
    }
  };

  const copyText = async (value: string, id: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(id);
    window.setTimeout(() => setCopied((current) => current === id ? null : current), 1600);
  };

  const copyInvitation = async (invitationId: string) => {
    setWorkingId(invitationId);
    try {
      const response = await fetch(`/api/admin/invitations/${invitationId}/link`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Link unavailable");
      await copyText(data.url, invitationId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Link unavailable");
    } finally {
      setWorkingId(null);
    }
  };

  const invitationAction = async (invitationId: string, action: "revoke" | "restore" | "rotate") => {
    setWorkingId(invitationId);
    setMenuId(null);
    try {
      const response = await fetch(`/api/admin/invitations/${invitationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invitation update failed");
      if (data.url) await copyText(data.url, invitationId);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Invitation update failed");
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]"><Sparkles className="size-4" />Private compatibility CRM</div>
          <h1 className="mt-5 font-[family-name:var(--font-serif)] text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Your invitations</h1>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">Create a private link, watch meaningful progress, read every saved answer, and decide what happens next.</p>
        </div>
        <Button size="lg" onClick={() => { resetCreate(); setCreateOpen(true); }}><Plus className="size-4" />New invitation</Button>
      </div>

      {error ? <div className="mt-5 flex items-start gap-2 rounded-2xl bg-[var(--danger-soft)] px-4 py-3 text-sm font-semibold text-[var(--danger)]"><CircleAlert className="mt-0.5 size-4 shrink-0" />{error}</div> : null}

      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<Users className="size-5" />} label="Candidates" value={candidates.length} note="All private invitations" />
        <Metric icon={<Eye className="size-5" />} label="Active now" value={online} note="Seen in the last 75 seconds" />
        <Metric icon={<Clock3 className="size-5" />} label="In progress" value={inProgress} note="Opened or answering" />
        <Metric icon={<Check className="size-5" />} label="Submitted" value={submitted} note="Ready for review" />
      </div>

      <div className="mt-7 overflow-hidden rounded-[26px] border border-black/10 bg-[var(--surface)] shadow-[0_12px_40px_rgba(68,48,37,0.07)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 sm:px-6">
          <div><h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">People</h2><p className="mt-1 text-sm text-[var(--muted)]">Newest invitations first</p></div>
          <Badge tone="neutral">{candidates.length} total</Badge>
        </div>

        {candidates.length ? (
          <div className="divide-y divide-[var(--border)]">
            {candidates.map((candidate) => {
              const active = isOnline(candidate.lastSeenAt);
              return (
                <div key={candidate.id} className="group grid gap-4 p-4 transition hover:bg-white/60 sm:grid-cols-[1.2fr_0.9fr_1fr_auto] sm:items-center sm:p-5">
                  <Link href={`/admin/candidates/${candidate.id}`} className="flex min-w-0 items-center gap-3">
                    <div className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-[#292624] font-[family-name:var(--font-serif)] text-xl font-semibold text-white">
                      {candidate.firstName.slice(0, 1).toUpperCase()}
                      {active ? <span className="pulse-dot absolute -end-1 -top-1 size-3 rounded-full border-2 border-[var(--surface)] bg-[#6da578]" /> : null}
                    </div>
                    <div className="min-w-0"><div className="truncate font-bold">{candidate.firstName}</div><div className="mt-1 truncate text-sm text-[var(--muted)]">{candidate.source || "No source"}{candidate.preferredLanguage ? ` · ${LANGUAGE_META[candidate.preferredLanguage].native}` : ""}</div></div>
                  </Link>

                  <div className="flex items-center justify-between gap-3 sm:block">
                    <Badge tone={statusTone(candidate.status)}>{humanStatus(candidate.status)}</Badge>
                    <div className="mt-2 text-xs text-[var(--muted)] sm:block">{active ? "Online now" : candidate.lastSeenAt ? `Last active ${relativeTime(candidate.lastSeenAt)}` : "Not opened"}</div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[var(--muted)]"><span>Progress</span><span>{candidate.progress}%</span></div>
                    <Progress value={candidate.progress} />
                    <div className="mt-2 truncate text-xs text-[var(--muted)]">{candidate.currentQuestion ? `Current: ${candidate.currentQuestion}` : candidate.submittedAt ? `Submitted ${relativeTime(candidate.submittedAt)}` : candidate.expiresAt ? `Expires ${formatDate(candidate.expiresAt, { dateStyle: "medium" })}` : "Waiting"}</div>
                  </div>

                  <div className="relative flex items-center justify-end gap-2">
                    {candidate.invitationId ? <Button size="icon" variant="secondary" loading={workingId === candidate.invitationId} onClick={() => void copyInvitation(candidate.invitationId!)} aria-label="Copy invitation link">{copied === candidate.invitationId ? <Check className="size-4" /> : <Copy className="size-4" />}</Button> : null}
                    <Link href={`/admin/candidates/${candidate.id}`} className="grid size-11 place-items-center rounded-full bg-[#292624] text-white transition hover:-translate-y-0.5"><ArrowRight className="size-4" /></Link>
                    {candidate.invitationId ? (
                      <button type="button" onClick={() => setMenuId((current) => current === candidate.id ? null : candidate.id)} className="grid size-11 place-items-center rounded-full hover:bg-black/5" aria-label="Invitation actions"><MoreHorizontal className="size-5" /></button>
                    ) : null}
                    {menuId === candidate.id && candidate.invitationId ? (
                      <div className="absolute end-0 top-12 z-20 w-52 rounded-2xl border border-[var(--border)] bg-white p-1.5 shadow-xl">
                        <button type="button" onClick={() => void invitationAction(candidate.invitationId!, "rotate")} className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-sm font-semibold hover:bg-black/5"><RotateCw className="size-4" />Rotate and copy link</button>
                        {candidate.invitationStatus === "revoked" ? <button type="button" onClick={() => void invitationAction(candidate.invitationId!, "restore")} className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-sm font-semibold hover:bg-black/5"><Link2 className="size-4" />Restore link</button> : <button type="button" onClick={() => void invitationAction(candidate.invitationId!, "revoke")} className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)]"><ShieldX className="size-4" />Revoke link</button>}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid place-items-center px-5 py-20 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]"><Send className="size-6" /></div>
            <h3 className="mt-6 font-[family-name:var(--font-serif)] text-3xl font-semibold">No invitations yet.</h3>
            <p className="mt-3 max-w-md leading-7 text-[var(--muted)]">Create one private link for one person. Her name never appears inside the public URL.</p>
            <Button className="mt-6" onClick={() => setCreateOpen(true)}><Plus className="size-4" />Create first invitation</Button>
          </div>
        )}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={created ? "Invitation ready" : "Create a private invitation"}>
        {created ? (
          <div>
            <div className="rounded-3xl bg-[#292624] p-5 text-white">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#f0a9b8]">Unique private link</div>
              <div className="mt-4 break-all text-sm leading-6 text-white/70">{created.url}</div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button size="lg" onClick={() => void copyText(created.url, "created")}>{copied === "created" ? <Check className="size-4" /> : <Copy className="size-4" />}{copied === "created" ? "Copied" : "Copy link"}</Button>
              <a href={created.url} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white px-5 text-sm font-bold hover:border-[var(--accent)]">Preview <ExternalLink className="size-4" /></a>
            </div>
            <p className="mt-5 text-sm leading-6 text-[var(--muted)]">Send this only after mutual interest exists. The token is random and contains no name or profile information.</p>
          </div>
        ) : (
          <form onSubmit={createInvitation} className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold">First name<Input value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Sofia" required /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">Where you matched<Input value={source} onChange={(event) => setSource(event.target.value)} placeholder="Hinge" /></label>
              <label className="grid gap-2 text-sm font-bold">Preferred language<select value={language} onChange={(event) => setLanguage(event.target.value as Language | "")} className="min-h-12 rounded-2xl border border-[var(--border)] bg-white px-4 outline-none focus:border-[var(--accent)]"><option value="">Let her choose</option>{LANGUAGES.map((item) => <option key={item} value={item}>{LANGUAGE_META[item].native}</option>)}</select></label>
            </div>
            <label className="grid gap-2 text-sm font-bold">Expires in<select value={expiresInDays} onChange={(event) => setExpiresInDays(Number(event.target.value))} className="min-h-12 rounded-2xl border border-[var(--border)] bg-white px-4 outline-none focus:border-[var(--accent)]"><option value={7}>7 days</option><option value={14}>14 days</option><option value={30}>30 days</option><option value={60}>60 days</option></select></label>
            <label className="grid gap-2 text-sm font-bold">Private notes<Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Anything only you should see" rows={4} /></label>
            {error ? <div className="rounded-2xl bg-[var(--danger-soft)] px-4 py-3 text-sm font-semibold text-[var(--danger)]">{error}</div> : null}
            <div className="mt-2 flex justify-end"><Button type="submit" size="lg" loading={creating}><Link2 className="size-4" />Generate unique link</Button></div>
          </form>
        )}
      </Modal>
    </div>
  );
}

function Metric({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: number; note: string }) {
  return <Card className="p-5"><div className="flex items-center justify-between"><div className="grid size-10 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">{icon}</div><div className="font-[family-name:var(--font-serif)] text-4xl font-semibold tracking-[-0.04em]">{value}</div></div><div className="mt-5 font-bold">{label}</div><div className="mt-1 text-xs text-[var(--muted)]">{note}</div></Card>;
}
