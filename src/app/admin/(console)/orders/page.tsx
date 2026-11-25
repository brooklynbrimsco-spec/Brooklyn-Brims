import { listOrders } from "@/lib/orders";
import { formatUsd } from "@/lib/money";
import { formatShippingAddress } from "@/lib/shipping";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-newsreader)] text-3xl text-navy">
        Orders
      </h1>
      {orders.length === 0 ? (
        <p className="mt-10 border border-dashed border-line bg-paper px-6 py-12 text-center text-muted">
          No orders yet. Stripe and PayPal checkouts will show up here after
          payment.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border border-line bg-paper p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-navy">
                  {order.provider === "paypal" ? "PayPal" : "Stripe"} · {order.status}
                </p>
                <p className="text-sm">{formatUsd(order.totalCents)}</p>
              </div>
              <p className="mt-1 text-xs text-muted">
                {order.email || "No email yet"} ·{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <ul className="mt-3 text-sm text-muted">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.productName}
                    {item.variantLabel ? ` (${item.variantLabel})` : ""} × {item.quantity}
                  </li>
                ))}
              </ul>
              {order.shipping ? (
                <p className="mt-3 whitespace-pre-line text-sm text-navy">
                  {formatShippingAddress(order.shipping)}
                </p>
              ) : (
                <p className="mt-3 text-xs text-muted">No shipping address yet</p>
              )}
              {order.termsVersion && order.termsAcceptedAt ? (
                <p className="mt-3 text-xs text-muted">
                  Terms accepted · {order.termsVersion} ·{" "}
                  {new Date(order.termsAcceptedAt).toISOString()}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
