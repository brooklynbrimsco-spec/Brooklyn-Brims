"use client";

import Link from "next/link";
import { CheckoutButtons } from "@/components/CheckoutButtons";
import { useCart } from "@/components/CartProvider";
import { formatUsd } from "@/lib/money";
import type { PaymentProviders } from "@/lib/types";

export function CartDrawer({ providers }: { providers: PaymentProviders }) {
  const { items, open, closeCart, setQuantity, removeItem, subtotal } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="font-[family-name:var(--font-newsreader)] text-2xl italic">
            Your Selection
          </h2>
          <button type="button" onClick={closeCart} aria-label="Close" className="text-xl">
            ×
          </button>
        </div>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="text-xl font-semibold">Add to your cart.</p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="mt-6 text-[11px] tracking-[0.22em] uppercase underline"
            >
              Hats
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-5 overflow-y-auto px-6">
              {items.map((item) => (
                <li
                  key={`${item.productId}:${item.variantId ?? ""}`}
                  className="flex gap-3"
                >
                  <div className="h-20 w-20 shrink-0 bg-[#f6f4f0]">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    {item.variantLabel ? (
                      <p className="text-xs text-muted">{item.variantLabel}</p>
                    ) : null}
                    <p className="mt-1 text-sm">{formatUsd(item.priceCents)}</p>
                    <div className="mt-2 flex items-center gap-3">
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
                        className="text-xs text-muted underline"
                        onClick={() => removeItem(item.productId, item.variantId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-6 py-5">
              <div className="mb-4 flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold">{formatUsd(subtotal)}</span>
              </div>
              <CheckoutButtons providers={providers} />
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
