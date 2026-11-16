import Image from "next/image";
import Link from "next/link";
import { Plus, Tag } from "lucide-react";
import { db } from "../../../lib/db";
import { formatPrice } from "../../../lib/format";
import { PageHeader } from "../ui";

export const dynamic = "force-dynamic";

export default async function AdminCombos() {
  const [combos, sales] = await Promise.all([
    db.combo.findMany({ include: { items: { include: { product: true }, orderBy: { id: "asc" } } }, orderBy: { createdAt: "desc" } }),
    db.orderItem.groupBy({ by: ["comboId"], _sum: { qty: true }, where: { comboId: { not: null }, order: { status: { not: "cancelled" } } } }),
  ]);
  const sold = new Map(sales.map((s) => [s.comboId, s._sum.qty || 0]));

  return (
    <>
      <PageHeader title="Combo offers" subtitle="Bundles of products sold together at a special price.">
        <Link href="/admin/combos/new" className="btn-primary px-5 py-2.5 text-sm"><Plus className="h-4 w-4" /> New combo</Link>
      </PageHeader>

      {combos.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-12 text-center text-sm">
          <Tag className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-3">No combo offers yet. Create one to bundle products at a discount.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="p-4">Combo</th>
                <th className="p-4">Price</th>
                <th className="p-4">Saving</th>
                <th className="p-4">Can sell</th>
                <th className="p-4">Sold</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {combos.map((c) => {
                const worth = c.items.reduce((s, i) => s + i.product.price * i.qty, 0);
                const broken = c.items.some((i) => !i.product.active);
                const canSell = c.items.length ? Math.min(...c.items.map((i) => Math.floor(i.product.stock / i.qty))) : 0;
                const [label, style] = !c.active
                  ? ["Hidden", "bg-surface2 text-muted"]
                  : broken
                    ? ["Not shown: has a hidden product", "bg-red-50 text-red-700"]
                    : ["Live", "bg-brandSoft text-brandDark"];
                return (
                  <tr key={c.id} className="hover:bg-page">
                    <td className="p-4">
                      <Link href={`/admin/combos/${c.id}`} className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 rounded-lg border border-line bg-white">
                          {(c.img || c.items[0]) && <Image src={c.img || c.items[0].product.img} alt="" fill sizes="48px" className="object-contain p-1" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-ink hover:text-brand">{c.name}</div>
                          <div className="max-w-md truncate text-xs text-muted">{c.items.map((i) => `${i.qty}× ${i.product.name}`).join(", ")}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="p-4 font-semibold">{formatPrice(c.price)}</td>
                    <td className="p-4">
                      {worth > c.price ? `${formatPrice(worth - c.price)} (${Math.round(((worth - c.price) / worth) * 100)}%)` : <span className="text-red-600">None</span>}
                    </td>
                    <td className="p-4">{canSell}</td>
                    <td className="p-4">{sold.get(c.id) || 0}</td>
                    <td className="p-4"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>{label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
