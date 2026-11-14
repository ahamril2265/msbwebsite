import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { currentUser, jsonError } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const { number } = await params;
  const user = await currentUser();
  if (!user) return jsonError("Not signed in", 401);
  const order = await db.order.findUnique({ where: { number }, include: { items: true } });
  if (!order || (order.userId !== user.id && user.role !== "admin")) return jsonError("Order not found", 404);
  return NextResponse.json({ order });
}
