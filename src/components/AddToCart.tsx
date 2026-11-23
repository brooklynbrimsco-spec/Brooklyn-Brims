"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { variantLabel } from "@/lib/variant-label";
import type { Product } from "@/lib/types";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);

  const selected = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? null,
    [product.variants, variantId],
  );

  function onAdd() {
    if (product.variants.length > 0 && !selected) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        variantId: selected?.id ?? null,
        variantLabel: selected ? variantLabel(selected) : null,
        image: product.images[0] ?? "/placeholders/hat-navy.jpg",
      },
      qty,
    );
  }

  return (
    <div className="space-y-4">
      {product.variants.length > 0 ? (
        <label className="block text-sm">
          <span className="text-muted">Color / size</span>
          <select
            className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2"
            value={variantId}
            onChange={(event) => setVariantId(event.target.value)}
          >
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variantLabel(variant)}
                {variant.sku ? ` · ${variant.sku}` : ""}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-line">
          <button
            type="button"
            className="px-3 py-2"
            onClick={() => setQty((n) => Math.max(1, n - 1))}
          >
            −
          </button>
          <span className="w-8 text-center text-sm">{qty}</span>
          <button
            type="button"
            className="px-3 py-2"
            onClick={() => setQty((n) => Math.min(20, n + 1))}
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex-1 rounded-full bg-ink px-6 py-3 text-[11px] tracking-[0.2em] text-white uppercase hover:bg-navy"
        >
          Add to bag
        </button>
      </div>
    </div>
  );
}
