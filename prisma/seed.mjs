// Seeds categories, products, default settings and the first admin user.
// Safe to re-run: existing rows are updated, not duplicated.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { categories, products, categoryImage } from "../lib/seed-catalog.js";

const db = new PrismaClient();

async function main() {
  for (const [i, c] of categories.entries()) {
    const data = { name: c.name, tagline: c.tagline, desc: c.desc, image: categoryImage(c), sort: i };
    await db.category.upsert({ where: { slug: c.slug }, update: data, create: { slug: c.slug, ...data } });
  }

  for (const p of products) {
    const data = {
      name: p.name, size: p.size, desc: p.desc, price: p.price, img: p.img,
      featured: p.featured, categorySlug: p.category,
    };
    await db.product.upsert({ where: { sku: p.sku }, update: {}, create: { sku: p.sku, ...data } });
  }

  const defaults = {
    storePhone: "+123 456 7890",
    storeEmail: "support@mustawa.com",
    shippingFee: "8",
    freeShippingOver: "100",
  };
  for (const [key, value] of Object.entries(defaults)) {
    await db.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const email = ADMIN_EMAIL.toLowerCase();
    const exists = await db.user.findUnique({ where: { email } });
    if (!exists) {
      await db.user.create({
        data: { email, name: "Store Admin", role: "admin", passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10) },
      });
      console.log(`Admin user created: ${email}`);
    }
  }

  console.log(`Seeded ${categories.length} categories, ${products.length} products.`);
}

main().finally(() => db.$disconnect());
