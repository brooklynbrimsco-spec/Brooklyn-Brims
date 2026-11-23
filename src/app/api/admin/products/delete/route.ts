import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { deleteProduct, getProductById } from "@/lib/catalog";
import { isSameOrigin, jsonError, requestOrigin } from "@/lib/http";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError("Invalid origin", 403);
  const origin = requestOrigin(request);
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL("/admin/login", origin));
  }
  const form = await request.formData();
  const id = String(form.get("id") ?? "").trim();
  if (!id || id.length > 80) {
    return NextResponse.redirect(new URL("/admin/products?error=missing", origin));
  }
  const existing = await getProductById(id);
  if (existing) {
    await deleteProduct(id);
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/shop/${existing.slug}`);
    revalidatePath("/admin");
    revalidatePath("/admin/products");
  }
  return NextResponse.redirect(new URL("/admin/products", origin), 303);
}
