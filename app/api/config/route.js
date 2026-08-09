import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const config = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || null,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
  };

  const script = `window.__US_MAYBE_CONFIG__ = ${JSON.stringify(config)};`;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
