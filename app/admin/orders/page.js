import Link from "next/link";
import { db } from "../../../lib/db";
import { ORDER_STATUSES } from "../../../lib/format";
import { PageHeader, Card } from "../ui";
import OrdersTable from "../OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrders({ searchParams }) {
  const { status, q } = await searchParams;
  const term = (q || "").trim();

  const [orders, counts] = await Promise.all([
    db.order.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(term ? { OR: [{ number: { contains: term } }, { name: { contains: term } }, { email: { contains: term } }, { company: { contains: term } }] } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    db.order.groupBy({ by: ["status"], _count: true }),
  ]);
  const count = Object.fromEntries(counts.map((c) => [c.status, c._count]));
  const total = counts.reduce((s, c) => s + c._count, 0);

  const tab = (s, label, n) => {
    const on = (status || "") === s;
    const href = `/admin/orders${s || term ? "?" : ""}${new URLSearchParams({ ...(s && { status: s }), ...(term && { q: term }) })}`;
    return (
      <Link key={label} href={href} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium capitalize ${on ? "bg-ink text-white" : "border border-line bg-surface text-ink hover:border-brand"}`}>
        {label} <span className={on ? "text-white/60" : "text-muted"}>{n}</span>
      </Link>
    );
  };

  return (
    <>
      <PageHeader title="Orders" subtitle="Confirm, ship and track customer orders." />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {tab("", "All", total)}
          {ORDER_STATUSES.map((s) => tab(s, s, count[s] || 0))}
        </div>
        <form className="w-full sm:w-72">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            name="q"
            defaultValue={term}
            placeholder="Search number, name, email…"
            className="w-full rounded-full border border-line bg-surface px-4 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </form>
      </div>

      <Card>
        {orders.length === 0 ? <p className="py-8 text-center text-sm">No orders match.</p> : <OrdersTable orders={orders} />}
      </Card>
    </>
  );
}
