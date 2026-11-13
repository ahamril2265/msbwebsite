"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ product, qty }]
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("cart", JSON.stringify(items)); } catch {}
  }, [items, loaded]);

  const addToCart = (product, qty = 1) =>
    setItems((prev) => {
      const hit = prev.find((i) => i.product.id === product.id);
      if (hit) return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { product, qty }];
    });

  const setQty = (id, qty) =>
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.product.id !== id) : prev.map((i) => (i.product.id === id ? { ...i, qty } : i))));

  const removeFromCart = (id) => setItems((prev) => prev.filter((i) => i.product.id !== id));
  const clearCart = () => setItems([]);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, loaded, count, subtotal, addToCart, setQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

// Simple shipping rule shared by cart and checkout.
export const FREE_SHIPPING_OVER = 100;
export const shippingFor = (subtotal) => (subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : 8);
