import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

const SESSION_COOKIE_NAME = "ev_tracker_session";
const SESSION_SECRET = process.env.AUTH_SECRET || "ev-tracker-secret-key-2026";

/**
 * Hashes a plaintext password using PBKDF2 with salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a plaintext password against a stored salt:hash string.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, originalHash] = storedHash.split(":");
  if (!salt || !originalHash) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(originalHash));
}

interface SessionData {
  userId: string;
  username: string;
  expiresAt: number;
}

function signSession(data: SessionData): string {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

function verifySession(token: string): SessionData | null {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payload)
      .digest("base64url");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const data: SessionData = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (Date.now() > data.expiresAt) return null;

    return data;
  } catch {
    return null;
  }
}

/**
 * Creates an HTTP-only authentication session cookie.
 */
export async function createAuthSession(user: { id: string; username: string }): Promise<void> {
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const token = signSession({ userId: user.id, username: user.username, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
}

/**
 * Clears the session cookie.
 */
export async function destroyAuthSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Retrieves the currently authenticated user from session cookie & database.
 */
export async function getCurrentUser(): Promise<{
  id: string;
  username: string;
  email?: string | null;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const session = verifySession(token);
    if (!session) return null;

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, username: true, email: true },
    });

    return user;
  } catch {
    return null;
  }
}
