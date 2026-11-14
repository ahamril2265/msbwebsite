"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES } from "../../../../lib/format";
import { FormError, sendJSON } from "../../../../components/Form";
import { Card } from "../../ui";

// Next step for each status, for the one-click button.
const NEXT = { pending: "confirmed", confirmed: "shipped", shipped: "delivered" };
const NEXT_LABEL = { confirmed: "Confirm order", shipped: "Mark as shipped", delivered: "Mark as delivered" };

export default function OrderControls({ id, status, paid, payment }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const save = async (changes) => {
    if (changes.status === "cancelled" && !confirm("Cancel this order? Its items go back into stock.")) return;
    setBusy(true);
    setError("");
    const { error } = await sendJSON(`/api/admin/orders/${id}`, changes, "PATCH");
    setBusy(false);
    if (error) return setError(error);
    router.refresh();
  };

  const next = NEXT[status];

  return (
    <Card title="Manage order">
      <div className="space-y-4">
        <FormError>{error}</FormError>
        {next && (
          <button disabled={busy} onClick={() => save({ status: next })} className="btn-primary w-full disabled:opacity-60">
            {NEXT_LABEL[next]}
          </button>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Status</span>
          <select
            value={status}
            disabled={busy}
            onChange={(e) => save({ status: e.target.value })}
            className="w-full rounded-xl border border-line bg-page px-3 py-2.5 text-sm capitalize focus:border-brand focus:outline-none"
          >
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <div className="flex items-center justify-between rounded-xl bg-page px-4 py-3">
          <div>
            <div className="text-sm font-medium">{paid ? "Paid" : "Not paid"}</div>
            <div className="text-xs text-muted">{payment}</div>
          </div>
          <button disabled={busy} onClick={() => save({ paid: !paid })} className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold hover:border-brand hover:text-brand">
            Mark {paid ? "unpaid" : "paid"}
          </button>
        </div>
      </div>
    </Card>
  );
}
