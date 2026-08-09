import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { CandidateSummary, Language } from "@/lib/types";
import { DashboardClient } from "@/components/admin/DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: candidateRows } = await supabase.from("candidates").select("*").eq("owner_id", user.id).order("created_at", { ascending: false });
  const ids = (candidateRows ?? []).map((row) => row.id);
  const [{ data: invitationRows }, { data: sessionRows }, { data: assessmentRows }] = ids.length
    ? await Promise.all([
        supabase.from("invitations").select("*").eq("owner_id", user.id).in("candidate_id", ids).order("created_at", { ascending: false }),
        supabase.from("public_sessions").select("*").in("candidate_id", ids).order("last_seen_at", { ascending: false }),
        supabase.from("assessments").select("candidate_id, overall_score").in("candidate_id", ids),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];

  const candidates: CandidateSummary[] = (candidateRows ?? []).map((candidate) => {
    const invitation = (invitationRows ?? []).find((row) => row.candidate_id === candidate.id) ?? null;
    const session = (sessionRows ?? []).find((row) => row.candidate_id === candidate.id) ?? null;
    const assessment = (assessmentRows ?? []).find((row) => row.candidate_id === candidate.id) ?? null;
    return {
      id: candidate.id,
      firstName: candidate.first_name,
      source: candidate.source,
      preferredLanguage: candidate.preferred_language as Language | null,
      status: candidate.status,
      createdAt: candidate.created_at,
      updatedAt: candidate.updated_at,
      invitationId: invitation?.id ?? null,
      invitationStatus: invitation?.status ?? null,
      expiresAt: invitation?.expires_at ?? null,
      openedAt: invitation?.opened_at ?? null,
      submittedAt: invitation?.submitted_at ?? null,
      lastSeenAt: session?.last_seen_at ?? null,
      progress: Number(session?.progress ?? (candidate.status === "submitted" ? 100 : 0)),
      currentStage: session?.current_stage ?? null,
      currentQuestion: session?.current_question ?? null,
      overallScore: assessment?.overall_score === null || assessment?.overall_score === undefined ? null : Number(assessment.overall_score),
    };
  });

  return <DashboardClient candidates={candidates} />;
}
