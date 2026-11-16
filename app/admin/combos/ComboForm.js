"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Trash2, Plus, X } from "lucide-react";
import { Field, FormError, sendJSON, formValues } from "../../../components/Form";
import { formatPrice } from "../../../lib/format";
import { Card } from "../ui";
import { Toggle } from "../products/ProductForm";

const input = "w-full rounded-xl border border-line bg-page px-3 py-2.5 text-sm focus:border-brand focus:outline-none";

export default function ComboForm({ combo, products }) {
  const router = useRouter();
  const editing = !!combo;
  const [rows, setRows] = useState(
    combo?.items.map((i) => ({ productId: String(i.productId), qty: i.qty })) || [{ productId: "", qty: 1 }, { productId: "", qty: 1 }]
  );
  const [price, setPrice] = useState(combo?.price ?? "");
  const [img, setImg] = useState(combo?.img || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  // Live maths so the admin sees the saving and how many can be sold before saving.
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const chosen = rows.filter((r) => byId.has(Number(r.productId)));
  const worth = chosen.reduce((s, r) => s + byId.get(Number(r.productId)).price * (Number(r.qty) || 0), 0);
  const saving = worth - (Number(price) || 0);
  const canSell = chosen.length
    ? Math.min(...chosen.map((r) => Math.floor(byId.get(Number(r.productId)).stock / Math.max(1, Number(r.qty) || 1))))
    : 0;

  const setRow = (i, patch) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    setUploading(false);
    if (!res.ok) return setError(data.error || "Upload failed.");
    setImg(data.url);
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = formValues(e.currentTarget);
    const payload = {
      name: v.name,
      desc: v.desc,
      price,
      img,
      active: v.active === "on",
      featured: v.featured === "on",
      items: rows.filter((r) => r.productId).map((r) => ({ productId: Number(r.productId), qty: Number(r.qty) })),
    };
    setBusy(true);
    setError("");
    const { error } = await sendJSON(editing ? `/api/admin/combos/${combo.id}` : "/api/admin/combos", payload, editing ? "PATCH" : "POST");
    setBusy(false);
    if (error) return setError(error);
    router.push("/admin/combos");
    router.refresh();
  };

  const remove = async () => {
    if (!confirm(`Delete "${combo.name}"? If it appears in past orders it will be hidden instead.`)) return;
    const res = await fetch(`/api/admin/combos/${combo.id}`, { method: "DELETE" });
    if (!res.ok) return setError("Couldn't delete.");
    router.push("/admin/combos");
    router.refresh();
  };

  return (
    <form onSubmit={submit}>
      <Link href="/admin/combos" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> Combo offers
      </Link>
      <div className="mb-8 mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl">{editing ? combo.name : "New combo offer"}</h1>
        <div className="flex gap-2">
          {editing && (
            <button type="button" onClick={remove} className="btn-ghost px-4 py-2.5 text-sm hover:border-red-300 hover:text-red-600">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          )}
          <button disabled={busy || uploading} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">{busy ? "Saving…" : "Save combo"}</button>
        </div>
      </div>

      <div className="mb-6"><FormError>{error}</FormError></div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card title="Details">
            <div className="grid gap-4">
              <Field label="Name" name="name" defaultValue={combo?.name} placeholder="e.g. Restaurant starter pack" required />
              <Field label="Description (optional)" name="desc" as="textarea" rows={3} defaultValue={combo?.desc} />
            </div>
          </Card>

          <Card title="Products in this combo">
            <div className="space-y-3">
              {rows.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select value={r.productId} onChange={(e) => setRow(i, { productId: e.target.value })} aria-label="Product" className={input}>
                    <option value="">Choose a product…</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku}) · {formatPrice(p.price)}{p.active ? "" : " · hidden"}
                      </option>
                    ))}
                  </select>
                  <input type="number" min="1" step="1" value={r.qty} onChange={(e) => setRow(i, { qty: e.target.value })} aria-label="Quantity" className={`${input} w-20 shrink-0`} />
                  <button type="button" onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} aria-label="Remove product" className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setRows((rs) => [...rs, { productId: "", qty: 1 }])} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              <Plus className="h-4 w-4" /> Add product
            </button>
          </Card>

          <Card title="Price">
            <div className="grid items-start gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Combo price
                <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className={`${input} mt-1.5 py-3`} />
              </label>
              <dl className="space-y-1 rounded-xl bg-page p-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted">Bought separately</dt><dd>{formatPrice(worth)}</dd></div>
                <div className="flex justify-between font-semibold">
                  <dt>Customer saves</dt>
                  <dd className={saving > 0 ? "text-brand" : "text-red-600"}>
                    {formatPrice(saving)}{worth > 0 && ` (${Math.round((saving / worth) * 100)}%)`}
                  </dd>
                </div>
                <div className="flex justify-between"><dt className="text-muted">Can sell with current stock</dt><dd>{canSell}</dd></div>
              </dl>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Photo (optional)">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-dashed border-line bg-white">
              {img ? (
                <Image src={img} alt="" fill sizes="340px" className="object-contain p-4" />
              ) : (
                <div className="grid h-full place-items-center p-4 text-center text-sm text-muted">
                  No photo. The store will show the products&apos; photos together.
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => upload(e.target.files?.[0])} />
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-ghost flex-1 py-2.5 text-sm">
                <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : img ? "Replace" : "Upload photo"}
              </button>
              {img && <button type="button" onClick={() => setImg("")} className="btn-ghost px-4 py-2.5 text-sm">Remove</button>}
            </div>
          </Card>

          <Card title="Visibility">
            <div className="space-y-4">
              <Toggle name="active" label="Available in store" defaultChecked={combo?.active ?? true} />
              <Toggle name="featured" label="Show on home page" defaultChecked={combo?.featured ?? true} />
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
