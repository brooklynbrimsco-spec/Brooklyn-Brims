import { notFound } from "next/navigation";
import { DeleteProductForm, ProductForm } from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/catalog";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-8 font-[family-name:var(--font-newsreader)] text-3xl text-navy">
        Edit {product.name}
      </h1>
      <ProductForm product={product} />
      <DeleteProductForm id={product.id} />
    </div>
  );
}
