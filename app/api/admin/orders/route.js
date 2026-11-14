import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { error } = await requireAdmin();
  if (error) return error;
  const status = new URL(req.url).searchParams.get("status");
  const orders = await db.order.findMany({
    where: status ? { status } : {},
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}
