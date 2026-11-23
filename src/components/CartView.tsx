"use client";

import Link from "next/link";
import { CheckoutButtons } from "@/components/CheckoutButtons";
import { useCart } from "@/components/CartProvider";
import { formatUsd } from "@/lib/money";
import type { PaymentProviders } from "@/lib/types";

export function CartView({ providers }: { providers: PaymentProviders }) {
  const { items, subtotal, setQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-xl font-semibold">Add to your cart.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block text-[11px] tracking-[0.22em] uppercase underline"
        >
          Hats
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
      <ul className="divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li
            key={`${item.productId}:${item.variantId ?? ""}`}
            className="flex gap-4 py-6"
          >
            <div className="h-24 w-24 shrink-0 bg-[#f7f5f1]">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" className="h-full w-full object-contain p-1" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/shop/${item.slug}`} className="font-semibold hover:underline">
                {item.name}
              </Link>
              {item.variantLabel ? (
                <p className="text-sm text-muted">{item.variantLabel}</p>
              ) : null}
              <p className="mt-1 text-sm">{formatUsd(item.priceCents)}</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="inline-flex items-center rounded-full border border-line">
                  <button
                    type="button"
                    className="px-2 py-1"
                    onClick={() =>
                      setQuantity(item.productId, item.variantId, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    className="px-2 py-1"
                    onClick={() =>
                      setQuantity(item.productId, item.variantId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="text-sm text-muted underline"
                  onClick={() => removeItem(item.productId, item.variantId)}
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="text-sm font-semibold">
              {formatUsd(item.priceCents * item.quantity)}
            </p>
          </li>
        ))}
      </ul>
      <aside>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-semibold">{formatUsd(subtotal)}</span>
        </div>
        <p className="mt-2 text-xs text-muted">
          Shipping and tax are calculated at checkout.
        </p>
        <div className="mt-6">
          <CheckoutButtons providers={providers} />
        </div>
      </aside>
    </div>
  );
}
