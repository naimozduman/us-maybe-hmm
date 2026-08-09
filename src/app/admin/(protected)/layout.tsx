import { requireUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <AdminShell email={user.email ?? "Owner"}>{children}</AdminShell>;
}
