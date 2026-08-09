import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const user = await getUser();
  if (user) redirect("/admin");
  return <LoginForm />;
}
