import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "New product" };

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-8 font-[family-name:var(--font-newsreader)] text-3xl text-navy">
        New product
      </h1>
      <ProductForm />
    </div>
  );
}
