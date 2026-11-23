import { SHOP_EMAIL } from "@/lib/brand";
import { isSameOrigin, jsonError } from "@/lib/http";
import { resendKey, sendShopEmail, web3formsKey } from "@/lib/mail";
import { insertContactMessage } from "@/lib/orders";

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 200;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return jsonError("Invalid origin", 403);
  }
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    message?: string;
    company?: string;
    mailed?: string;
  } | null;
  if (!body) return jsonError("Invalid request", 400);
  if (body.company) {
    return Response.json({ ok: true });
  }
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  if (name.length < 1 || name.length > 100) {
    return jsonError("Enter your name.", 400);
  }
  if (!validEmail(email)) {
    return jsonError("Enter a valid email.", 400);
  }
  if (message.length < 2 || message.length > 4000) {
    return jsonError("Enter a message.", 400);
  }

  const mailedByBrowser =
    body.mailed === "formsubmit" ||
    (body.mailed === "web3forms" && Boolean(web3formsKey()));

  if (resendKey()) {
    const mailed = await sendShopEmail({
      subject:
        name === "Updates"
          ? "Brooklyn Brims update list"
          : `Brooklyn Brims note from ${name}`,
      replyTo: email,
      text:
        name === "Updates"
          ? `Add this address to Brooklyn Brims updates.\n\nEmail: ${email}\nInbox: ${SHOP_EMAIL}`
          : `Name: ${name}\nEmail: ${email}\nInbox: ${SHOP_EMAIL}\n\n${message}`,
    });
    if (!mailed.sent) {
      return jsonError("Could not send the note. Try again in a moment.", 502);
    }
  } else if (!mailedByBrowser) {
    return jsonError("Could not send the note. Try again in a moment.", 502);
  }

  await insertContactMessage({ name, email, message });
  return Response.json({ ok: true });
}
