// Product recommendations from the live catalog.

export function recommendByCategory(products, productId, limit = 4) {
  const current = products.find((p) => p.id === productId);
  if (!current) return [];
  return products.filter((p) => p.category === current.category && p.id !== productId).slice(0, limit);
}

// Based on the last category the shopper viewed (stored in localStorage).
export function recommendForUser(products, limit = 4) {
  if (typeof window === "undefined") return [];
  const lastCat = localStorage.getItem("lastCategory");
  if (!lastCat) return products.slice(0, limit);
  return products.filter((p) => p.category === lastCat).slice(0, limit);
}
