import { PlaceholderCard, ProductCard } from "@/components/ProductCard";
import { FALLBACK_IMAGE, PLACEHOLDER_HATS } from "@/lib/placeholders";
import type { Product } from "@/lib/types";

export function ProductGrid({
  products,
  placeholdersWhenEmpty = false,
}: {
  products: Product[];
  placeholdersWhenEmpty?: boolean;
}) {
  const shown = new Set(products.map((product) => product.images[0] ?? FALLBACK_IMAGE));
  const extras =
    placeholdersWhenEmpty && products.length < 4
      ? PLACEHOLDER_HATS.filter((hat) => !shown.has(hat.image)).slice(
          0,
          Math.max(0, 4 - products.length),
        )
      : [];

  if (products.length === 0 && extras.length === 0) {
    return (
      <ul className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4" />
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
      {extras.map((hat) => (
        <li key={hat.name}>
          <PlaceholderCard name={hat.name} price={hat.price} image={hat.image} />
        </li>
      ))}
    </ul>
  );
}
