import "server-only";
import { cookies } from "next/headers";
import { PUBLIC_SESSION_COOKIE, PUBLIC_SESSION_MAX_AGE } from "@/lib/constants";
import { generateToken, hashToken } from "@/lib/crypto";

export async function readPublicSessionToken() {
  const store = await cookies();
  return store.get(PUBLIC_SESSION_COOKIE)?.value ?? null;
}

export async function setPublicSessionToken(value: string) {
  const store = await cookies();
  store.set(PUBLIC_SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PUBLIC_SESSION_MAX_AGE,
  });
}

export async function clearPublicSessionToken() {
  const store = await cookies();
  store.set(PUBLIC_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function createPublicSessionSecret() {
  const token = generateToken(24);
  return { token, hash: hashToken(token) };
}
