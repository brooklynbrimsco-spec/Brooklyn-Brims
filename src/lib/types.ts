export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  featured: boolean;
  published: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
  variants: Variant[];
};

export type Variant = {
  id: string;
  productId: string;
  color: string | null;
  size: string | null;
  sku: string | null;
  stock: number | null;
  sortOrder: number;
};

export type CartLineInput = {
  productId: string;
  variantId?: string | null;
  quantity: number;
};

export type ResolvedLine = {
  productId: string;
  productName: string;
  slug: string;
  variantId: string | null;
  variantLabel: string | null;
  quantity: number;
  unitPriceCents: number;
  image: string | null;
};

export type ShippingAddress = {
  name: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
};

export type Order = {
  id: string;
  provider: "stripe" | "paypal";
  stripeSessionId: string | null;
  paypalOrderId: string | null;
  email: string | null;
  status: string;
  totalCents: number;
  createdAt: string;
  paidAt: string | null;
  shipping: ShippingAddress | null;
  termsVersion: string | null;
  termsAcceptedAt: string | null;
  items: OrderItem[];
};

export type OrderItem = {
  id: string;
  productId: string | null;
  productName: string;
  variantId: string | null;
  variantLabel: string | null;
  quantity: number;
  unitPriceCents: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type PaymentProviders = {
  stripe: boolean;
  paypal: boolean;
};
