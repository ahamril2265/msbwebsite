import Link from "next/link";
import { formatPrice, formatDate } from "../../lib/format";
import { StatusBadge } from "../../components/OrderBits";

export default function OrdersTable({ orders }) {
  return (
    <div className="-mx-5 overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
            <th className="px-5 py-2 font-semibold">Order</th>
            <th className="px-5 py-2 font-semibold">Customer</th>
            <th className="px-5 py-2 font-semibold">Date</th>
            <th className="px-5 py-2 font-semibold">Status</th>
            <th className="px-5 py-2 font-semibold">Payment</th>
            <th className="px-5 py-2 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-page">
              <td className="px-5 py-3"><Link href={`/admin/orders/${o.id}`} className="font-semibold text-brand hover:underline">{o.number}</Link></td>
              <td className="px-5 py-3">{o.name}{o.company && <span className="block text-xs text-muted">{o.company}</span>}</td>
              <td className="px-5 py-3 text-muted">{formatDate(o.createdAt)}</td>
              <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
              <td className="px-5 py-3">
                <span className={o.paid ? "font-medium text-brand" : "text-muted"}>{o.paid ? "Paid" : "Unpaid"}</span>
                <span className="block text-xs text-muted">{o.payment === "cod" ? "Cash on delivery" : "Bank transfer"}</span>
              </td>
              <td className="px-5 py-3 text-right font-semibold">{formatPrice(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
