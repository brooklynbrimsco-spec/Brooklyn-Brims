import { NextResponse } from "next/server";
import { requestOrigin } from "@/lib/http";
import { paypalAmount } from "@/lib/money";
import { getOrderByPaypalId, markOrderPaid } from "@/lib/orders";
import { paymentProviders, paypalRequest, type PayPalOrderResponse } from "@/lib/payments";

export async function GET(request: Request) {
  const origin = requestOrigin(request);
  const fail = NextResponse.redirect(new URL("/checkout/cancel", origin));
  if (!(await paymentProviders()).paypal) return fail;

  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  if (!token || token.length > 64 || !/^[A-Z0-9-]+$/i.test(token)) {
    return fail;
  }

  const order = await getOrderByPaypalId(token);
  if (!order) return fail;

  if (order.status !== "paid") {
    const capture = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(token)}/capture`, {
      method: "POST",
    });
    const payload = (await capture.json().catch(() => null)) as PayPalOrderResponse | null;
    if (!capture.ok && payload?.status !== "COMPLETED") {
      const lookup = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(token)}`);
      const existing = (await lookup.json().catch(() => null)) as PayPalOrderResponse | null;
      if (existing?.status !== "COMPLETED") return fail;
      await markOrderPaid({
        paypalOrderId: token,
        email: existing.payer?.email_address ?? null,
      });
    } else {
      const amount = payload?.purchase_units?.[0]?.amount?.value;
      if (amount && amount !== paypalAmount(order.totalCents)) {
        return fail;
      }
      await markOrderPaid({
        paypalOrderId: token,
        email: payload?.payer?.email_address ?? null,
      });
    }
  }

  return NextResponse.redirect(new URL("/checkout/success", origin));
}
