import type { Metadata } from "next";
import { Inter, Newsreader, Oswald } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Brooklyn Brims",
    template: "%s · Brooklyn Brims",
  },
  description:verification: {
  google: "XcifcQcBTRHcHS9JZfufsBVxvEv5Zr7soxzhMeajBVE",
},
    "Hats from Brooklyn, Connecticut. Est. 2024. Shop the catalog, then check out with Stripe or PayPal.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${oswald.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
