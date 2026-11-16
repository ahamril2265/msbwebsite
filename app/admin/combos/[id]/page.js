import { notFound } from "next/navigation";
import { db } from "../../../../lib/db";
import ComboForm from "../ComboForm";

export const dynamic = "force-dynamic";

export default async function EditCombo({ params }) {
  const [combo, products] = await Promise.all([
    db.combo.findUnique({ where: { id: Number((await params).id) }, include: { items: { orderBy: { id: "asc" } } } }),
    db.product.findMany({ orderBy: [{ categorySlug: "asc" }, { sku: "asc" }] }),
  ]);
  if (!combo) notFound();
  return <ComboForm combo={combo} products={products} />;
}
