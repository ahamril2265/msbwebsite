import { db } from "../../../../lib/db";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProduct() {
  const categories = await db.category.findMany({ orderBy: { sort: "asc" }, select: { slug: true, name: true } });
  return <ProductForm categories={categories} />;
}
