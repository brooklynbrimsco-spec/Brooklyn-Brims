import type { ShippingAddress } from "@/lib/types";

export function parseShippingJson(raw: string | null | undefined): ShippingAddress | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ShippingAddress>;
    const name = String(value.name ?? "").trim();
    const line1 = String(value.line1 ?? "").trim();
    if (!name || !line1) return null;
    return {
      name: name.slice(0, 120),
      phone: value.phone ? String(value.phone).trim().slice(0, 40) : null,
      line1: line1.slice(0, 200),
      line2: value.line2 ? String(value.line2).trim().slice(0, 200) : null,
      city: String(value.city ?? "").trim().slice(0, 100),
      state: value.state ? String(value.state).trim().slice(0, 40) : null,
      postalCode: String(value.postalCode ?? "").trim().slice(0, 20),
      country: String(value.country ?? "US").trim().slice(0, 2).toUpperCase() || "US",
    };
  } catch {
    return null;
  }
}

export function stringifyShipping(address: ShippingAddress): string {
  return JSON.stringify(address);
}

export function formatShippingAddress(address: ShippingAddress): string {
  const cityState = [address.city, address.state].filter(Boolean).join(", ");
  const region = [cityState, address.postalCode].filter(Boolean).join(" ");
  return [
    address.name,
    address.line1,
    address.line2,
    region,
    address.country,
    address.phone,
  ]
    .filter((line) => line && String(line).trim())
    .join("\n");
}
