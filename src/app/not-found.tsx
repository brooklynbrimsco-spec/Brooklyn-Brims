import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 pt-32 text-center">
      <h1 className="font-[family-name:var(--font-oswald)] text-4xl uppercase">
        Not on the rack
      </h1>
      <p className="mt-3 text-muted">That page isn’t here. Try the shop.</p>
      <Link href="/shop" className="mt-6 text-[11px] tracking-[0.2em] uppercase underline">
        Shop
      </Link>
    </div>
  );
}
