import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  adminCookieValue,
  getAdminSecret,
  secretsEqual,
} from "@/lib/auth";
import { isSameOrigin, requestOrigin } from "@/lib/http";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  const secret = getAdminSecret();
  const origin = requestOrigin(request);
  const fail = NextResponse.redirect(new URL("/admin/login?error=1", origin));
  if (!secret) {
    return NextResponse.redirect(new URL("/admin/login", origin));
  }

  const contentType = request.headers.get("content-type") ?? "";
  let password = "";
  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as { password?: string } | null;
    password = String(body?.password ?? "");
  } else {
    const form = await request.formData().catch(() => null);
    password = String(form?.get("password") ?? "");
  }
  if (password.length > 200 || !secretsEqual(password, secret)) {
    return fail;
  }

  const response = NextResponse.redirect(new URL("/admin", origin));
  response.cookies.set(ADMIN_COOKIE, adminCookieValue(secret), adminCookieOptions());
  return response;
}
