import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center p-5"><div className="max-w-xl text-center"><div className="font-[family-name:var(--font-serif)] text-7xl font-semibold text-[var(--accent)]">404</div><h1 className="mt-5 font-[family-name:var(--font-serif)] text-4xl font-semibold">This page is not available.</h1><p className="mt-4 leading-7 text-[var(--muted)]">The invitation might be private, expired, revoked, or mistyped.</p><Link href="/" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#292624] px-5 text-sm font-bold text-white"><ArrowLeft className="size-4" />Return home</Link></div></main>;
}
