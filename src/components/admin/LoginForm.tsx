"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleAlert, LoaderCircle, LockKeyhole, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("Naim");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { data, error: signupError } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } });
        if (signupError) throw signupError;
        if (!data.session) {
          setMessage("Check your email to confirm the account, then sign in.");
          setMode("signin");
          return;
        }
      } else {
        const { error: signinError } = await supabase.auth.signInWithPassword({ email, password });
        if (signinError) throw signinError;
      }
      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[650px] overflow-hidden bg-[#292624] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -end-24 -top-24 size-80 rounded-full bg-[var(--accent)]/65" />
          <div className="absolute -bottom-36 -start-28 size-96 rounded-full bg-[var(--sage)]/75" />
          <div className="relative flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl bg-white text-[#292624]"><Sparkles className="size-5" /></div><div className="font-[family-name:var(--font-serif)] text-2xl font-semibold">Us, Maybe?</div></div>
          <div className="relative">
            <h1 className="font-[family-name:var(--font-serif)] text-5xl font-semibold leading-[1.02] tracking-[-0.045em]">Her experience stays soft. Your review stays clear.</h1>
            <p className="mt-6 max-w-md leading-8 text-white/60">Create private links, watch meaningful progress in real time, read every answer, and make the final decision yourself.</p>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--accent)]"><LockKeyhole className="size-4" />Private dashboard</div>
          <h2 className="mt-7 font-[family-name:var(--font-serif)] text-4xl font-semibold tracking-[-0.04em]">{mode === "signin" ? "Welcome back." : "Create the owner account."}</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">{mode === "signin" ? "Sign in to manage invitations and responses." : "This account controls every private invitation and answer."}</p>

          <form onSubmit={submit} className="mt-8 grid gap-4">
            {mode === "signup" ? <label className="grid gap-2 text-sm font-bold">Display name<Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" required /></label> : null}
            <label className="grid gap-2 text-sm font-bold">Email<Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
            <label className="grid gap-2 text-sm font-bold">Password<Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={8} required /></label>
            {error ? <div className="flex gap-2 rounded-2xl bg-[var(--danger-soft)] px-4 py-3 text-sm font-semibold text-[var(--danger)]"><CircleAlert className="mt-0.5 size-4 shrink-0" />{error}</div> : null}
            {message ? <div className="rounded-2xl bg-[var(--sage-soft)] px-4 py-3 text-sm font-semibold text-[var(--sage)]">{message}</div> : null}
            <Button size="lg" type="submit" loading={loading} className="mt-2 w-full">{loading ? <LoaderCircle className="size-4 animate-spin" /> : null}{mode === "signin" ? "Sign in" : "Create account"}<ArrowRight className="size-4" /></Button>
          </form>

          <button type="button" onClick={() => { setMode((current) => current === "signin" ? "signup" : "signin"); setError(""); setMessage(""); }} className="mt-6 min-h-11 text-sm font-semibold text-[var(--accent)] hover:underline">
            {mode === "signin" ? "First setup? Create the owner account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
