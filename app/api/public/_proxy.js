import { NextResponse } from "next/server";

function error(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function proxyPublicRequest(request, allowedActions) {
  let body;

  try {
    body = await request.json();
  } catch {
    return error("A JSON request body is required.");
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return error("Invalid request body.");
  }

  if (!allowedActions.includes(body.action)) {
    return error("This endpoint does not accept that action.", 405);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    return error("The application is not configured.", 503);
  }

  const upstream = await fetch(`${supabaseUrl}/functions/v1/um-public`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: publishableKey,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await upstream.text();
  const contentType = upstream.headers.get("content-type") || "application/json; charset=utf-8";

  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}
