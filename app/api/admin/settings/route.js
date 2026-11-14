import { NextResponse } from "next/server";
import { db, getSettings } from "../../../../lib/db";
import { requireAdmin, jsonError } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  return NextResponse.json({ settings: await getSettings() });
}

export async function PUT(req) {
  const { error } = await requireAdmin();
  if (error) return error;
  const b = await req.json().catch(() => ({}));
  const fee = Number(b.shippingFee), free = Number(b.freeShippingOver);
  if (!(fee >= 0) || !(free >= 0)) return jsonError("Delivery amounts must be numbers ≥ 0.");

  const values = {
    storePhone: (b.storePhone || "").toString().trim(),
    storeEmail: (b.storeEmail || "").toString().trim(),
    shippingFee: String(fee),
    freeShippingOver: String(free),
  };
  await db.$transaction(
    Object.entries(values).map(([key, value]) => db.setting.upsert({ where: { key }, update: { value }, create: { key, value } }))
  );
  return NextResponse.json({ settings: await getSettings() });
}
