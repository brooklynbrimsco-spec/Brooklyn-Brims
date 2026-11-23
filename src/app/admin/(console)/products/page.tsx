import Link from "next/link";
import { listAllProducts } from "@/lib/catalog";
import { formatUsd } from "@/lib/money";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await listAllProducts();

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-[family-name:var(--font-newsreader)] text-3xl text-navy">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="bg-navy px-4 py-2 text-sm tracking-wide text-paper uppercase"
        >
          New
        </Link>
      </div>
      {products.length === 0 ? (
        <p className="mt-10 border border-dashed border-line bg-paper px-6 py-12 text-center text-muted">
          No hats yet. Add the first one — the public shop stays empty until you
          publish.
        </p>
      ) : (
        <table className="mt-8 w-full text-left text-sm">
          <thead className="border-b border-line text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="py-2 font-medium">Name</th>
              <th className="py-2 font-medium">Price</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-line/70">
                <td className="py-3">
                  <Link href={`/admin/products/${product.id}`} className="text-navy hover:underline">
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted">/{product.slug}</p>
                </td>
                <td className="py-3">{formatUsd(product.priceCents)}</td>
                <td className="py-3 text-muted">
                  {product.published ? "Live" : "Hidden"}
                  {product.featured ? " · Featured" : ""}
                </td>
                <td className="py-3 text-right">
                  <Link href={`/admin/products/${product.id}`} className="underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
