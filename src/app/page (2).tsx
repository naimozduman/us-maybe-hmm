import type { Metadata } from "next";
import { InvitationExperience } from "@/components/public/InvitationExperience";

export const metadata: Metadata = {
  title: "Private invitation",
  description: "A private invitation from Naim.",
};

export default async function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <InvitationExperience token={token} />;
}
