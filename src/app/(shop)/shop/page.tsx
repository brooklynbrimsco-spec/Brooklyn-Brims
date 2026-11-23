import { ProductGrid } from "@/components/ProductGrid";
import { listPublishedProducts } from "@/lib/catalog";

export const metadata = {
  title: "Shop",
};

export default async function ShopPage() {
  const products = await listPublishedProducts();

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
      <p className="text-[11px] tracking-[0.2em] text-muted uppercase">Shop / Hats</p>
      <h1 className="mt-2 font-[family-name:var(--font-oswald)] text-4xl uppercase">Hats</h1>
      <div className="mt-10">
        <ProductGrid products={products} placeholdersWhenEmpty />
      </div>
    </div>
  );
}
