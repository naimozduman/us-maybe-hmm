import Link from "next/link";
import { ArrowRight, HeartHandshake, LockKeyhole, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] sm:min-h-[calc(100vh-6rem)]">
        <header className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 sm:px-8">
          <div className="font-[family-name:var(--font-serif)] text-xl font-semibold tracking-[-0.02em]">
            Us, Maybe?
          </div>
          <Link
            href="/admin"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
          >
            Private dashboard
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-16 lg:py-16">
          <div className="fade-up max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
              <Sparkles className="size-4" aria-hidden="true" />
              Honest beats impressive
            </div>
            <h1 className="font-[family-name:var(--font-serif)] text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              A thoughtful start before feelings move faster than facts.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">
              A private, multilingual compatibility experience. No public score. No automatic decision. One honest place to understand values, communication, and the future.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/admin"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]"
              >
                Open dashboard
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="soft-enter relative mx-auto w-full max-w-md">
            <div className="absolute -left-8 -top-8 size-28 rounded-full border border-[var(--border)] bg-[var(--sage-soft)]" />
            <div className="relative rotate-[1.2deg] rounded-[26px] border border-[var(--border)] bg-white p-5 shadow-[0_20px_55px_rgba(70,50,38,0.12)]">
              <div className="rounded-[20px] bg-[#292624] p-7 text-white">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Private invitation</div>
                <div className="mt-14 font-[family-name:var(--font-serif)] text-4xl leading-tight">Hi. I made something a little unusual.</div>
                <p className="mt-5 leading-7 text-white/70">It takes a few thoughtful minutes. There is no pass or fail here.</p>
              </div>
              <div className="grid gap-3 pt-5 sm:grid-cols-3">
                <div className="rounded-2xl bg-[var(--accent-soft)] p-4">
                  <HeartHandshake className="size-5 text-[var(--accent)]" />
                  <div className="mt-6 text-sm font-semibold">Personal</div>
                </div>
                <div className="rounded-2xl bg-[var(--sage-soft)] p-4">
                  <LockKeyhole className="size-5 text-[var(--sage)]" />
                  <div className="mt-6 text-sm font-semibold">Private</div>
                </div>
                <div className="rounded-2xl bg-[var(--warning-soft)] p-4">
                  <Sparkles className="size-5 text-[var(--warning)]" />
                  <div className="mt-6 text-sm font-semibold">Honest</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
