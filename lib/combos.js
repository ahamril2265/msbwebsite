import { db } from "./db";

// Shape a combo (loaded with items.product) for the storefront.
// Returns null if any of its products is hidden, so broken combos never show.
export function publicCombo(c) {
  if (!c.items.length || c.items.some((i) => !i.product.active)) return null;
  const compareAt = +c.items.reduce((s, i) => s + i.product.price * i.qty, 0).toFixed(2);
  return {
    id: c.id,
    name: c.name,
    desc: c.desc,
    img: c.img,
    price: c.price,
    featured: c.featured,
    compareAt,
    savings: Math.max(0, +(compareAt - c.price).toFixed(2)),
    stock: Math.min(...c.items.map((i) => Math.floor(i.product.stock / i.qty))),
    items: c.items.map((i) => ({ productId: i.productId, qty: i.qty, name: i.product.name, sku: i.product.sku, img: i.product.img, price: i.product.price })),
  };
}

export async function loadCombos() {
  const combos = await db.combo.findMany({
    where: { active: true },
    include: { items: { include: { product: true }, orderBy: { id: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return combos.map(publicCombo).filter(Boolean);
}

// Validates combo fields from the admin form.
export async function comboInput(b, creating) {
  const data = {};
  const str = (v) => (v ?? "").toString().trim();
  if (creating || b.name !== undefined) {
    if (!str(b.name)) return { error: "Name is required." };
    data.name = str(b.name);
  }
  if (creating || b.price !== undefined) {
    const price = Number(b.price);
    if (!(price >= 0) || str(b.price) === "") return { error: "Price must be a number ≥ 0." };
    data.price = +price.toFixed(2);
  }
  if (b.desc !== undefined) data.desc = str(b.desc);
  if (b.img !== undefined) data.img = str(b.img);
  if (b.active !== undefined) data.active = !!b.active;
  if (b.featured !== undefined) data.featured = !!b.featured;

  let items;
  if (creating || b.items !== undefined) {
    if (!Array.isArray(b.items)) return { error: "Add products to the combo." };
    const merged = new Map();
    for (const i of b.items) {
      const id = Number(i.productId), qty = Math.floor(Number(i.qty));
      if (!id) continue;
      if (!(qty > 0)) return { error: "Each product needs a quantity of at least 1." };
      merged.set(id, (merged.get(id) || 0) + qty);
    }
    items = [...merged].map(([productId, qty]) => ({ productId, qty }));
    const total = items.reduce((n, i) => n + i.qty, 0);
    if (items.length === 0 || total < 2) return { error: "A combo needs at least 2 items in total." };
    const found = await db.product.count({ where: { id: { in: items.map((i) => i.productId) } } });
    if (found !== items.length) return { error: "One of the chosen products no longer exists." };
  }
  return { data, items };
}
