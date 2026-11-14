import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { requireAdmin, jsonError } from "../../../../lib/auth";
import { productInput } from "./validate";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const products = await db.product.findMany({ orderBy: [{ categorySlug: "asc" }, { sku: "asc" }] });
  return NextResponse.json({ products });
}

export async function POST(req) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { data, error: msg } = await productInput(await req.json().catch(() => ({})), true);
  if (msg) return jsonError(msg);
  if (await db.product.findUnique({ where: { sku: data.sku } })) return jsonError("That SKU already exists.", 409);
  const product = await db.product.create({ data });
  return NextResponse.json({ product }, { status: 201 });
}
