import { PrismaClient } from "@prisma/client";

// Reuse one client across hot reloads in development.
const g = globalThis;
export const db = g.__prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") g.__prisma = db;

export async function getSettings() {
  const rows = await db.setting.findMany();
  const s = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    storePhone: s.storePhone || "",
    storeEmail: s.storeEmail || "",
    shippingFee: Number(s.shippingFee ?? 8),
    freeShippingOver: Number(s.freeShippingOver ?? 100),
  };
}

export const shippingFor = (subtotal, settings) =>
  subtotal === 0 || subtotal >= settings.freeShippingOver ? 0 : settings.shippingFee;
