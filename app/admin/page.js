import Link from "next/link";
import Image from "next/image";
import { db } from "../../lib/db";
import { formatPrice, formatDate } from "../../lib/format";
import { PageHeader, Card } from "./ui";
import OrdersTable from "./OrdersTable";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const since = new Date(Date.now() - 30 * 864e5);
  const [revenue, recent, pending, lowStock, newQuotes, customers, recentOrders] = await Promise.all([
    db.order.aggregate({ _sum: { total: true }, _count: true, where: { status: { not: "cancelled" }, createdAt: { gte: since } } }),
    db.order.findMany({ where: { createdAt: { gte: since }, status: { not: "cancelled" } }, select: { total: true, createdAt: true } }),
    db.order.count({ where: { status: "pending" } }),
    db.product.findMany({ where: { active: true, stock: { lt: 20 } }, orderBy: { stock: "asc" }, take: 6 }),
    db.quoteRequest.count({ where: { status: "new" } }),
    db.user.count({ where: { role: "customer" } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  // Revenue per day for the last 14 days.
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (13 - i));
    return d;
  });
  const perDay = days.map((d) => {
    const end = new Date(d.getTime() + 864e5);
    return recent.filter((o) => o.createdAt >= d && o.createdAt < end).reduce((s, o) => s + o.total, 0);
  });
  const peak = Math.max(...perDay, 1);

  const stats = [
    ["Revenue (30 days)", formatPrice(revenue._sum.total || 0)],
    ["Orders (30 days)", revenue._count],
    ["Awaiting confirmation", pending, "/admin/orders?status=pending"],
    ["New quote requests", newQuotes, "/admin/quotes"],
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle={`${customers} registered customer${customers === 1 ? "" : "s"}`} />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map(([label, value, href]) => {
          const body = (
            <>
              <div className="text-sm text-muted">{label}</div>
              <div className="mt-2 font-display text-3xl font-extrabold">{value}</div>
            </>
          );
          return href ? (
            <Link key={label} href={href} className="rounded-2xl border border-line bg-surface p-5 transition hover:border-brand">{body}</Link>
          ) : (
            <div key={label} className="rounded-2xl border border-line bg-surface p-5">{body}</div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card title="Revenue, last 14 days">
          <div className="flex h-48 items-end gap-1.5">
            {perDay.map((v, i) => (
              <div key={i} className="group relative flex h-full flex-1 flex-col justify-end">
                <div className="rounded-t-md bg-brand/80 transition group-hover:bg-brand" style={{ height: `${Math.max(2, (v / peak) * 100)}%` }} />
                <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] text-white group-hover:block">
                  {formatPrice(v)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted">
            <span>{formatDate(days[0])}</span>
            <span>Today</span>
          </div>
        </Card>

        <Card title="Low stock" action={<Link href="/admin/products?sort=stock" className="text-sm font-semibold text-brand hover:underline">All products</Link>}>
          {lowStock.length === 0 ? (
            <p className="text-sm">Everything is well stocked.</p>
          ) : (
            <ul className="divide-y divide-line">
              {lowStock.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 py-2.5 hover:text-brand">
                    <div className="relative h-10 w-10 shrink-0 rounded-lg border border-line bg-white">
                      <Image src={p.img} alt="" fill sizes="40px" className="object-contain p-1" />
                    </div>
                    <span className="min-w-0 flex-1 truncate text-sm">{p.name}</span>
                    <span className={`text-sm font-bold ${p.stock === 0 ? "text-red-600" : "text-[#8a5a00]"}`}>{p.stock}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="mt-6" title="Recent orders" action={<Link href="/admin/orders" className="text-sm font-semibold text-brand hover:underline">View all</Link>}>
        {recentOrders.length === 0 ? (
          <p className="text-sm">No orders yet. They&apos;ll appear here as soon as customers check out.</p>
        ) : (
          <OrdersTable orders={recentOrders} />
        )}
      </Card>
    </>
  );
}
