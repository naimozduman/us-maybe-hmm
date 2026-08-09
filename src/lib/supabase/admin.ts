import "server-only";
import { createClient } from "@supabase/supabase-js";

let adminClient: ReturnType<typeof createClient> | null = null;

export function createAdminClient() {
  if (adminClient) return adminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server environment variables are missing");
  adminClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}
