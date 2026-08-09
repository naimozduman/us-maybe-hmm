import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashToken } from "@/lib/crypto";
import { readPublicSessionToken } from "@/lib/public-session";

export async function requirePublicSession(invitationId: string) {
  const raw = await readPublicSessionToken();
  if (!raw) throw new Error("PUBLIC_SESSION_MISSING");
  const admin = createAdminClient();
  const { data: session, error } = await admin
    .from("public_sessions")
    .select("*")
    .eq("invitation_id", invitationId)
    .eq("session_hash", hashToken(raw))
    .maybeSingle();
  if (error || !session) throw new Error("PUBLIC_SESSION_INVALID");

  const { data: invitation, error: invitationError } = await admin
    .from("invitations")
    .select("*")
    .eq("id", invitationId)
    .maybeSingle();
  if (invitationError || !invitation) throw new Error("INVITATION_INVALID");
  if (["revoked", "expired", "withdrawn", "declined"].includes(invitation.status)) throw new Error("INVITATION_CLOSED");
  if (invitation.expires_at && new Date(invitation.expires_at).getTime() < Date.now()) throw new Error("INVITATION_EXPIRED");

  return { admin, session, invitation };
}
