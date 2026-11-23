import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getAdminSecret, isAdmin, isLocalAdminFallback } from "@/lib/auth";

export const metadata = {
  title: "Admin",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const secret = getAdminSecret();
  const { error } = await searchParams;
  const local = isLocalAdminFallback();

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <Logo size={80} className="mb-6" />
      <h1 className="font-[family-name:var(--font-newsreader)] text-3xl text-navy">
        Studio
      </h1>
      <p className="mt-2 text-sm text-muted">Sign in to add hats and view orders.</p>
      {!secret ? (
        <p className="mt-6 border border-line bg-paper px-4 py-3 text-sm text-muted">
          Admin is closed until ADMIN_SECRET is set in Cursor app secrets.
        </p>
      ) : (
        <form action="/api/admin/login" method="post" className="mt-8 space-y-4">
          <label className="block text-sm">
            Password
            <input
              type="password"
              name="password"
              required
              maxLength={200}
              autoComplete="current-password"
              className="mt-1 w-full border border-line bg-paper px-3 py-2"
            />
          </label>
          {local ? (
            <p className="text-xs text-muted">
              Local preview password: <code className="text-navy">local-dev</code>
              . Set ADMIN_SECRET before this shop is public.
            </p>
          ) : null}
          {error ? (
            <p className="text-sm text-star">That password did not match.</p>
          ) : null}
          <button
            type="submit"
            className="w-full bg-navy px-4 py-3 text-sm tracking-wide text-paper uppercase"
          >
            Sign in
          </button>
        </form>
      )}
    </div>
  );
}
