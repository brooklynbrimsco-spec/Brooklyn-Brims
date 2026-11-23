import "server-only";

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const expected = requestOrigin(request);
  if (origin) {
    try {
      return new URL(origin).origin === expected;
    } catch {
      return false;
    }
  }
  const site = request.headers.get("sec-fetch-site");
  return site === "same-origin" || site === "none" || site === null;
}

export function requestOrigin(request: Request): string {
  const url = new URL(request.url);
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host") ||
    url.host;
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    url.protocol.replace(":", "");
  if (!host) return url.origin;
  return `${proto}://${host}`;
}
