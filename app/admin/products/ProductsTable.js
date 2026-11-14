"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { formatPrice } from "../../../lib/format";
import { sendJSON } from "../../../components/Form";

export default function ProductsTable({ products, categories }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [sort, setSort] = useState(useSearchParams().get("sort") || "sku");
  const [saving, setSaving] = useState(null);

  const rows = useMemo(() => {
    const t = q.toLowerCase();
    const r = products.filter((p) => (!cat || p.categorySlug === cat) && (!t || p.name.toLowerCase().includes(t) || p.sku.toLowerCase().includes(t)));
    const by = { stock: (a, b) => a.stock - b.stock, price: (a, b) => a.price - b.price, name: (a, b) => a.name.localeCompare(b.name) }[sort];
    return by ? [...r].sort(by) : r;
  }, [products, q, cat, sort]);

  // Quick inline edits for the two things changed most often.
  const quickSave = async (id, field, value) => {
    setSaving(id);
    const { error } = await sendJSON(`/api/admin/products/${id}`, { [field]: value }, "PATCH");
    setSaving(null);
    if (error) alert(error);
    router.refresh();
  };

  const catName = (slug) => categories.find((c) => c.slug === slug)?.name;
  const input = "rounded-full border border-line bg-surface px-4 py-2 text-sm focus:border-brand focus:outline-none";

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or SKU…" className={`${input} w-full sm:w-64`} />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={input} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={input} aria-label="Sort">
          <option value="sku">Sort: category & SKU</option>
          <option value="stock">Sort: lowest stock</option>
          <option value="price">Sort: price</option>
          <option value="name">Sort: name</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Visible</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((p) => (
              <tr key={p.id} className={`${p.active ? "" : "opacity-60"} ${saving === p.id ? "animate-pulse" : ""}`}>
                <td className="px-4 py-2.5">
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 hover:text-brand">
                    <div className="relative h-11 w-11 shrink-0 rounded-lg border border-line bg-white">
                      <Image src={p.img} alt="" fill sizes="44px" className="object-contain p-1" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 font-medium">
                        {p.name}
                        {p.featured && <Star className="h-3.5 w-3.5 fill-amber text-amber" aria-label="Featured" />}
                      </div>
                      <div className="text-xs text-muted">{p.sku}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-muted">{catName(p.categorySlug)}</td>
                <td className="px-4 py-2.5 font-medium">{formatPrice(p.price)}</td>
                <td className="px-4 py-2.5">
                  <input
                    key={p.stock}
                    type="number"
                    min="0"
                    defaultValue={p.stock}
                    onBlur={(e) => Number(e.target.value) !== p.stock && quickSave(p.id, "stock", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                    aria-label={`Stock for ${p.name}`}
                    className={`w-20 rounded-lg border bg-page px-2 py-1.5 text-sm focus:border-brand focus:outline-none ${
                      p.stock === 0 ? "border-red-300 text-red-700" : p.stock < 20 ? "border-amber text-[#8a5a00]" : "border-line"
                    }`}
                  />
                </td>
                <td className="px-4 py-2.5">
                  <button
                    onClick={() => quickSave(p.id, "active", !p.active)}
                    role="switch"
                    aria-checked={p.active}
                    aria-label={`Show ${p.name} in store`}
                    className={`relative h-6 w-11 rounded-full transition ${p.active ? "bg-brand" : "bg-line"}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${p.active ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link href={`/admin/products/${p.id}`} className="text-sm font-semibold text-brand hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="py-10 text-center text-sm">No products match.</p>}
      </div>
    </>
  );
}
