"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useStore } from "./StoreContext";

const CartContext = createContext(null);

// Lines are { id, qty } for a product or { comboId, qty } for a combo offer.
// Only ids and quantities are kept in the browser; names and prices always come from the live catalog.
const keyOf = (l) => (l.comboId ? `c${l.comboId}` : `p${l.id}`);

export function CartProvider({ children }) {
  const { getProduct, getCombo, shippingFor } = useStore();
  const [lines, setLines] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      // Accept the older { product, qty } format too.
      setLines(
        saved
          .map((l) => (l.comboId ? { comboId: l.comboId, qty: l.qty } : { id: l.id ?? l.product?.id, qty: l.qty }))
          .filter((l) => l.id || l.comboId)
      );
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("cart", JSON.stringify(lines)); } catch {}
  }, [lines, loaded]);

  const value = useMemo(() => {
    // One display shape for both kinds of line; lines whose product/combo was removed are dropped.
    const items = lines
      .map((l) => {
        if (l.comboId) {
          const c = getCombo(l.comboId);
          return c && {
            key: keyOf(l), combo: c, qty: l.qty, name: c.name, price: c.price, max: c.stock,
            img: c.img || c.items[0].img, href: "/combos", label: "Combo offer",
            sub: c.items.map((i) => `${i.qty} × ${i.name}`).join(" · "),
          };
        }
        const p = getProduct(l.id);
        return p && {
          key: keyOf(l), product: p, qty: l.qty, name: p.name, price: p.price, max: p.stock,
          img: p.img, href: `/product/${p.id}`, label: p.categoryName, sub: `SKU ${p.sku}`,
        };
      })
      .filter(Boolean);
    const subtotal = +items.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);
    const add = (line, qty) =>
      setLines((prev) =>
        prev.some((l) => keyOf(l) === keyOf(line))
          ? prev.map((l) => (keyOf(l) === keyOf(line) ? { ...l, qty: l.qty + qty } : l))
          : [...prev, { ...line, qty }]
      );
    return {
      items,
      loaded,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal,
      shipping: shippingFor(subtotal),
      // What the order API expects.
      orderLines: items.map((i) => (i.combo ? { comboId: i.combo.id, qty: i.qty } : { id: i.product.id, qty: i.qty })),
      addToCart: (product, qty = 1) => add({ id: product.id }, qty),
      addComboToCart: (combo, qty = 1) => add({ comboId: combo.id }, qty),
      setQty: (key, qty) =>
        setLines((prev) => (qty <= 0 ? prev.filter((l) => keyOf(l) !== key) : prev.map((l) => (keyOf(l) === key ? { ...l, qty } : l)))),
      removeFromCart: (key) => setLines((prev) => prev.filter((l) => keyOf(l) !== key)),
      clearCart: () => setLines([]),
    };
  }, [lines, loaded, getProduct, getCombo, shippingFor]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
