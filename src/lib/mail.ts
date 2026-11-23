import "server-only";
import { SHOP_EMAIL } from "@/lib/brand";
import type { BrowserMailMode } from "@/lib/mail-mode";

export type { BrowserMailMode };

export type ShopMail = {
  subject: string;
  text: string;
  replyTo?: string;
};

export type MailResult =
  | { sent: true; provider: string }
  | { sent: false; reason: string };

export function resendKey() {
  return process.env.RESEND_API_KEY?.trim() || "";
}

export function web3formsKey() {
  if (resendKey()) return "";
  return process.env.WEB3FORMS_ACCESS_KEY?.trim() || "";
}

/** Resend if RESEND_API_KEY is set; else Web3Forms when that key is set; else FormSubmit. */
export function browserMailMode(): BrowserMailMode {
  if (resendKey()) return "none";
  if (web3formsKey()) return "web3forms";
  return "formsubmit";
}

function resendFrom() {
  return (
    process.env.RESEND_FROM?.trim() ||
    "Brooklyn Brims <beth.t@example.com>"
  );
}

export async function sendShopEmail(mail: ShopMail): Promise<MailResult> {
  if (!resendKey()) {
    return { sent: false, reason: "not_configured" };
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFrom(),
      to: [SHOP_EMAIL],
      reply_to: mail.replyTo || SHOP_EMAIL,
      subject: mail.subject,
      text: mail.text,
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return {
      sent: false,
      reason: detail.slice(0, 200) || `Resend ${response.status}`,
    };
  }
  return { sent: true, provider: "resend" };
}
