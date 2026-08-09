"use client";

import * as React from "react";
import { Check, CircleAlert, Save, Settings2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DEFAULT_STANDARDS } from "@/lib/constants";

type Standards = typeof DEFAULT_STANDARDS & Record<string, unknown>;

const fields: Array<{
  key: keyof typeof DEFAULT_STANDARDS;
  title: string;
  description: string;
  options?: Array<{ value: string; label: string }>;
}> = [
  { key: "marriageIntent", title: "Marriage intent", description: "What kind of relationship you are currently building toward.", options: [
    { value: "marriage", label: "Serious relationship leading toward marriage" },
    { value: "serious_slow", label: "Slow and serious, observe consistency first" },
    { value: "unsure", label: "Still deciding" },
  ] },
  { key: "dailyCommunication", title: "Daily communication", description: "The rhythm that helps you feel connected without controlling someone.", options: [
    { value: "checkins", label: "A few thoughtful check-ins" },
    { value: "daily_conversation", label: "One longer conversation each day" },
    { value: "throughout_day", label: "Messages throughout the day" },
    { value: "few_week", label: "A few conversations each week" },
  ] },
  { key: "videoCalls", title: "Voice and video calls", description: "Your preferred long-distance call rhythm.", options: [
    { value: "daily", label: "Daily" },
    { value: "four_five_weekly", label: "Four or five times each week" },
    { value: "two_three_weekly", label: "Two or three times each week" },
    { value: "weekly", label: "Once each week" },
  ] },
  { key: "faith", title: "Faith", description: "The role Islam should have in daily decisions and marriage.", options: [
    { value: "central", label: "Guides daily choices" },
    { value: "central_growing", label: "Deeply important, still growing" },
    { value: "cultural", label: "Mostly cultural" },
  ] },
  { key: "oppositeSexBoundaries", title: "Opposite-sex boundaries", description: "Set the standard you freely follow yourself.", options: [
    { value: "no_private", label: "No private contact beyond necessity" },
    { value: "necessity_only", label: "Necessary school or work contact only" },
    { value: "group_only", label: "Group friendships, no private emotional chats" },
    { value: "close_private", label: "Close private friendships are acceptable" },
  ] },
  { key: "workHomeRoles", title: "Work and home roles", description: "Your present preference, not a permanent command for another person.", options: [
    { value: "provider_home", label: "Husband provides, wife focuses mainly on home and children" },
    { value: "provider_flexible", label: "Husband is primary provider, roles adapt to life" },
    { value: "both_work", label: "Both work and share responsibilities" },
    { value: "open", label: "Open to several structures" },
  ] },
  { key: "children", title: "Children", description: "Whether children are part of the future you want.", options: [
    { value: "yes", label: "Yes" },
    { value: "unsure", label: "Unsure" },
    { value: "no", label: "No" },
  ] },
  { key: "finances", title: "Financial structure", description: "How you currently picture provision and shared money.", options: [
    { value: "husband_primary_provider", label: "Husband as primary provider" },
    { value: "income_based", label: "Contribution depends on income and circumstances" },
    { value: "equal", label: "Equal contribution" },
    { value: "separate", label: "Mostly separate finances" },
  ] },
  { key: "familyInfluence", title: "Family influence", description: "How advice and adult decision-making should coexist.", options: [
    { value: "advice_couple_decides", label: "Parents advise, the couple decides" },
    { value: "approve_major", label: "Parents approve major decisions" },
    { value: "parents_first", label: "Parents' wishes usually come first" },
  ] },
  { key: "conflict", title: "Conflict standard", description: "What a healthy pause and return should look like.", options: [
    { value: "direct_space_return_time", label: "Explain hurt, take space, give a return time" },
    { value: "solve_immediately", label: "Continue until everything is solved" },
    { value: "space_unscheduled", label: "Take space without a specific return time" },
  ] },
];

export function StandardsForm({ initialStandards, updatedAt }: { initialStandards: Record<string, unknown>; updatedAt: string | null }) {
  const [standards, setStandards] = React.useState<Standards>({ ...DEFAULT_STANDARDS, ...initialStandards } as Standards);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState("");

  const update = (key: string, value: unknown) => {
    setStandards((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const response = await fetch("/api/admin/standards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ standards }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed");
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const relocation = Array.isArray(standards.relocation) ? standards.relocation as string[] : [];
  const nonNegotiables = Array.isArray(standards.nonNegotiables) ? standards.nonNegotiables as string[] : [];

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]"><Settings2 className="size-4" />Your current position</div>
          <h1 className="mt-5 font-[family-name:var(--font-serif)] text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">My standards</h1>
          <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">Every invitation stores a snapshot of these answers. Future edits never rewrite an older person's comparison.</p>
        </div>
        <Button size="lg" loading={saving} onClick={() => void save()}>{saved ? <Check className="size-4" /> : <Save className="size-4" />}{saved ? "Saved" : "Save standards"}</Button>
      </div>

      {updatedAt ? <div className="mt-4 text-xs text-[var(--muted)]">Last saved {new Date(updatedAt).toLocaleString()}</div> : null}
      {error ? <div className="mt-5 flex gap-2 rounded-2xl bg-[var(--danger-soft)] px-4 py-3 text-sm font-semibold text-[var(--danger)]"><CircleAlert className="mt-0.5 size-4 shrink-0" />{error}</div> : null}

      <div className="mt-7 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5 sm:p-7">
          <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Sparkles className="size-5" /></div><div><h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">Compatibility baseline</h2><p className="mt-1 text-sm text-[var(--muted)]">Use what you truly want now.</p></div></div>
          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={String(field.key)} className="grid content-start gap-2">
                <span className="text-sm font-bold">{field.title}</span>
                <span className="min-h-10 text-xs leading-5 text-[var(--muted)]">{field.description}</span>
                <select value={String(standards[field.key] ?? "")} onChange={(event) => update(String(field.key), event.target.value)} className="min-h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-semibold outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]">
                  {field.options?.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
            ))}
          </div>
        </Card>

        <div className="grid content-start gap-5">
          <Card className="p-5 sm:p-7">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">Realistic relocation paths</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Select every location you would genuinely consider long term.</p>
            <div className="mt-5 grid gap-2">
              {[{ id: "us", label: "United States" }, { id: "turkiye", label: "Türkiye" }, { id: "current_country", label: "Her current country" }, { id: "other", label: "Another agreed country" }, { id: "flexible", label: "Flexible based on circumstances" }].map((item) => {
                const selected = relocation.includes(item.id);
                return <button key={item.id} type="button" onClick={() => update("relocation", selected ? relocation.filter((value) => value !== item.id) : [...relocation, item.id])} className={`flex min-h-12 items-center gap-3 rounded-2xl border px-4 text-start text-sm font-semibold transition ${selected ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-white hover:border-[var(--accent)]"}`}><span className={`grid size-6 place-items-center rounded-lg border ${selected ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)]"}`}>{selected ? <Check className="size-3.5" /> : null}</span>{item.label}</button>;
              })}
            </div>
          </Card>

          <Card className="p-5 sm:p-7">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">Nonnegotiables</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Keep this list short. A preference is not automatically a nonnegotiable.</p>
            <div className="mt-5 grid gap-2">
              {[{ id: "serious_intent", label: "Serious marriage intent" }, { id: "shared_faith", label: "Shared Islamic framework" }, { id: "loyalty", label: "Mutual loyalty and agreed boundaries" }, { id: "honest_communication", label: "Direct, respectful communication" }, { id: "children", label: "Wants children" }, { id: "relocation", label: "A workable relocation path" }].map((item) => {
                const selected = nonNegotiables.includes(item.id);
                return <button key={item.id} type="button" onClick={() => update("nonNegotiables", selected ? nonNegotiables.filter((value) => value !== item.id) : [...nonNegotiables, item.id])} className={`flex min-h-12 items-center gap-3 rounded-2xl border px-4 text-start text-sm font-semibold transition ${selected ? "border-[var(--sage)] bg-[var(--sage-soft)]" : "border-[var(--border)] bg-white hover:border-[var(--sage)]"}`}><span className={`grid size-6 place-items-center rounded-lg border ${selected ? "border-[var(--sage)] bg-[var(--sage)] text-white" : "border-[var(--border)]"}`}>{selected ? <Check className="size-3.5" /> : null}</span>{item.label}</button>;
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
