import { ProductGrid } from "@/components/ProductGrid";
import { listPublishedProducts } from "@/lib/catalog";

export const metadata = {
  title: "Hats",
};

export default async function ShopPage() {
  const products = await listPublishedProducts();

  return (
    <div>
      <section className="relative isolate h-[240px] overflow-hidden sm:h-[300px] lg:h-[360px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/placeholders/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
        <h1 className="relative flex h-full items-center justify-center font-[family-name:var(--font-oswald)] text-5xl font-semibold tracking-[0.12em] text-white uppercase sm:text-7xl">
          Hats
        </h1>
      </section>
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <ProductGrid products={products} placeholdersWhenEmpty />
      </div>
    </div>
  );
}
