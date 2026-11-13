// lib/recommend.js
import { products } from "./product";

// Recommend products from the same category
export function recommendByCategory(productId, limit = 4) {
  const current = products.find((p) => p.id === productId);
  if (!current) return [];
  return products
    .filter((p) => p.category === current.category && p.id !== productId)
    .slice(0, limit);
}

// Recommend based on "last viewed category" (stored in localStorage)
export function recommendForUser(limit = 4) {
  if (typeof window === "undefined") return []; // SSR safety
  const lastCat = localStorage.getItem("lastCategory");
  if (!lastCat) return products.slice(0, limit);
  return products.filter((p) => p.category === lastCat).slice(0, limit);
}
