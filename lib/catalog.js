import { db, getSettings } from "./db";
import { loadCombos } from "./combos";

// Plain, serialisable catalog for the storefront.
export async function loadCatalog() {
  const [cats, prods, settings, sales, comboSales, combos] = await Promise.all([
    db.category.findMany({ orderBy: { sort: "asc" } }),
    db.product.findMany({ where: { active: true }, orderBy: { sku: "asc" } }),
    getSettings(),
    db.orderItem.groupBy({ by: ["productId"], _sum: { qty: true }, where: { productId: { not: null }, order: { status: { not: "cancelled" } } } }),
    db.orderItem.findMany({ where: { comboId: { not: null }, order: { status: { not: "cancelled" } } }, select: { qty: true, parts: true } }),
    loadCombos(),
  ]);
  const sold = new Map(sales.map((s) => [s.productId, s._sum.qty || 0]));
  for (const line of comboSales) {
    for (const part of JSON.parse(line.parts || "[]")) sold.set(part.productId, (sold.get(part.productId) || 0) + part.qty * line.qty);
  }

  const products = prods.map((p) => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    size: p.size,
    desc: p.desc,
    price: p.price,
    stock: p.stock,
    img: p.img,
    featured: p.featured,
    sold: sold.get(p.id) || 0,
    category: p.categorySlug,
    categoryName: cats.find((c) => c.slug === p.categorySlug)?.name || "",
  }));

  const categories = cats.map((c) => ({
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    desc: c.desc,
    image: c.image,
    count: products.filter((p) => p.category === c.slug).length,
  }));

  return { products, categories, settings, combos };
}
