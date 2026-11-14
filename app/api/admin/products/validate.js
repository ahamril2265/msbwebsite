import { db } from "../../../../lib/db";

// Validates and normalises product fields from the admin form.
export async function productInput(b, creating) {
  const data = {};
  const str = (v) => (v ?? "").toString().trim();

  if (creating || b.sku !== undefined) {
    if (!/^[A-Za-z0-9_-]{2,32}$/.test(str(b.sku))) return { error: "SKU must be 2–32 letters, numbers, - or _." };
    data.sku = str(b.sku).toUpperCase();
  }
  if (creating || b.name !== undefined) {
    if (!str(b.name)) return { error: "Name is required." };
    data.name = str(b.name);
  }
  if (creating || b.price !== undefined) {
    const price = Number(b.price);
    if (!(price >= 0)) return { error: "Price must be a number ≥ 0." };
    data.price = +price.toFixed(2);
  }
  if (b.stock !== undefined) {
    const stock = Math.floor(Number(b.stock));
    if (!(stock >= 0)) return { error: "Stock must be a whole number ≥ 0." };
    data.stock = stock;
  }
  if (creating || b.categorySlug !== undefined) {
    if (!(await db.category.findUnique({ where: { slug: str(b.categorySlug) } }))) return { error: "Choose a category." };
    data.categorySlug = str(b.categorySlug);
  }
  if (creating || b.img !== undefined) {
    if (!str(b.img)) return { error: "Add a product image." };
    data.img = str(b.img);
  }
  if (b.size !== undefined) data.size = str(b.size) || null;
  if (b.desc !== undefined) data.desc = str(b.desc);
  if (b.featured !== undefined) data.featured = !!b.featured;
  if (b.active !== undefined) data.active = !!b.active;
  return { data };
}
