"use client";

import { usePathname } from "next/navigation";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { BrowserMailMode } from "@/lib/mail-mode";
import type { PaymentProviders } from "@/lib/types";

export function StoreChrome({
  children,
  providers,
  mailMode = "formsubmit",
  web3formsAccessKey = "",
}: {
  children: React.ReactNode;
  providers: PaymentProviders;
  mailMode?: BrowserMailMode;
  web3formsAccessKey?: string;
}) {
  const pathname = usePathname();
  const home = pathname === "/";

  return (
    <>
      <Header />
      <CartDrawer providers={providers} />
      <main className={`flex-1 ${home ? "" : "pt-[11rem]"}`}>{children}</main>
      <Footer mailMode={mailMode} web3formsAccessKey={web3formsAccessKey} />
    </>
  );
}
