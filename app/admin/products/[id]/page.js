import { notFound } from "next/navigation";
import { db } from "../../../../lib/db";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProduct({ params }) {
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id: Number((await params).id) } }),
    db.category.findMany({ orderBy: { sort: "asc" }, select: { slug: true, name: true } }),
  ]);
  if (!product) notFound();
  return <ProductForm product={product} categories={categories} />;
}
