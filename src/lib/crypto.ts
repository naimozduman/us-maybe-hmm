import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function generateToken(bytes = 24) {
  return randomBytes(bytes).toString("base64url");
}

export function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function encryptionKey() {
  const raw = process.env.INVITE_TOKEN_ENCRYPTION_KEY;
  if (!raw) throw new Error("INVITE_TOKEN_ENCRYPTION_KEY is missing");
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) throw new Error("INVITE_TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes");
  return key;
}

export function encryptToken(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString("base64url");
}

export function decryptToken(value: string) {
  const buffer = Buffer.from(value, "base64url");
  const iv = buffer.subarray(0, 12);
  const tag = buffer.subarray(12, 28);
  const ciphertext = buffer.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

export function safeTokenEqual(left: string, right: string) {
  const a = Buffer.from(hashToken(left));
  const b = Buffer.from(hashToken(right));
  return a.length === b.length && timingSafeEqual(a, b);
}
