import Link from "next/link";
import { getStripe } from "@/lib/payments";
import { markOrderPaid } from "@/lib/orders";

export const metadata = {
  title: "Order placed",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  if (sessionId && sessionId.length < 200) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid" || session.status === "complete") {
          await markOrderPaid({
            stripeSessionId: session.id,
            email: session.customer_details?.email ?? session.customer_email,
          });
        }
      } catch {
        /* webhook remains the source of truth */
      }
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-[family-name:var(--font-oswald)] text-4xl uppercase">
        Thank you
      </h1>
      <p className="mt-4 text-muted">
        Your order is in. A receipt will follow from Stripe or PayPal when
        payment clears.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-[11px] tracking-[0.2em] text-white uppercase"
      >
        Back to shop
      </Link>
    </div>
  );
}
