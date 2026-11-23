import type { Product } from "@/lib/types";
import { centsToDollarsInput } from "@/lib/money";

const EMPTY_ROWS = 3;

export function ProductForm({ product }: { product?: Product | null }) {
  const rows = Array.from({ length: EMPTY_ROWS }, (_, index) => product?.variants[index]);

  return (
    <form
      action="/api/admin/products"
      method="post"
      autoComplete="off"
      className="max-w-xl space-y-5"
    >
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <label className="block text-sm">
        Name
        <input
          name="name"
          defaultValue={product?.name ?? ""}
          required
          maxLength={120}
          autoComplete="off"
          className="mt-1 w-full border border-line bg-paper px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        Slug
        <input
          name="slug"
          defaultValue={product?.slug ?? ""}
          autoComplete="off"
          className="mt-1 w-full border border-line bg-paper px-3 py-2"
        />
        <span className="mt-1 block text-xs text-muted">
          Leave blank to generate from the name.
        </span>
      </label>
      <label className="block text-sm">
        Description
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={5}
          maxLength={8000}
          className="mt-1 w-full border border-line bg-paper px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        Price (USD)
        <input
          name="price"
          defaultValue={product ? centsToDollarsInput(product.priceCents) : ""}
          required
          inputMode="decimal"
          autoComplete="off"
          className="mt-1 w-full border border-line bg-paper px-3 py-2"
        />
        <span className="mt-1 block text-xs text-muted">Example: 48.00</span>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={product ? product.published : true}
        />
        Published (visible in the shop)
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={Boolean(product?.featured)}
        />
        Featured on the home page
      </label>
      <label className="block text-sm">
        Image URLs
        <textarea
          name="images"
          defaultValue={product?.images.join("\n") ?? ""}
          rows={4}
          className="mt-1 w-full border border-line bg-paper px-3 py-2"
          placeholder="https://…"
        />
        <span className="mt-1 block text-xs text-muted">
          One http(s) URL per line. The hat silhouette shows until you add photos.
        </span>
      </label>
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-navy">Variants (optional)</legend>
        {rows.map((variant, index) => (
          <div key={index} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <input
              name="variant_color"
              placeholder="Color"
              defaultValue={variant?.color ?? ""}
              className="border border-line bg-paper px-2 py-1.5 text-sm"
            />
            <input
              name="variant_size"
              placeholder="Size"
              defaultValue={variant?.size ?? ""}
              className="border border-line bg-paper px-2 py-1.5 text-sm"
            />
            <input
              name="variant_sku"
              placeholder="SKU"
              defaultValue={variant?.sku ?? ""}
              className="border border-line bg-paper px-2 py-1.5 text-sm"
            />
            <input
              name="variant_stock"
              placeholder="Stock"
              defaultValue={variant?.stock == null ? "" : String(variant.stock)}
              className="border border-line bg-paper px-2 py-1.5 text-sm"
            />
          </div>
        ))}
      </fieldset>
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="bg-navy px-5 py-2.5 text-sm tracking-wide text-paper uppercase"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export function DeleteProductForm({ id }: { id: string }) {
  return (
    <form action="/api/admin/products/delete" method="post" className="mt-6">
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm text-star underline">
        Delete
      </button>
    </form>
  );
}
