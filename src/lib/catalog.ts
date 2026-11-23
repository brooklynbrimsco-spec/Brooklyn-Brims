import "server-only";

import { sql } from "@/lib/db";
import { parseImageUrls } from "@/lib/urls";
import { variantLabel as formatVariantLabel } from "@/lib/variant-label";
import type { Product, Variant } from "@/lib/types";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_cents: number | string;
  featured: boolean;
  published: boolean;
  images_json: string;
  created_at: string | Date;
  updated_at: string | Date;
};

type VariantRow = {
  id: string;
  product_id: string;
  color: string | null;
  size: string | null;
  sku: string | null;
  stock: number | string | null;
  sort_order: number | string;
};

function asIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : String(value);
}

function parseStoredImages(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw || "[]") as unknown;
    if (Array.isArray(parsed)) return parseImageUrls(parsed.map((item) => String(item)));
  } catch {
    /* ignore malformed JSON */
  }
  return [];
}

function mapVariant(row: VariantRow): Variant {
  return {
    id: row.id,
    productId: row.product_id,
    color: row.color,
    size: row.size,
    sku: row.sku,
    stock: row.stock == null ? null : Number(row.stock),
    sortOrder: Number(row.sort_order),
  };
}

function mapProduct(row: ProductRow, variants: Variant[]): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    priceCents: Number(row.price_cents),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    images: parseStoredImages(row.images_json),
    createdAt: asIso(row.created_at),
    updatedAt: asIso(row.updated_at),
    variants,
  };
}

async function variantsFor(productIds: string[]): Promise<Map<string, Variant[]>> {
  const grouped = new Map<string, Variant[]>();
  if (productIds.length === 0) return grouped;
  const placeholders = productIds.map((_, i) => `$${i + 1}`).join(", ");
  const rows = await sql<VariantRow>(
    `select id, product_id, color, size, sku, stock, sort_order
     from variants
     where product_id in (${placeholders})
     order by sort_order asc, id asc`,
    productIds,
  );
  for (const row of rows) {
    const list = grouped.get(row.product_id) ?? [];
    list.push(mapVariant(row));
    grouped.set(row.product_id, list);
  }
  return grouped;
}

export async function listPublishedProducts(): Promise<Product[]> {
  const rows = await sql<ProductRow>(
    `select * from products where published = true order by created_at desc`,
  );
  const variants = await variantsFor(rows.map((r) => r.id));
  return rows.map((row) => mapProduct(row, variants.get(row.id) ?? []));
}

export async function listFeaturedProducts(): Promise<Product[]> {
  const rows = await sql<ProductRow>(
    `select * from products
     where published = true and featured = true
     order by created_at desc
     limit 8`,
  );
  const variants = await variantsFor(rows.map((r) => r.id));
  return rows.map((row) => mapProduct(row, variants.get(row.id) ?? []));
}

export async function getPublishedProductBySlug(slug: string): Promise<Product | null> {
  const rows = await sql<ProductRow>(
    `select * from products where slug = $1 and published = true limit 1`,
    [slug],
  );
  const row = rows[0];
  if (!row) return null;
  const variants = await variantsFor([row.id]);
  return mapProduct(row, variants.get(row.id) ?? []);
}

export async function getProductById(id: string): Promise<Product | null> {
  const rows = await sql<ProductRow>(`select * from products where id = $1 limit 1`, [id]);
  const row = rows[0];
  if (!row) return null;
  const variants = await variantsFor([row.id]);
  return mapProduct(row, variants.get(row.id) ?? []);
}

export async function listAllProducts(): Promise<Product[]> {
  const rows = await sql<ProductRow>(`select * from products order by created_at desc`);
  const variants = await variantsFor(rows.map((r) => r.id));
  return rows.map((row) => mapProduct(row, variants.get(row.id) ?? []));
}

export async function slugTaken(slug: string, exceptId?: string): Promise<boolean> {
  if (exceptId) {
    const rows = await sql<{ id: string }>(
      `select id from products where slug = $1 and id <> $2 limit 1`,
      [slug, exceptId],
    );
    return rows.length > 0;
  }
  const rows = await sql<{ id: string }>(
    `select id from products where slug = $1 limit 1`,
    [slug],
  );
  return rows.length > 0;
}

export async function uniqueSlug(base: string, exceptId?: string): Promise<string> {
  let slug = base;
  let n = 2;
  while (await slugTaken(slug, exceptId)) {
    slug = `${base}-${n}`.slice(0, 90);
    n += 1;
    if (n > 50) {
      slug = `${base}-${crypto.randomUUID().slice(0, 8)}`;
      break;
    }
  }
  return slug;
}

export type VariantInput = {
  color: string;
  size: string;
  sku: string;
  stock: string;
};

export async function saveProductRecord(input: {
  id?: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  featured: boolean;
  published: boolean;
  images: string[];
  variants: VariantInput[];
}): Promise<string> {
  const id = input.id ?? crypto.randomUUID();
  const now = new Date().toISOString();
  if (input.id) {
    await sql(
      `update products
       set name = $1, slug = $2, description = $3, price_cents = $4,
           featured = $5, published = $6, images_json = $7, updated_at = $8
       where id = $9`,
      [
        input.name,
        input.slug,
        input.description,
        input.priceCents,
        input.featured,
        input.published,
        JSON.stringify(input.images),
        now,
        id,
      ],
    );
    await sql(`delete from variants where product_id = $1`, [id]);
  } else {
    await sql(
      `insert into products
        (id, name, slug, description, price_cents, featured, published, images_json, created_at, updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9)`,
      [
        id,
        input.name,
        input.slug,
        input.description,
        input.priceCents,
        input.featured,
        input.published,
        JSON.stringify(input.images),
        now,
      ],
    );
  }
  for (const [index, variant] of input.variants.entries()) {
    const color = variant.color.trim() || null;
    const size = variant.size.trim() || null;
    const sku = variant.sku.trim() || null;
    const stockRaw = variant.stock.trim();
    const stock =
      stockRaw === "" ? null : Number.parseInt(stockRaw, 10);
    if (stock != null && (!Number.isFinite(stock) || stock < 0 || stock > 100000)) {
      continue;
    }
    if (!color && !size && !sku && stock == null) continue;
    await sql(
      `insert into variants (id, product_id, color, size, sku, stock, sort_order)
       values ($1,$2,$3,$4,$5,$6,$7)`,
      [crypto.randomUUID(), id, color, size, sku, stock, index],
    );
  }
  return id;
}

export async function deleteProduct(id: string): Promise<void> {
  await sql(`delete from products where id = $1`, [id]);
}

export function variantLabel(variant: Variant): string {
  return formatVariantLabel(variant);
}
