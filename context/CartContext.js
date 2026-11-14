"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useStore } from "./StoreContext";

const CartContext = createContext(null);

// Stores only { id, qty } in the browser; product details and prices always come from the live catalog.
export function CartProvider({ children }) {
  const { getProduct, shippingFor } = useStore();
  const [lines, setLines] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      // Accept the older { product, qty } format too.
      setLines(saved.map((l) => ({ id: l.id ?? l.product?.id, qty: l.qty })).filter((l) => l.id));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("cart", JSON.stringify(lines)); } catch {}
  }, [lines, loaded]);

  const value = useMemo(() => {
    const items = lines
      .map((l) => ({ product: getProduct(l.id), qty: l.qty }))
      .filter((i) => i.product); // drop products that were removed from the store
    const subtotal = +items.reduce((s, i) => s + i.product.price * i.qty, 0).toFixed(2);
    return {
      items,
      loaded,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal,
      shipping: shippingFor(subtotal),
      addToCart: (product, qty = 1) =>
        setLines((prev) =>
          prev.some((l) => l.id === product.id)
            ? prev.map((l) => (l.id === product.id ? { ...l, qty: l.qty + qty } : l))
            : [...prev, { id: product.id, qty }]
        ),
      setQty: (id, qty) =>
        setLines((prev) => (qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)))),
      removeFromCart: (id) => setLines((prev) => prev.filter((l) => l.id !== id)),
      clearCart: () => setLines([]),
    };
  }, [lines, loaded, getProduct, shippingFor]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
