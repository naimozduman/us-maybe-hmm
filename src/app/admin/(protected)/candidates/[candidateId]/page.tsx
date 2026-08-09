import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CandidateDetailClient } from "@/components/admin/CandidateDetailClient";

export const dynamic = "force-dynamic";

export default async function CandidatePage({ params }: { params: Promise<{ candidateId: string }> }) {
  const { candidateId } = await params;
  const user = await requireUser();
  const supabase = await createClient();
  const { data: candidate } = await supabase.from("candidates").select("*").eq("id", candidateId).eq("owner_id", user.id).maybeSingle();
  if (!candidate) notFound();

  const { data: invitations } = await supabase.from("invitations").select("*").eq("candidate_id", candidateId).eq("owner_id", user.id).order("created_at", { ascending: false }).limit(1);
  const invitation = invitations?.[0] ?? null;

  const [{ data: sessions }, { data: answerRows }, { data: revisions }, { data: eventRows }, { data: assessment }, { data: review }] = await Promise.all([
    supabase.from("public_sessions").select("*").eq("candidate_id", candidateId).order("last_seen_at", { ascending: false }).limit(1),
    supabase.from("answers").select("*").eq("candidate_id", candidateId).order("updated_at", { ascending: true }),
    supabase.from("answer_revisions").select("question_id").eq("candidate_id", candidateId),
    supabase.from("interaction_events").select("id,event_type,screen_id,question_id,payload,occurred_at").eq("candidate_id", candidateId).order("occurred_at", { ascending: false }).limit(500),
    supabase.from("assessments").select("*").eq("candidate_id", candidateId).maybeSingle(),
    supabase.from("candidate_reviews").select("*").eq("candidate_id", candidateId).maybeSingle(),
  ]);

  const revisionCounts = (revisions ?? []).reduce<Record<string, number>>((accumulator, row) => {
    accumulator[row.question_id] = (accumulator[row.question_id] ?? 0) + 1;
    return accumulator;
  }, {});
  const answers = (answerRows ?? []).map((answer) => ({ ...answer, revision_count: revisionCounts[answer.question_id] ?? 1 }));

  return (
    <CandidateDetailClient
      candidate={candidate}
      invitation={invitation}
      session={sessions?.[0] ?? null}
      answers={answers}
      events={eventRows ?? []}
      assessment={assessment ?? null}
      review={review ?? null}
    />
  );
}
