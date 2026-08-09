import type { Metadata } from "next";
import { AccountSecurityForm } from "@/components/admin/AccountSecurityForm";

export const metadata: Metadata = {
  title: "Account security",
};

export default function AccountSecurityPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Owner account
        </p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Account security
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
          Replace the temporary deployment password with a private password you do not use elsewhere.
        </p>
      </div>
      <AccountSecurityForm />
    </div>
  );
}
