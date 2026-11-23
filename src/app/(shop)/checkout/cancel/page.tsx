import Link from "next/link";

export const metadata = {
  title: "Checkout canceled",
};

export default function CancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-[family-name:var(--font-oswald)] text-4xl uppercase">
        Checkout canceled
      </h1>
      <p className="mt-4 text-muted">
        Nothing was charged. Your cart is still here if you want to try again.
      </p>
      <Link
        href="/cart"
        className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-[11px] tracking-[0.2em] text-white uppercase"
      >
        Return to cart
      </Link>
    </div>
  );
}
