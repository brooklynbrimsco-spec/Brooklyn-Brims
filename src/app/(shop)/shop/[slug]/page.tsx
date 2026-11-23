import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { getPublishedProductBySlug } from "@/lib/catalog";
import { formatUsd } from "@/lib/money";
import { FALLBACK_IMAGE } from "@/lib/placeholders";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  if (!product) return { title: "Hat" };
  return { title: product.name, description: product.description.slice(0, 160) };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  if (!product) notFound();

  const images = product.images;

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
      <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
        <Link href="/shop">Shop</Link>
        {" / "}
        {product.name}
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="aspect-square bg-[#f7f5f1]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[0] ?? FALLBACK_IMAGE}
              alt={product.name}
              className="h-full w-full object-contain p-8"
            />
          </div>
          {images.length > 1 ? (
            <div className="mt-4 flex justify-center gap-2">
              {images.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-16 w-16 rounded-md bg-[#f7f5f1] object-contain p-1"
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className="max-w-lg lg:pt-6">
          <p className="text-[11px] tracking-[0.22em] text-muted uppercase">
            Brooklyn Brims
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-oswald)] text-4xl uppercase leading-tight">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold">{formatUsd(product.priceCents)}</p>
          <p className="mt-3 text-xs tracking-[0.12em] text-sky uppercase">
            In stock · Ready to ship
          </p>
          {product.description ? (
            <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-muted">
              {product.description}
            </p>
          ) : (
            <ul className="mt-6 space-y-1 text-sm text-muted">
              <li>Structured snapback</li>
              <li>Adjustable fit</li>
              <li>Made to be worn hard</li>
              <li>From Brooklyn, Connecticut</li>
            </ul>
          )}
          <div className="mt-8">
            <AddToCart product={product} />
          </div>
          <p className="mt-6 text-[11px] tracking-[0.16em] text-muted uppercase">
            Payment & security · Stripe · PayPal
          </p>
        </div>
      </div>
    </div>
  );
}
