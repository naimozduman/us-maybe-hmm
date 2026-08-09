import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const APP_ORIGIN = "https://us-maybe-hmm-production.up.railway.app";

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": origin === APP_ORIGIN ? APP_ORIGIN : APP_ORIGIN,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin"
  };
}

function json(request: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(request) });
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, { error: "Method not allowed." }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json(request, { error: "Server configuration error." }, 500);

  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!/^[a-f0-9]{64}$/i.test(token)) return json(request, { error: "Recovery link is invalid or expired." }, 400);
    if (password.length < 12 || password.length > 256) return json(request, { error: "Use a password between 12 and 256 characters." }, 400);

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const now = new Date().toISOString();
    const tokenHash = await sha256Hex(token);
    const { data: consumed, error: consumeError } = await admin
      .from("um_owner_reset_tokens")
      .update({ used_at: now })
      .eq("token_hash", tokenHash)
      .is("used_at", null)
      .gt("expires_at", now)
      .select("user_id")
      .maybeSingle();

    if (consumeError) throw consumeError;
    if (!consumed?.user_id) return json(request, { error: "Recovery link is invalid or expired." }, 401);

    const { error: updateError } = await admin.auth.admin.updateUserById(consumed.user_id, { password });
    if (updateError) throw updateError;

    return json(request, { ok: true });
  } catch (error) {
    console.error("owner reset failed", error);
    const message = error instanceof Error ? error.message : "Unable to reset password.";
    return json(request, { error: message }, 500);
  }
});
