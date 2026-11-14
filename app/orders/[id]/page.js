import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";
import { formatDate, PAYMENT_LABELS } from "../../../lib/format";
import { StatusBadge, OrderTracker, OrderItems, OrderTotals } from "../../../components/OrderBits";

export const dynamic = "force-dynamic";

// The [id] segment is the order number, e.g. /orders/MW1AB2CD34
export default async function OrderPage({ params }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) redirect(`/login?next=/orders/${id}`);

  const order = await db.order.findUnique({ where: { number: id }, include: { items: true } });
  if (!order || (order.userId !== user.id && user.role !== "admin")) notFound();

  return (
    <main className="container-x max-w-4xl py-10">
      <Link href="/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> All orders
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl">Order {order.number}</h1>
        <StatusBadge status={order.status} />
      </div>
      <p className="mt-1 text-sm">Placed {formatDate(order.createdAt)}</p>

      <section className="mt-8 rounded-2xl border border-line bg-surface p-6">
        <OrderTracker status={order.status} />
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_300px]">
        <section className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="mb-2 text-lg">Items</h2>
          <OrderItems items={order.items} />
          <div className="mt-4 border-t border-line pt-4"><OrderTotals order={order} /></div>
        </section>

        <section className="h-fit space-y-5 rounded-2xl border border-line bg-surface p-6 text-sm">
          <div>
            <h2 className="mb-2 text-base">Delivery</h2>
            <p className="text-ink">{order.name}{order.company && <><br />{order.company}</>}<br />{order.street}<br />{order.city} {order.postal}<br />{order.country}</p>
          </div>
          <div>
            <h2 className="mb-2 text-base">Payment</h2>
            <p className="text-ink">{PAYMENT_LABELS[order.payment]} · {order.paid ? "Paid" : "Not yet paid"}</p>
            {order.payment === "bank" && !order.paid && <p className="mt-1 text-xs">Use <b>{order.number}</b> as your transfer reference.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
