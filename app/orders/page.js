import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, ChevronRight } from "lucide-react";
import { db } from "../../lib/db";
import { currentUser } from "../../lib/auth";
import { formatPrice, formatDate } from "../../lib/format";
import { StatusBadge } from "../../components/OrderBits";

export const dynamic = "force-dynamic";
export const metadata = { title: "My orders · Mustawa" };

export default async function OrdersPage() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/orders");

  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container-x py-10">
      <h1 className="text-3xl md:text-4xl">My orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-12 text-center">
          <Package className="mx-auto h-10 w-10 text-muted" />
          <h2 className="mt-4 text-xl">No orders yet</h2>
          <p className="mt-1 text-sm">When you place an order it will show up here.</p>
          <Link href="/search" className="btn-primary mt-6">Start shopping</Link>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/orders/${o.number}`} className="flex items-center gap-4 p-5 hover:bg-page">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold">{o.number}</span>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    {formatDate(o.createdAt)} · {o.items.reduce((n, i) => n + i.qty, 0)} items
                  </div>
                </div>
                <span className="font-display text-lg font-extrabold">{formatPrice(o.total)}</span>
                <ChevronRight className="h-5 w-5 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
