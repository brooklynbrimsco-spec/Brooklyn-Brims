import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { TrustTicker } from "@/components/TrustTicker";
import { listFeaturedProducts, listPublishedProducts } from "@/lib/catalog";

export default async function HomePage() {
  const featured = await listFeaturedProducts();
  const published = featured.length > 0 ? featured : await listPublishedProducts();

  return (
    <div>
      <section className="relative min-h-[92vh] w-full overflow-hidden bg-navy">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/placeholders/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/40" />
        <div className="relative flex min-h-[92vh] flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="font-[family-name:var(--font-oswald)] text-5xl font-semibold tracking-wide uppercase sm:text-7xl">
            Hats from Brooklyn, CT.
          </h1>
          <Link
            href="/shop"
            className="mt-8 rounded-full bg-white px-8 py-3 text-[11px] font-semibold tracking-[0.22em] text-ink uppercase"
          >
            Shop now
          </Link>
        </div>
      </section>

      <TrustTicker />

      <section className="mx-auto max-w-[1400px] px-5 pt-20 pb-24 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-sky uppercase">
              We’ve got you covered.
            </p>
            <h2 className="font-[family-name:var(--font-newsreader)] text-4xl italic text-sky sm:text-5xl">
              The Collection
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-[11px] tracking-[0.2em] text-muted uppercase hover:text-ink"
          >
            Shop all
          </Link>
        </div>
        <ProductGrid products={published} placeholdersWhenEmpty />
      </section>
    </div>
  );
}
