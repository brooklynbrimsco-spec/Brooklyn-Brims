import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { getProductById, saveProductRecord, uniqueSlug, type VariantInput } from "@/lib/catalog";
import { isSameOrigin, jsonError, requestOrigin } from "@/lib/http";
import { dollarsToCents } from "@/lib/money";
import { slugify } from "@/lib/slug";
import { parseImageUrls } from "@/lib/urls";

function all(form: FormData, name: string): string[] {
  return form.getAll(name).map((value) => String(value));
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError("Invalid origin", 403);
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL("/admin/login", requestOrigin(request)));
  }
  const origin = requestOrigin(request);
  const form = await request.formData();
  const idRaw = String(form.get("id") ?? "").trim();
  const name = String(form.get("name") ?? "").trim();
  if (name.length < 1 || name.length > 120) {
    return NextResponse.redirect(new URL("/admin/products/new?error=name", origin));
  }
  const description = String(form.get("description") ?? "").slice(0, 8000);
  const priceCents = dollarsToCents(String(form.get("price") ?? ""));
  if (priceCents == null) {
    const fallback = idRaw
      ? `/admin/products/${idRaw}?error=price`
      : "/admin/products/new?error=price";
    return NextResponse.redirect(new URL(fallback, origin));
  }
  const published = form.get("published") === "on";
  const featured = form.get("featured") === "on";
  const images = parseImageUrls(String(form.get("images") ?? ""));
  const colors = all(form, "variant_color");
  const sizes = all(form, "variant_size");
  const skus = all(form, "variant_sku");
  const stocks = all(form, "variant_stock");
  const variants: VariantInput[] = [];
  const count = Math.max(colors.length, sizes.length, skus.length, stocks.length);
  for (let i = 0; i < Math.min(count, 24); i += 1) {
    variants.push({
      color: (colors[i] ?? "").slice(0, 40),
      size: (sizes[i] ?? "").slice(0, 40),
      sku: (skus[i] ?? "").slice(0, 40),
      stock: (stocks[i] ?? "").slice(0, 8),
    });
  }

  const existing = idRaw ? await getProductById(idRaw) : null;
  if (idRaw && !existing) {
    return NextResponse.redirect(new URL("/admin/products?error=missing", origin));
  }
  const slugInput = String(form.get("slug") ?? "").trim();
  const slug = await uniqueSlug(slugify(slugInput || name), existing?.id);
  const id = await saveProductRecord({
    id: existing?.id,
    name,
    slug,
    description,
    priceCents,
    featured,
    published,
    images,
    variants,
  });
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  return NextResponse.redirect(new URL("/admin/products", origin), 303);
}
