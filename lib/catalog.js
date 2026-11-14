import { db, getSettings } from "./db";

// Plain, serialisable catalog for the storefront.
export async function loadCatalog() {
  const [cats, prods, settings, sales] = await Promise.all([
    db.category.findMany({ orderBy: { sort: "asc" } }),
    db.product.findMany({ where: { active: true }, orderBy: { sku: "asc" } }),
    getSettings(),
    db.orderItem.groupBy({ by: ["productId"], _sum: { qty: true }, where: { order: { status: { not: "cancelled" } } } }),
  ]);
  const sold = new Map(sales.map((s) => [s.productId, s._sum.qty || 0]));

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

  return { products, categories, settings };
}
