import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { requireAdmin, jsonError } from "../../../../../lib/auth";
import { productInput } from "../validate";

export async function GET(_req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const product = await db.product.findUnique({ where: { id: Number((await params).id) } });
  return product ? NextResponse.json({ product }) : jsonError("Not found", 404);
}

export async function PATCH(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const id = Number((await params).id);
  const { data, error: msg } = await productInput(await req.json().catch(() => ({})), false);
  if (msg) return jsonError(msg);
  if (data.sku) {
    const clash = await db.product.findUnique({ where: { sku: data.sku } });
    if (clash && clash.id !== id) return jsonError("That SKU already exists.", 409);
  }
  const product = await db.product.update({ where: { id }, data });
  return NextResponse.json({ product });
}

// Products that appear in past orders or in a combo are hidden instead of deleted, so order history stays intact.
export async function DELETE(_req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const id = Number((await params).id);
  const used = (await db.orderItem.count({ where: { productId: id } })) + (await db.comboItem.count({ where: { productId: id } }));
  if (used) {
    await db.product.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ hidden: true });
  }
  await db.product.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
