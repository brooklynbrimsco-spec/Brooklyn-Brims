"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useCart } from "@/components/CartProvider";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const home = pathname === "/";
  const overlay = home && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  const light = overlay;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-auto bg-[#efe8db] py-2 text-center text-[11px] tracking-[0.14em] text-ink uppercase">
        Free US shipping on orders $85+
      </div>
      <header
        className={`pointer-events-auto transition-colors duration-300 ${
          overlay
            ? "bg-gradient-to-b from-black/55 to-transparent"
            : "border-b border-black/5 bg-white/95 shadow-sm backdrop-blur-md"
        }`}
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-3 items-center px-4 py-3 sm:px-8">
          <button
            type="button"
            className={`justify-self-start sm:hidden ${light ? "text-white" : "text-ink"}`}
            aria-label="Menu"
            onClick={() => setMenu((v) => !v)}
          >
            <MenuIcon />
          </button>
          <div className="hidden sm:block" />

          <Link href="/" className="justify-self-center">
            <span className="flex flex-col items-center">
              <Logo
                size={56}
                priority
                className={light ? "ring-2 ring-white/80" : ""}
              />
            </span>
          </Link>

          <button
            type="button"
            onClick={openCart}
            className={`justify-self-end ${light ? "text-white drop-shadow" : "text-ink"}`}
            aria-label={count ? `Cart, ${count} items` : "Cart"}
          >
            <span className="relative inline-block">
              <BagIcon />
              {count > 0 ? (
                <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-white">
                  {count}
                </span>
              ) : null}
            </span>
          </button>
        </div>
        <nav
          className={`relative z-10 hidden justify-center gap-12 pt-1 pb-4 text-[11px] tracking-[0.28em] uppercase sm:flex ${
            light ? "text-white drop-shadow" : "text-ink"
          }`}
        >
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "underline decoration-current/50" : "hover:underline"}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        {menu ? (
          <nav className="flex flex-col gap-3 border-t border-black/10 bg-white px-4 py-4 text-sm uppercase tracking-[0.18em] text-ink sm:hidden">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>
    </div>
  );
}

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
