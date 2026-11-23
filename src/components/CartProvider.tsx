"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  quantity: number;
  variantId?: string | null;
  variantLabel?: string | null;
  image?: string | null;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number, opts?: { open?: boolean }) => void;
  setQuantity: (productId: string, variantId: string | null | undefined, quantity: number) => void;
  removeItem: (productId: string, variantId: string | null | undefined) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "brooklyn-brims-cart";

function sameLine(a: CartItem, productId: string, variantId?: string | null) {
  return a.productId === productId && (a.variantId ?? null) === (variantId ?? null);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (item) =>
                item &&
                typeof item.productId === "string" &&
                typeof item.quantity === "number" &&
                item.quantity > 0 &&
                item.quantity <= 20,
            ),
          );
        }
      }
    } catch {
      /* ignore bad local data */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1, opts?: { open?: boolean }) => {
      const qty = Math.min(20, Math.max(1, quantity));
      setItems((current) => {
        const index = current.findIndex((line) =>
          sameLine(line, item.productId, item.variantId),
        );
        if (index === -1) {
          if (current.length >= 20) return current;
          return [...current, { ...item, quantity: qty }];
        }
        const next = [...current];
        next[index] = {
          ...next[index],
          ...item,
          quantity: Math.min(20, next[index].quantity + qty),
        };
        return next;
      });
      if (opts?.open !== false) setOpen(true);
    },
    [],
  );

  const setQuantity = useCallback(
    (productId: string, variantId: string | null | undefined, quantity: number) => {
      setItems((current) => {
        if (quantity < 1) {
          return current.filter((line) => !sameLine(line, productId, variantId));
        }
        return current.map((line) =>
          sameLine(line, productId, variantId)
            ? { ...line, quantity: Math.min(20, quantity) }
            : line,
        );
      });
    },
    [],
  );

  const removeItem = useCallback(
    (productId: string, variantId: string | null | undefined) => {
      setItems((current) =>
        current.filter((line) => !sameLine(line, productId, variantId)),
      );
    },
    [],
  );

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.priceCents * item.quantity,
      0,
    );
    return {
      items,
      count,
      subtotal,
      open,
      addItem,
      setQuantity,
      removeItem,
      clear,
      openCart,
      closeCart,
    };
  }, [items, open, addItem, setQuantity, removeItem, clear, openCart, closeCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
