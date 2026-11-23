import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth";
import { isSameOrigin, requestOrigin } from "@/lib/http";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  const response = NextResponse.redirect(new URL("/admin/login", requestOrigin(request)));
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
