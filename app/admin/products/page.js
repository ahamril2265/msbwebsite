import { db } from "../../../lib/db";
import { PageHeader } from "../ui";
import ProductsTable from "./ProductsTable";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const [products, categories] = await Promise.all([
    db.product.findMany({ orderBy: [{ categorySlug: "asc" }, { sku: "asc" }] }),
    db.category.findMany({ orderBy: { sort: "asc" } }),
  ]);
  return (
    <>
      <PageHeader title="Products" subtitle={`${products.length} products · ${products.filter((p) => !p.active).length} hidden`}>
        <Link href="/admin/products/new" className="btn-primary px-5 py-2.5 text-sm"><Plus className="h-4 w-4" /> Add product</Link>
      </PageHeader>
      <ProductsTable products={products} categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
    </>
  );
}
