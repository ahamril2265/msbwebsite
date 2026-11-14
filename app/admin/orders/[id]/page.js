import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { db } from "../../../../lib/db";
import { formatDate, PAYMENT_LABELS } from "../../../../lib/format";
import { StatusBadge, OrderItems, OrderTotals } from "../../../../components/OrderBits";
import { Card } from "../../ui";
import OrderControls from "./OrderControls";

export const dynamic = "force-dynamic";

export default async function AdminOrder({ params }) {
  const order = await db.order.findUnique({
    where: { id: Number((await params).id) },
    include: { items: true, user: { select: { id: true, email: true } } },
  });
  if (!order) notFound();

  return (
    <>
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> Orders
      </Link>
      <div className="mb-8 mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl md:text-3xl">Order {order.number}</h1>
        <StatusBadge status={order.status} />
        <span className="text-sm text-muted">Placed {formatDate(order.createdAt)}</span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card title={`Items (${order.items.reduce((n, i) => n + i.qty, 0)})`}>
            <OrderItems items={order.items} />
            <div className="mt-4 border-t border-line pt-4"><OrderTotals order={order} /></div>
          </Card>
          {order.notes && <Card title="Customer notes"><p className="whitespace-pre-line text-sm text-ink">{order.notes}</p></Card>}
        </div>

        <div className="space-y-6">
          <OrderControls id={order.id} status={order.status} paid={order.paid} payment={PAYMENT_LABELS[order.payment]} />

          <Card title="Customer">
            <div className="space-y-2 text-sm">
              <div className="font-semibold text-ink">{order.name}</div>
              {order.company && <div>{order.company}</div>}
              <a href={`mailto:${order.email}`} className="flex items-center gap-2 text-brand hover:underline"><Mail className="h-4 w-4" /> {order.email}</a>
              <a href={`tel:${order.phone}`} className="flex items-center gap-2 text-brand hover:underline"><Phone className="h-4 w-4" /> {order.phone}</a>
              <div className="pt-1 text-xs text-muted">{order.user ? "Registered customer" : "Guest checkout"}</div>
            </div>
          </Card>

          <Card title="Delivery address">
            <p className="text-sm text-ink">{order.street}<br />{order.city} {order.postal}<br />{order.country}</p>
          </Card>
        </div>
      </div>
    </>
  );
}
