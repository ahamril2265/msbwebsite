import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { requireAdmin, jsonError } from "../../../../../lib/auth";
import { comboInput } from "../../../../../lib/combos";

export async function PATCH(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const id = Number((await params).id);
  if (!(await db.combo.findUnique({ where: { id } }))) return jsonError("Not found", 404);
  const { data, items, error: msg } = await comboInput(await req.json().catch(() => ({})), false);
  if (msg) return jsonError(msg);
  const combo = await db.$transaction(async (tx) => {
    if (items) {
      await tx.comboItem.deleteMany({ where: { comboId: id } });
      await tx.comboItem.createMany({ data: items.map((i) => ({ ...i, comboId: id })) });
    }
    return tx.combo.update({ where: { id }, data, include: { items: true } });
  });
  return NextResponse.json({ combo });
}

// Combos that appear in past orders are hidden instead of deleted.
export async function DELETE(_req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const id = Number((await params).id);
  if (await db.orderItem.count({ where: { comboId: id } })) {
    await db.combo.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ hidden: true });
  }
  await db.combo.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
