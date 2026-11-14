import { NextResponse } from "next/server";
import { db, getSettings, shippingFor } from "../../../lib/db";
import { currentUser, jsonError, isEmail } from "../../../lib/auth";

export const dynamic = "force-dynamic";

// The signed-in customer's orders.
export async function GET() {
  const user = await currentUser();
  if (!user) return jsonError("Not signed in", 401);
  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

// Place an order. Prices and stock are always taken from the database, never the client.
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { items, payment } = body;
  const f = Object.fromEntries(
    ["name", "email", "phone", "company", "street", "city", "postal", "country", "notes"].map((k) => [k, (body[k] || "").toString().trim()])
  );

  for (const k of ["name", "phone", "street", "city", "postal", "country"]) {
    if (!f[k]) return jsonError(`Please fill in ${k === "postal" ? "postal code" : k}.`);
  }
  if (!isEmail(f.email)) return jsonError("Please enter a valid email.");
  if (!["bank", "cod"].includes(payment)) return jsonError("Choose a payment method.");
  if (!Array.isArray(items) || items.length === 0) return jsonError("Your cart is empty.");

  const ids = items.map((i) => Number(i.id));
  const products = await db.product.findMany({ where: { id: { in: ids }, active: true } });
  const lines = [];
  for (const i of items) {
    const p = products.find((x) => x.id === Number(i.id));
    const qty = Math.floor(Number(i.qty));
    if (!p) return jsonError("One of the products in your cart is no longer available.", 409);
    if (!(qty > 0)) return jsonError("Invalid quantity.");
    if (qty > p.stock) return jsonError(`Only ${p.stock} left of ${p.name}.`, 409);
    lines.push({ productId: p.id, sku: p.sku, name: p.name, img: p.img, price: p.price, qty });
  }

  const settings = await getSettings();
  const subtotal = +lines.reduce((s, l) => s + l.price * l.qty, 0).toFixed(2);
  const shipping = shippingFor(subtotal, settings);
  const user = await currentUser();
  const number = "MW" + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 90 + 10);

  const order = await db.$transaction(async (tx) => {
    for (const l of lines) {
      await tx.product.update({ where: { id: l.productId }, data: { stock: { decrement: l.qty } } });
    }
    return tx.order.create({
      data: {
        ...f,
        company: f.company || null,
        notes: f.notes || null,
        number,
        payment,
        subtotal,
        shipping,
        total: +(subtotal + shipping).toFixed(2),
        userId: user?.id ?? null,
        items: { create: lines },
      },
      include: { items: true },
    });
  });

  return NextResponse.json({ order }, { status: 201 });
}
