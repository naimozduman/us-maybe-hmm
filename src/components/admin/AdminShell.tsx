"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Settings2, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/standards", label: "My standards", icon: Settings2 },
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#eee7de] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden min-h-screen border-e border-black/10 bg-[#292624] p-5 text-white lg:flex lg:flex-col">
        <Link href="/admin" className="flex items-center gap-3 rounded-2xl px-2 py-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-[var(--accent)]"><Sparkles className="size-5" /></div>
          <div><div className="font-[family-name:var(--font-serif)] text-xl font-semibold">Us, Maybe?</div><div className="text-xs text-white/45">Private control center</div></div>
        </Link>
        <nav className="mt-8 grid gap-1.5">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={cn("flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition", active ? "bg-white text-[#292624]" : "text-white/65 hover:bg-white/8 hover:text-white")}>
                <item.icon className="size-4" />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="truncate text-xs text-white/50">Signed in as</div>
          <div className="mt-1 truncate text-sm font-semibold">{email}</div>
          <button type="button" onClick={() => void signOut()} className="mt-3 flex min-h-10 w-full items-center gap-2 rounded-xl px-2 text-sm font-semibold text-white/65 hover:bg-white/8 hover:text-white"><LogOut className="size-4" />Sign out</button>
        </div>
      </aside>

      <div className="min-w-0 pb-24 lg:pb-0">
        <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">{children}</div>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 rounded-2xl border border-black/10 bg-[#292624] p-1.5 text-white shadow-2xl lg:hidden">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return <Link key={item.href} href={item.href} className={cn("flex min-h-12 items-center justify-center gap-2 rounded-xl text-xs font-bold", active ? "bg-white text-[#292624]" : "text-white/60")}><item.icon className="size-4" />{item.label}</Link>;
        })}
      </nav>
    </div>
  );
}
