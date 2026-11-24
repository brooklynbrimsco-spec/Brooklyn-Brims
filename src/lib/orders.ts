import "server-only";

import { sql } from "@/lib/db";
import { variantLabel } from "@/lib/catalog";
import { parseShippingJson, stringifyShipping } from "@/lib/shipping";
import type {
  CartLineInput,
  Order,
  OrderItem,
  Product,
  ResolvedLine,
  ShippingAddress,
} from "@/lib/types";

type OrderRow = {
  id: string;
  provider: string;
  stripe_session_id: string | null;
  paypal_order_id: string | null;
  email: string | null;
  status: string;
  total_cents: number | string;
  created_at: string | Date;
  paid_at: string | Date | null;
  shipping_json: string | null;
};

type ItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  variant_id: string | null;
  variant_label: string | null;
  quantity: number | string;
  unit_price_cents: number | string;
};

function asIso(value: string | Date | null): string | null {
  if (value == null) return null;
  return value instanceof Date ? value.toISOString() : String(value);
}

function mapItem(row: ItemRow): OrderItem {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    variantId: row.variant_id,
    variantLabel: row.variant_label,
    quantity: Number(row.quantity),
    unitPriceCents: Number(row.unit_price_cents),
  };
}

function mapOrder(row: OrderRow, items: OrderItem[]): Order {
  const provider = row.provider === "paypal" ? "paypal" : "stripe";
  return {
    id: row.id,
    provider,
    stripeSessionId: row.stripe_session_id,
    paypalOrderId: row.paypal_order_id,
    email: row.email,
    status: row.status,
    totalCents: Number(row.total_cents),
    createdAt: asIso(row.created_at) ?? "",
    paidAt: asIso(row.paid_at),
    shipping: parseShippingJson(
      typeof row.shipping_json === "string" ? row.shipping_json : null,
    ),
    items,
  };
}

export async function resolveCartLines(
  raw: unknown,
  catalog: Map<string, Product>,
): Promise<ResolvedLine[]> {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 20) {
    throw new Error("Cart is empty or too large.");
  }
  const lines: ResolvedLine[] = [];
  for (const entry of raw) {
    const item = entry as CartLineInput;
    const productId = typeof item.productId === "string" ? item.productId : "";
    const quantity = Number(item.quantity);
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw new Error("Invalid cart line.");
    }
    const product = catalog.get(productId);
    if (!product || !product.published) {
      throw new Error("A hat in your cart is no longer available.");
    }
    const variantId =
      typeof item.variantId === "string" && item.variantId
        ? item.variantId
        : null;
    let label: string | null = null;
    if (product.variants.length > 0) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (!variant) {
        throw new Error(`Choose a size or color for ${product.name}.`);
      }
      label = variantLabel(variant);
    }
    lines.push({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      variantId,
      variantLabel: label,
      quantity,
      unitPriceCents: product.priceCents,
      image: product.images[0] ?? null,
    });
  }
  return lines;
}

export function linesTotal(lines: ResolvedLine[]): number {
  return lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
}

export async function createPendingOrder(input: {
  provider: "stripe" | "paypal";
  lines: ResolvedLine[];
  stripeSessionId?: string | null;
  paypalOrderId?: string | null;
}): Promise<string> {
  const id = crypto.randomUUID();
  const total = linesTotal(input.lines);
  await sql(
    `insert into orders
      (id, provider, stripe_session_id, paypal_order_id, status, total_cents)
     values ($1,$2,$3,$4,'pending',$5)`,
    [
      id,
      input.provider,
      input.stripeSessionId ?? null,
      input.paypalOrderId ?? null,
      total,
    ],
  );
  for (const line of input.lines) {
    await sql(
      `insert into order_items
        (id, order_id, product_id, product_name, variant_id, variant_label, quantity, unit_price_cents)
       values ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        crypto.randomUUID(),
        id,
        line.productId,
        line.productName,
        line.variantId,
        line.variantLabel,
        line.quantity,
        line.unitPriceCents,
      ],
    );
  }
  return id;
}

export async function setStripeSession(orderId: string, sessionId: string): Promise<void> {
  await sql(`update orders set stripe_session_id = $1 where id = $2`, [
    sessionId,
    orderId,
  ]);
}

export async function setPaypalOrder(orderId: string, paypalOrderId: string): Promise<void> {
  await sql(`update orders set paypal_order_id = $1 where id = $2`, [
    paypalOrderId,
    orderId,
  ]);
}

export async function markOrderPaid(input: {
  id?: string;
  stripeSessionId?: string;
  paypalOrderId?: string;
  email?: string | null;
  shipping?: ShippingAddress | null;
}): Promise<void> {
  const email = input.email?.trim() || null;
  const shippingJson = input.shipping ? stringifyShipping(input.shipping) : null;
  if (input.stripeSessionId) {
    await sql(
      `update orders
       set status = 'paid',
           paid_at = coalesce(paid_at, now()),
           email = coalesce($1, email),
           shipping_json = coalesce($2, shipping_json)
       where stripe_session_id = $3`,
      [email, shippingJson, input.stripeSessionId],
    );
    return;
  }
  if (input.paypalOrderId) {
    await sql(
      `update orders
       set status = 'paid',
           paid_at = coalesce(paid_at, now()),
           email = coalesce($1, email),
           shipping_json = coalesce($2, shipping_json)
       where paypal_order_id = $3`,
      [email, shippingJson, input.paypalOrderId],
    );
    return;
  }
  if (input.id) {
    await sql(
      `update orders
       set status = 'paid',
           paid_at = coalesce(paid_at, now()),
           email = coalesce($1, email),
           shipping_json = coalesce($2, shipping_json)
       where id = $3`,
      [email, shippingJson, input.id],
    );
  }
}

export async function getOrderByPaypalId(paypalOrderId: string): Promise<Order | null> {
  const rows = await sql<OrderRow>(
    `select * from orders where paypal_order_id = $1 limit 1`,
    [paypalOrderId],
  );
  return hydrateOrder(rows[0]);
}

export async function getOrderByStripeSession(sessionId: string): Promise<Order | null> {
  const rows = await sql<OrderRow>(
    `select * from orders where stripe_session_id = $1 limit 1`,
    [sessionId],
  );
  return hydrateOrder(rows[0]);
}

async function hydrateOrder(row: OrderRow | undefined): Promise<Order | null> {
  if (!row) return null;
  const items = await sql<ItemRow>(
    `select * from order_items where order_id = $1`,
    [row.id],
  );
  return mapOrder(row, items.map(mapItem));
}

export async function listOrders(): Promise<Order[]> {
  const rows = await sql<OrderRow>(`select * from orders order by created_at desc limit 100`);
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const items = await sql<ItemRow>(
    `select * from order_items where order_id in (${placeholders})`,
    ids,
  );
  const grouped = new Map<string, OrderItem[]>();
  for (const item of items) {
    const list = grouped.get(item.order_id) ?? [];
    list.push(mapItem(item));
    grouped.set(item.order_id, list);
  }
  return rows.map((row) => mapOrder(row, grouped.get(row.id) ?? []));
}

export async function listContactMessages() {
  const rows = await sql<{
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: string | Date;
  }>(`select * from contact_messages order by created_at desc limit 100`);
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: asIso(row.created_at) ?? "",
  }));
}

export async function insertContactMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await sql(
    `insert into contact_messages (id, name, email, message) values ($1,$2,$3,$4)`,
    [crypto.randomUUID(), input.name, input.email, input.message],
  );
}
