"use client";

import { useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";
import { formatDate, statusStyle } from "../../../lib/format";
import { sendJSON } from "../../../components/Form";
import { PageHeader } from "../ui";

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState(null);
  const [filter, setFilter] = useState("open");

  useEffect(() => {
    fetch("/api/admin/quotes").then((r) => r.json()).then((d) => setQuotes(d.quotes || []));
  }, []);

  const setStatus = async (id, status) => {
    const { data } = await sendJSON(`/api/admin/quotes/${id}`, { status }, "PATCH");
    if (data) setQuotes((qs) => qs.map((q) => (q.id === id ? data.quote : q)));
  };

  const shown = (quotes || []).filter((q) => (filter === "open" ? q.status !== "closed" : true));

  return (
    <>
      <PageHeader title="Quote requests" subtitle="Bulk and wholesale enquiries from the quote form.">
        {["open", "all"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${filter === f ? "bg-ink text-white" : "border border-line bg-surface"}`}>
            {f}
          </button>
        ))}
      </PageHeader>

      {quotes === null ? (
        <p className="text-sm">Loading…</p>
      ) : shown.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-12 text-center text-sm">No quote requests {filter === "open" ? "waiting" : "yet"}.</div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {shown.map((q) => (
            <article key={q.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{q.name}{q.company && <span className="font-normal text-muted"> · {q.company}</span>}</div>
                  <div className="text-xs text-muted">{formatDate(q.createdAt)}</div>
                </div>
                <select
                  value={q.status}
                  onChange={(e) => setStatus(q.id, e.target.value)}
                  aria-label="Quote status"
                  className={`rounded-full border-0 px-3 py-1 text-xs font-semibold capitalize ${statusStyle(q.status)}`}
                >
                  {["new", "contacted", "closed"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-ink">{q.message}</p>
              <div className="mt-4 flex flex-wrap gap-4 border-t border-line pt-3 text-sm">
                <a href={`mailto:${q.email}?subject=Your%20bulk%20quote`} className="flex items-center gap-1.5 font-medium text-brand hover:underline"><Mail className="h-4 w-4" /> {q.email}</a>
                {q.phone && <a href={`tel:${q.phone}`} className="flex items-center gap-1.5 font-medium text-brand hover:underline"><Phone className="h-4 w-4" /> {q.phone}</a>}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
