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

  // Each cart line is either { id, qty } for a product or { comboId, qty } for a combo offer.
  const productIds = items.filter((i) => !i.comboId).map((i) => Number(i.id));
  const comboIds = items.filter((i) => i.comboId).map((i) => Number(i.comboId));
  const combos = comboIds.length
    ? await db.combo.findMany({ where: { id: { in: comboIds }, active: true }, include: { items: { include: { product: true } } } })
    : [];
  const partIds = combos.flatMap((c) => c.items.map((i) => i.productId));
  const products = await db.product.findMany({ where: { id: { in: [...productIds, ...partIds] }, active: true } });
  const byId = new Map(products.map((p) => [p.id, p]));

  const lines = [];
  const need = new Map(); // productId -> units needed across the whole order
  const take = (id, n) => need.set(id, (need.get(id) || 0) + n);

  for (const i of items) {
    const qty = Math.floor(Number(i.qty));
    if (!(qty > 0)) return jsonError("Invalid quantity.");
    if (i.comboId) {
      const c = combos.find((x) => x.id === Number(i.comboId));
      if (!c || !c.items.length || c.items.some((ci) => !byId.has(ci.productId)))
        return jsonError("One of the combo offers in your cart is no longer available.", 409);
      c.items.forEach((ci) => take(ci.productId, ci.qty * qty));
      const parts = c.items.map((ci) => ({ productId: ci.productId, sku: ci.product.sku, name: ci.product.name, qty: ci.qty }));
      lines.push({ comboId: c.id, parts: JSON.stringify(parts), sku: `COMBO-${c.id}`, name: c.name, img: c.img || c.items[0].product.img, price: c.price, qty });
    } else {
      const p = byId.get(Number(i.id));
      if (!p) return jsonError("One of the products in your cart is no longer available.", 409);
      take(p.id, qty);
      lines.push({ productId: p.id, sku: p.sku, name: p.name, img: p.img, price: p.price, qty });
    }
  }
  for (const [id, n] of need) {
    const p = byId.get(id);
    if (n > p.stock) return jsonError(`Only ${p.stock} left of ${p.name}${partIds.includes(id) ? " (counting the combo offers in your cart)" : ""}.`, 409);
  }

  const settings = await getSettings();
  const subtotal = +lines.reduce((s, l) => s + l.price * l.qty, 0).toFixed(2);
  const shipping = shippingFor(subtotal, settings);
  const user = await currentUser();
  const number = "MW" + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 90 + 10);

  const order = await db.$transaction(async (tx) => {
    for (const [id, n] of need) {
      await tx.product.update({ where: { id }, data: { stock: { decrement: n } } });
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
