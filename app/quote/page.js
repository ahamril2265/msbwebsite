"use client";

import { useState } from "react";
import { CheckCircle2, Boxes, Clock, BadgePercent } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Field, FormError, sendJSON, formValues } from "../../components/Form";

export default function QuotePage() {
  const { user, categories } = useStore();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const v = formValues(e.currentTarget);
    const picked = categories.filter((c) => v[`cat_${c.slug}`]).map((c) => c.name);
    setBusy(true);
    const { error } = await sendJSON("/api/quotes", {
      ...v,
      message: (picked.length ? `Interested in: ${picked.join(", ")}\n\n` : "") + v.message,
    });
    setBusy(false);
    if (error) return setError(error);
    setSent(true);
  };

  return (
    <main className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <span className="eyebrow">Wholesale</span>
        <h1 className="mt-2 text-4xl">Request a bulk quote</h1>
        <p className="mt-4 max-w-md">Ordering by the carton or pallet? Tell us what you need and we&apos;ll come back with tiered pricing, usually within one business day.</p>
        <ul className="mt-8 space-y-4">
          {[
            [BadgePercent, "Tiered pricing", "The more you order, the less you pay per pack."],
            [Boxes, "Mixed cartons", "Combine sizes and product lines in one order."],
            [Clock, "Fast reply", "A real person answers within one business day."],
          ].map(([Icon, t, d]) => (
            <li key={t} className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brandSoft text-brand"><Icon className="h-5 w-5" /></span>
              <div><div className="font-semibold">{t}</div><div className="text-sm text-muted">{d}</div></div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-line bg-surface p-6 md:p-8">
        {sent ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-brand" />
            <h2 className="mt-4 text-2xl">Request received</h2>
            <p className="mt-2">Thanks! We&apos;ll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <FormError>{error}</FormError>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" defaultValue={user?.name} required />
              <Field label="Business" name="company" defaultValue={user?.company || ""} />
              <Field label="Email" name="email" type="email" defaultValue={user?.email} required />
              <Field label="Phone" name="phone" type="tel" defaultValue={user?.phone || ""} />
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Products you&apos;re interested in</legend>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <label key={c.slug} className="cursor-pointer">
                    <input type="checkbox" name={`cat_${c.slug}`} className="peer sr-only" />
                    <span className="block rounded-full border border-line px-4 py-2 text-sm peer-checked:border-brand peer-checked:bg-brandSoft peer-checked:text-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                      {c.name}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <Field label="What do you need?" name="message" as="textarea" rows={5} placeholder="Sizes, quantities, how often you order…" required />
            <button disabled={busy} className="btn-primary w-full disabled:opacity-60">{busy ? "Sending…" : "Send request"}</button>
          </form>
        )}
      </div>
    </main>
  );
}
