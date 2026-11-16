import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { requireAdmin, jsonError } from "../../../../../lib/auth";
import { ORDER_STATUSES } from "../../../../../lib/format";

export async function PATCH(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const id = Number((await params).id);
  const { status, paid } = await req.json().catch(() => ({}));

  const order = await db.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) return jsonError("Not found", 404);

  const data = {};
  if (paid !== undefined) data.paid = !!paid;
  if (status !== undefined) {
    if (!ORDER_STATUSES.includes(status)) return jsonError("Unknown status.");
    data.status = status;
  }

  const updated = await db.$transaction(async (tx) => {
    // Put stock back when an order is cancelled (and take it again if un-cancelled).
    const wasCancelled = order.status === "cancelled";
    const nowCancelled = (data.status ?? order.status) === "cancelled";
    if (wasCancelled !== nowCancelled) {
      for (const [productId, n] of stockUnits(order.items)) {
        await tx.product.updateMany({
          where: { id: productId },
          data: { stock: nowCancelled ? { increment: n } : { decrement: n } },
        });
      }
    }
    return tx.order.update({ where: { id }, data, include: { items: true } });
  });

  return NextResponse.json({ order: updated });
}

// Units of each product an order took from stock, expanding combo lines into their parts.
function stockUnits(items) {
  const units = new Map();
  const add = (id, n) => units.set(id, (units.get(id) || 0) + n);
  for (const i of items) {
    if (i.comboId) {
      for (const part of JSON.parse(i.parts || "[]")) add(part.productId, part.qty * i.qty);
    } else if (i.productId) {
      add(i.productId, i.qty);
    }
  }
  return units;
}
