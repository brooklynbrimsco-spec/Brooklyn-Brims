"use client";

import { useState } from "react";
import { SHOP_EMAIL } from "@/lib/brand";
import { sendToShopInbox } from "@/lib/inbox";
import type { BrowserMailMode } from "@/lib/mail-mode";

export function ContactForm({
  mailMode = "formsubmit",
  web3formsAccessKey = "",
}: {
  mailMode?: BrowserMailMode;
  web3formsAccessKey?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("sending");
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const company = String(data.get("company") ?? "");
    try {
      let mailed: string | undefined;
      if (!company && mailMode !== "none") {
        mailed = await sendToShopInbox(
          {
            name,
            email,
            message,
            subject: `Brooklyn Brims note from ${name}`,
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
          name,
          email,
          message,
          company,
          mailed,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Could not send.");
      }
      form.reset();
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send.");
    }
  }

  if (status === "sent") {
    return (
      <p className="border border-line bg-paper px-6 py-8 text-navy">
        {mailMode === "formsubmit" ? (
          <>
            Thanks. Check <span className="font-medium">{SHOP_EMAIL}</span> (and
            spam). The first send only confirms the inbox — click that link, then
            later notes land there.
          </>
        ) : (
          <>
            Thanks. Your note was sent to{" "}
            <span className="font-medium">{SHOP_EMAIL}</span>.
          </>
        )}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm">
        Name
        <input
          required
          name="name"
          maxLength={100}
          className="mt-1 w-full border border-line bg-paper px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        Email
        <input
          required
          type="email"
          name="email"
          maxLength={200}
          className="mt-1 w-full border border-line bg-paper px-3 py-2"
        />
      </label>
      <label className="hidden">
        Company
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="block text-sm">
        Message
        <textarea
          required
          name="message"
          maxLength={4000}
          rows={6}
          className="mt-1 w-full border border-line bg-paper px-3 py-2"
        />
      </label>
      {error ? <p className="text-sm text-star">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-ink px-6 py-3 text-[11px] tracking-[0.2em] text-white uppercase hover:bg-navy disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
