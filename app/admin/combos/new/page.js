import { db } from "../../../../lib/db";
import ComboForm from "../ComboForm";

export const dynamic = "force-dynamic";

export default async function NewCombo() {
  const products = await db.product.findMany({ orderBy: [{ categorySlug: "asc" }, { sku: "asc" }] });
  return <ComboForm products={products} />;
}
