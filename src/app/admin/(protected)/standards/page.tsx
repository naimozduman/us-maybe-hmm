import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_STANDARDS } from "@/lib/constants";
import { StandardsForm } from "@/components/admin/StandardsForm";

export const dynamic = "force-dynamic";

export default async function StandardsPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase.from("owner_standards").select("standards,updated_at").eq("owner_id", user.id).maybeSingle();
  return <StandardsForm initialStandards={(data?.standards as Record<string, unknown>) ?? DEFAULT_STANDARDS} updatedAt={data?.updated_at ?? null} />;
}
