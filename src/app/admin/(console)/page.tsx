import Link from "next/link";
import { listAllProducts } from "@/lib/catalog";
import { listContactMessages, listOrders } from "@/lib/orders";

export const metadata = { title: "Studio" };

export default async function AdminHomePage() {
  const [products, orders, messages] = await Promise.all([
    listAllProducts(),
    listOrders(),
    listContactMessages(),
  ]);
  const published = products.filter((p) => p.published).length;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-newsreader)] text-3xl text-navy">
        Studio
      </h1>
      <p className="mt-2 text-muted">
        Add hats, hide them, and watch orders come in from Stripe or PayPal.
      </p>
      <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Products" value={String(products.length)} hint={`${published} live`} />
        <Stat label="Orders" value={String(orders.length)} hint="Latest 100" />
        <Stat label="Messages" value={String(messages.length)} hint="Contact form" />
      </dl>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="bg-navy px-5 py-3 text-sm tracking-wide text-paper uppercase"
        >
          New product
        </Link>
        <Link
          href="/admin/products"
          className="border border-navy px-5 py-3 text-sm tracking-wide text-navy uppercase"
        >
          All products
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="border border-line bg-paper p-5">
      <dt className="text-xs tracking-wide text-muted uppercase">{label}</dt>
      <dd className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl text-navy">
        {value}
      </dd>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
