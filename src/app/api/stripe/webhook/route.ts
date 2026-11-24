import { getStripe, shippingFromCheckoutSession } from "@/lib/payments";
import { markOrderPaid } from "@/lib/orders";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!stripe || !webhookSecret) {
    return Response.json({ error: "Stripe webhook is not configured." }, { status: 503 });
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing signature." }, { status: 400 });
  }
  const raw = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, webhookSecret);
  } catch {
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (typeof session.id === "string") {
      await markOrderPaid({
        stripeSessionId: session.id,
        email:
          session.customer_details?.email ??
          (typeof session.customer_email === "string" ? session.customer_email : null),
        shipping: shippingFromCheckoutSession(session),
      });
    }
  }
  return Response.json({ received: true });
}
