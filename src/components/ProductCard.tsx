"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { variantLabel } from "@/lib/variant-label";
import { formatUsd } from "@/lib/money";
import { FALLBACK_IMAGE } from "@/lib/placeholders";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [hot, setHot] = useState(false);
  const image = product.images[0] ?? FALLBACK_IMAGE;

  function quickAdd(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const variant = product.variants[0] ?? null;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      variantId: variant?.id ?? null,
      variantLabel: variant ? variantLabel(variant) : null,
      image: product.images[0] ?? image,
    });
  }

  return (
    <article
      className="product-card group"
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-[#f7f5f1]">
        <Link href={`/shop/${product.slug}`} className="absolute inset-0 block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
          />
        </Link>
        <button
          type="button"
          onClick={quickAdd}
          className={`product-card-add absolute bottom-4 left-1/2 z-10 w-[min(90%,14rem)] -translate-x-1/2 rounded-full bg-ink py-2.5 text-[10px] tracking-[0.18em] text-white uppercase shadow-lg transition-opacity ${
            hot ? "opacity-100" : "opacity-0"
          }`}
        >
          Add to cart
        </button>
      </div>
      <Link href={`/shop/${product.slug}`} className="mt-3 block">
        <h2 className="text-sm font-semibold leading-snug">{product.name}</h2>
        <p className="mt-1 text-sm">{formatUsd(product.priceCents)}</p>
      </Link>
    </article>
  );
}

export function PlaceholderCard({
  name,
  price,
  image,
}: {
  name: string;
  price: string;
  image: string;
}) {
  return (
    <div className="block">
      <div className="relative aspect-square overflow-hidden bg-[#f7f5f1]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="h-full w-full object-contain p-4" />
      </div>
      <h2 className="mt-3 text-sm font-semibold leading-snug">{name}</h2>
      <p className="mt-1 text-sm">{price}</p>
      <p className="mt-1 text-[11px] tracking-[0.14em] text-muted uppercase">Coming soon</p>
    </div>
  );
}
