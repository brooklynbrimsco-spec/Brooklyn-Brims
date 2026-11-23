"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import {
  INSTAGRAM_LABEL,
  INSTAGRAM_URL,
  SHOP_EMAIL,
  SHOP_EMAIL_MAILTO,
} from "@/lib/brand";
import { sendToShopInbox } from "@/lib/inbox";
import type { BrowserMailMode } from "@/lib/mail-mode";

export function Footer({
  mailMode = "formsubmit",
  web3formsAccessKey = "",
}: {
  mailMode?: BrowserMailMode;
  web3formsAccessKey?: string;
}) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    if (!email) return;
    const message = "Please add me to Brooklyn Brims updates.";
    try {
      let mailed: string | undefined;
      if (mailMode !== "none") {
        mailed = await sendToShopInbox(
          {
            name: "Updates",
            email,
            message,
            subject: "Brooklyn Brims update list",
          },
          {
            mailMode,
            web3formsAccessKey:
              mailMode === "web3forms" ? web3formsAccessKey : undefined,
          },
        );
      }
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Updates",
          email,
          message,
          mailed,
        }),
      });
      if (!response.ok) {
        throw new Error("Could not send.");
      }
      setSent(true);
    } catch {
      setError("Could not send. Try again, or email us directly.");
    }
  }

  return (
    <footer className="mt-auto bg-[#141414] text-white">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr] lg:px-10">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-sky uppercase">Brooklyn updates</p>
          <h2 className="mt-3 font-[family-name:var(--font-oswald)] text-4xl uppercase">
            Becoming Brooklyn
          </h2>
          <p className="mt-3 max-w-md text-sm text-white/60">
            Be the first to know when new hats land from Brooklyn, Connecticut.
          </p>
          {sent ? (
            <p className="mt-6 text-sm">
              {mailMode === "formsubmit"
                ? `You’re on the list. Check ${SHOP_EMAIL} (and spam) if this is the first note — confirm the inbox, then later mail lands there.`
                : "You’re on the list. We’ll send updates to that address."}
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 flex max-w-sm border-b border-white/30">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/40"
              />
              <button type="submit" className="px-2 text-lg" aria-label="Subscribe">
                →
              </button>
            </form>
          )}
          {error ? <p className="mt-3 text-sm text-white/70">{error}</p> : null}
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm text-white/70">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-sky uppercase">Shop</p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/shop" className="hover:text-white">
                  Hats
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.2em] text-sky uppercase">Studio</p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <a href={SHOP_EMAIL_MAILTO} className="hover:text-white">
                  {SHOP_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  {INSTAGRAM_LABEL}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-10 text-center">
        <Logo size={64} className="mx-auto" />
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.16em] text-white/70 hover:text-white"
        >
          <InstagramIcon />
          {INSTAGRAM_LABEL}
        </a>
        <p className="mt-4 text-[11px] tracking-[0.16em] text-white/40 uppercase">
          © {new Date().getFullYear()} Brooklyn Brims · Est. 2024 · Brooklyn, Connecticut
        </p>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
