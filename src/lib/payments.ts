import "server-only";

import { connection } from "next/server";
import Stripe from "stripe";
import type { PaymentProviders } from "@/lib/types";

export async function paymentProviders(): Promise<PaymentProviders> {
  await connection();
  return {
    stripe: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
    paypal: Boolean(
      process.env.PAYPAL_CLIENT_ID?.trim() &&
        process.env.PAYPAL_CLIENT_SECRET?.trim(),
    ),
  };
}

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key);
}

function paypalBase(): string {
  const live = process.env.PAYPAL_LIVE?.trim() === "true";
  return live
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

type TokenCache = { token: string; expiresAt: number };
let paypalToken: TokenCache | undefined;

export async function paypalAccessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID?.trim();
  const secret = process.env.PAYPAL_CLIENT_SECRET?.trim();
  if (!id || !secret) {
    throw new Error("PayPal is not configured");
  }
  const now = Date.now();
  if (paypalToken && paypalToken.expiresAt > now + 10_000) {
    return paypalToken.token;
  }
  const response = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) {
    paypalToken = undefined;
    throw new Error("PayPal auth failed");
  }
  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!data.access_token) {
    throw new Error("PayPal auth failed");
  }
  paypalToken = {
    token: data.access_token,
    expiresAt: now + Math.max(30, Number(data.expires_in) || 300) * 1000,
  };
  return paypalToken.token;
}

export async function paypalRequest(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = await paypalAccessToken();
  return fetch(`${paypalBase()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}

export type PayPalOrderResponse = {
  id?: string;
  status?: string;
  links?: { rel?: string; href?: string }[];
  purchase_units?: {
    amount?: { value?: string; currency_code?: string };
    custom_id?: string;
  }[];
  payer?: { email_address?: string };
};
