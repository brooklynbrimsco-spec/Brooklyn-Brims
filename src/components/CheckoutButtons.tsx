"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { PaymentProviders } from "@/lib/types";

export function CheckoutButtons({ providers }: { providers: PaymentProviders }) {
  const { items, clear } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<"stripe" | "paypal" | null>(null);

  async function start(provider: "stripe" | "paypal") {
    setError(null);
    setPending(provider);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            quantity: item.quantity,
          })),
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout could not start.");
      }
      if (provider === "paypal") {
        clear();
      }
      window.location.href = data.url;
    } catch (err) {
      setPending(null);
      setError(err instanceof Error ? err.message : "Checkout could not start.");
    }
  }

  const none = !providers.stripe && !providers.paypal;
  const disabled = items.length === 0 || pending !== null;

  return (
    <div className="space-y-3">
      {providers.stripe ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => start("stripe")}
          className="w-full rounded-full bg-ink px-6 py-3 text-[11px] tracking-[0.18em] text-white uppercase hover:bg-navy disabled:opacity-50"
        >
          {pending === "stripe" ? "Sending you to Stripe…" : "Pay with card · Stripe"}
        </button>
      ) : null}
      {providers.paypal ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => start("paypal")}
          className="w-full rounded-full bg-[#003087] px-6 py-3 text-[11px] tracking-[0.18em] text-white uppercase hover:bg-[#00205b] disabled:opacity-50"
        >
          {pending === "paypal" ? "Sending you to PayPal…" : "Pay with PayPal"}
        </button>
      ) : null}
      {none ? (
        <p className="bg-[#f7f5f1] px-4 py-3 text-sm text-muted">
          Checkout is off in this preview until Stripe or PayPal keys are added
          in Cursor secrets. The cart still works.
        </p>
      ) : (
        <div className="space-y-1 text-xs text-muted">
          {!providers.stripe ? (
            <p>Card checkout is hidden until Stripe keys are set.</p>
          ) : null}
          {!providers.paypal ? (
            <p>PayPal is hidden until PayPal keys are set.</p>
          ) : null}
        </div>
      )}
      {error ? <p className="text-sm text-star">{error}</p> : null}
    </div>
  );
}
