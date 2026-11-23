import { CartView } from "@/components/CartView";
import { paymentProviders } from "@/lib/payments";

export const metadata = {
  title: "Cart",
};

export default async function CartPage() {
  const providers = await paymentProviders();
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <h1 className="font-[family-name:var(--font-oswald)] text-4xl uppercase">
        Your selection
      </h1>
      <div className="mt-10">
        <CartView providers={providers} />
      </div>
    </div>
  );
}
