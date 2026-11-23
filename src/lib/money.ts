export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function dollarsToCents(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  const cents = Math.round(Number(trimmed) * 100);
  if (!Number.isFinite(cents) || cents < 0 || cents > 10_000_000) return null;
  return cents;
}

export function centsToDollarsInput(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function paypalAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}
