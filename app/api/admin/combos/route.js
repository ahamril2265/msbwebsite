import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { requireAdmin, jsonError } from "../../../../lib/auth";
import { comboInput } from "../../../../lib/combos";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const combos = await db.combo.findMany({ include: { items: { include: { product: true } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ combos });
}

export async function POST(req) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { data, items, error: msg } = await comboInput(await req.json().catch(() => ({})), true);
  if (msg) return jsonError(msg);
  const combo = await db.combo.create({ data: { ...data, items: { create: items } }, include: { items: true } });
  return NextResponse.json({ combo }, { status: 201 });
}
