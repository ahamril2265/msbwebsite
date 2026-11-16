import Image from "next/image";
import { Check } from "lucide-react";
import { formatPrice, statusStyle } from "../lib/format";

export function StatusBadge({ status }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle(status)}`}>{status}</span>;
}

const STEPS = ["pending", "confirmed", "shipped", "delivered"];

export function OrderTracker({ status }) {
  if (status === "cancelled") return <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">This order was cancelled.</div>;
  const at = STEPS.indexOf(status);
  return (
    <ol className="grid grid-cols-4">
      {STEPS.map((s, i) => (
        <li key={s} className="relative flex flex-col items-center text-center">
          {i > 0 && <span className={`absolute right-1/2 top-4 h-0.5 w-full ${i <= at ? "bg-brand" : "bg-line"}`} />}
          <span className={`relative z-10 grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${i <= at ? "bg-brand text-white" : "border-2 border-line bg-surface text-muted"}`}>
            {i < at || status === "delivered" ? <Check className="h-4 w-4" /> : i + 1}
          </span>
          <span className={`mt-2 text-xs capitalize ${i <= at ? "font-semibold text-ink" : "text-muted"}`}>{s === "pending" ? "Placed" : s}</span>
        </li>
      ))}
    </ol>
  );
}

export function OrderItems({ items }) {
  return (
    <ul className="divide-y divide-line">
      {items.map((i) => (
        <li key={i.id} className="flex items-center gap-4 py-3">
          <div className="relative h-14 w-14 shrink-0 rounded-lg border border-line bg-white">
            <Image src={i.img} alt={i.name} fill sizes="56px" className="object-contain p-1" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">
              {i.comboId && <span className="mr-1.5 rounded bg-amber/30 px-1.5 py-0.5 text-[10px] font-bold text-ink">COMBO</span>}
              {i.name}
            </div>
            <div className="text-xs text-muted">{i.comboId ? "Combo offer" : `SKU ${i.sku}`} · {i.qty} × {formatPrice(i.price)}</div>
            {i.comboId && (
              <div className="mt-0.5 text-xs text-muted">
                Includes {JSON.parse(i.parts || "[]").map((p) => `${p.qty * i.qty} × ${p.name}`).join(", ")}
              </div>
            )}
          </div>
          <span className="text-sm font-semibold">{formatPrice(i.price * i.qty)}</span>
        </li>
      ))}
    </ul>
  );
}

export function OrderTotals({ order }) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
      <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{order.shipping ? formatPrice(order.shipping) : "Free"}</dd></div>
      <div className="flex justify-between border-t border-line pt-2 text-base font-bold"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
    </dl>
  );
}
