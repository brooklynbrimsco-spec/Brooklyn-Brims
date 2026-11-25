import { TERMS_ACCEPTANCE_ERROR, TERMS_VERSION } from "@/content/terms";
import { listPublishedProducts } from "@/lib/catalog";
import { isSameOrigin, jsonError, requestOrigin } from "@/lib/http";
import { paypalAmount } from "@/lib/money";
import {
  createPendingOrder,
  linesTotal,
  resolveCartLines,
  setPaypalOrder,
  setStripeSession,
} from "@/lib/orders";
import {
  getStripe,
  paymentProviders,
  paypalRequest,
  type PayPalOrderResponse,
} from "@/lib/payments";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return jsonError("Invalid origin", 403);
  }
  const body = (await request.json().catch(() => null)) as {
    provider?: string;
    items?: unknown;
    termsAccepted?: unknown;
  } | null;
  if (!body) return jsonError("Invalid request", 400);
  if (body.termsAccepted !== true) {
    return jsonError(TERMS_ACCEPTANCE_ERROR, 400);
  }
  const termsAcceptedAt = new Date();
  const provider = body.provider === "paypal" ? "paypal" : body.provider === "stripe" ? "stripe" : null;
  if (!provider) return jsonError("Choose Stripe or PayPal.", 400);

  const available = await paymentProviders();
  if (provider === "stripe" && !available.stripe) {
    return jsonError("Stripe is not configured.", 503);
  }
  if (provider === "paypal" && !available.paypal) {
    return jsonError("PayPal is not configured.", 503);
  }

  const products = await listPublishedProducts();
  const catalog = new Map(products.map((p) => [p.id, p]));
  let lines;
  try {
    lines = await resolveCartLines(body.items, catalog);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Invalid cart.", 400);
  }
  const total = linesTotal(lines);
  if (total <= 0) {
    return jsonError("Cart total must be greater than zero.", 400);
  }

  const origin = requestOrigin(request);
  const orderId = await createPendingOrder({
    provider,
    lines,
    termsVersion: TERMS_VERSION,
    termsAcceptedAt,
  });

  if (provider === "stripe") {
    const stripe = getStripe();
    if (!stripe) return jsonError("Stripe is not configured.", 503);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        orderId,
        termsVersion: TERMS_VERSION,
        termsAcceptedAt: termsAcceptedAt.toISOString(),
        termsAccepted: "true",
      },
      shipping_address_collection: { allowed_countries: ["US"] },
      phone_number_collection: { enabled: true },
      line_items: lines.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: "usd",
          unit_amount: line.unitPriceCents,
          product_data: {
            name: line.variantLabel
              ? `${line.productName} (${line.variantLabel})`
              : line.productName,
          },
        },
      })),
    });
    if (!session.url || !session.id) {
      return jsonError("Stripe did not return a checkout URL.", 502);
    }
    await setStripeSession(orderId, session.id);
    return Response.json({ url: session.url });
  }

  const paypal = await paypalRequest("/v2/checkout/orders", {
    method: "POST",
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: orderId,
          invoice_id: orderId,
          amount: {
            currency_code: "USD",
            value: paypalAmount(total),
          },
        },
      ],
      application_context: {
        brand_name: "Brooklyn Brims",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
        return_url: `${origin}/api/paypal/return`,
        cancel_url: `${origin}/checkout/cancel`,
      },
    }),
  });
  const payload = (await paypal.json().catch(() => null)) as PayPalOrderResponse | null;
  if (!paypal.ok || !payload?.id) {
    return jsonError("PayPal could not start checkout.", 502);
  }
  const approve = payload.links?.find((link) => link.rel === "approve")?.href;
  if (!approve || !approve.startsWith("https://")) {
    return jsonError("PayPal did not return an approval URL.", 502);
  }
  await setPaypalOrder(orderId, payload.id);
  return Response.json({ url: approve });
}
