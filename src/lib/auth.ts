import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "bb_admin";

/** Local-only mock when no hosted database and no ADMIN_SECRET. Never used when DATABASE_URL is set. */
const LOCAL_ADMIN_FALLBACK = "local-dev";

export function getAdminSecret(): string | null {
  const fromEnv = process.env.ADMIN_SECRET?.trim() ?? "";
  if (fromEnv) return fromEnv;
  if (process.env.DATABASE_URL?.trim()) return null;
  return LOCAL_ADMIN_FALLBACK;
}

export function isLocalAdminFallback(): boolean {
  return !process.env.ADMIN_SECRET?.trim() && !process.env.DATABASE_URL?.trim();
}

export function adminCookieValue(secret: string): string {
  return createHmac("sha256", secret)
    .update("brooklyn-brims-admin-v1")
    .digest("hex");
}

export function secretsEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}

export async function isAdmin(): Promise<boolean> {
  const secret = getAdminSecret();
  if (!secret) return false;
  const jar = await cookies();
  const value = jar.get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  return secretsEqual(value, adminCookieValue(secret));
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 14,
  };
}
