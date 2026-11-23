export function variantLabel(variant: {
  color?: string | null;
  size?: string | null;
}): string {
  return [variant.color, variant.size].filter(Boolean).join(" / ") || "Default";
}
