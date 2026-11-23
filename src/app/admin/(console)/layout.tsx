import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Logo } from "@/components/Logo";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo size={36} />
            <span className="text-sm font-medium tracking-wide text-navy">
              Brooklyn Brims · Studio
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-navy">
            <Link href="/admin/products" className="hover:underline">
              Products
            </Link>
            <Link href="/admin/orders" className="hover:underline">
              Orders
            </Link>
            <Link href="/admin/messages" className="hover:underline">
              Messages
            </Link>
            <Link href="/" className="text-muted hover:underline">
              Store
            </Link>
            <form action="/api/admin/logout" method="post">
              <button type="submit" className="text-muted hover:underline">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-10">{children}</div>
    </div>
  );
}
