"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const StoreContext = createContext(null);

// Catalog, store settings and the signed-in user, loaded on the server in app/layout.js.
export function StoreProvider({ products, categories, settings, user: initialUser, children }) {
  const [user, setUser] = useState(initialUser);

  const refreshUser = useCallback(async () => {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    const { user } = await res.json();
    setUser(user);
    return user;
  }, []);

  const value = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    return {
      products,
      categories,
      settings,
      user,
      setUser,
      refreshUser,
      getProduct: (id) => byId.get(Number(id)),
      getCategory: (slug) => categories.find((c) => c.slug === slug),
      shippingFor: (subtotal) => (subtotal === 0 || subtotal >= settings.freeShippingOver ? 0 : settings.shippingFee),
    };
  }, [products, categories, settings, user, refreshUser]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
