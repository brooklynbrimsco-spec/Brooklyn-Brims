import { SHOP_EMAIL } from "@/lib/brand";
import type { BrowserMailMode } from "@/lib/mail-mode";

export type InboxPayload = {
  name: string;
  email: string;
  message: string;
  subject: string;
};

export async function sendToShopInbox(
  payload: InboxPayload,
  opts?: { web3formsAccessKey?: string; mailMode?: BrowserMailMode },
) {
  const mode = opts?.mailMode;
  const web3formsAccessKey = opts?.web3formsAccessKey?.trim() || "";
  if (mode === "web3forms" || web3formsAccessKey) {
    if (!web3formsAccessKey) {
      throw new Error("Could not send.");
    }
    await submitWeb3Forms(web3formsAccessKey, payload);
    return "web3forms" as const;
  }
  await submitFormSubmit(payload);
  return "formsubmit" as const;
}

async function submitFormSubmit(payload: InboxPayload) {
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(SHOP_EMAIL)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        message: payload.message,
        _subject: payload.subject,
        _template: "table",
        _captcha: "false",
        _honey: "",
      }),
    },
  );
  const data = (await response.json().catch(() => null)) as {
    success?: string | boolean;
    message?: string;
  } | null;
  if (!response.ok) {
    throw new Error(data?.message || "Could not send.");
  }
}

async function submitWeb3Forms(accessKey: string, payload: InboxPayload) {
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: payload.subject,
      from_name: payload.name,
      name: payload.name,
      email: payload.email,
      message: payload.message,
      to: SHOP_EMAIL,
      botcheck: false,
    }),
  });
  const data = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
  } | null;
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Could not send.");
  }
}
