export function safeHttpUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 2000) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function parseImageUrls(raw: string | string[]): string[] {
  const lines = Array.isArray(raw) ? raw : raw.split(/\r?\n/);
  const urls: string[] = [];
  for (const line of lines) {
    const url = safeHttpUrl(line);
    if (url && !urls.includes(url)) urls.push(url);
    if (urls.length >= 8) break;
  }
  return urls;
}
