"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import { Field, FormError, sendJSON, formValues } from "../../../components/Form";
import { Card } from "../ui";

export default function ProductForm({ product, categories }) {
  const router = useRouter();
  const editing = !!product;
  const [img, setImg] = useState(product?.img || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

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
    const payload = { ...v, img, featured: v.featured === "on", active: v.active === "on" };
    setBusy(true);
    setError("");
    const { data, error } = await sendJSON(editing ? `/api/admin/products/${product.id}` : "/api/admin/products", payload, editing ? "PATCH" : "POST");
    setBusy(false);
    if (error) return setError(error);
    router.push(editing ? "/admin/products" : `/admin/products/${data.product.id}`);
    router.refresh();
  };

  const remove = async () => {
    if (!confirm(`Delete ${product.name}? If it appears in past orders it will be hidden instead.`)) return;
    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setError(data.error || "Couldn't delete.");
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={submit}>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> Products
      </Link>
      <div className="mb-8 mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl">{editing ? product.name : "Add product"}</h1>
        <div className="flex gap-2">
          {editing && (
            <button type="button" onClick={remove} className="btn-ghost px-4 py-2.5 text-sm hover:border-red-300 hover:text-red-600">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          )}
          <button disabled={busy || uploading} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">{busy ? "Saving…" : "Save product"}</button>
        </div>
      </div>

      <div className="mb-6"><FormError>{error}</FormError></div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card title="Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" defaultValue={product?.name} className="sm:col-span-2" required />
              <Field label="SKU" name="sku" defaultValue={product?.sku} required hint="Letters, numbers, - or _" />
              <Field label="Size" name="size" defaultValue={product?.size || ""} placeholder={'e.g. 13" × 16"'} />
              <Field label="Description" name="desc" as="textarea" rows={4} defaultValue={product?.desc} className="sm:col-span-2" />
            </div>
          </Card>

          <Card title="Pricing & stock">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price" name="price" type="number" step="0.01" min="0" defaultValue={product?.price} required />
              <Field label="Stock" name="stock" type="number" min="0" step="1" defaultValue={product?.stock ?? 100} required />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Photo">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-dashed border-line bg-white">
              {img ? (
                <Image src={img} alt="" fill sizes="340px" className="object-contain p-4" />
              ) : (
                <div className="grid h-full place-items-center text-sm text-muted">No photo yet</div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => upload(e.target.files?.[0])} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-ghost mt-3 w-full py-2.5 text-sm">
              <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : img ? "Replace photo" : "Upload photo"}
            </button>
            <p className="mt-2 text-xs text-muted">JPG, PNG or WebP, up to 5 MB. White backgrounds look best.</p>
          </Card>

          <Card title="Organisation">
            <div className="space-y-4">
              <Field label="Category">
                <select name="categorySlug" defaultValue={product?.categorySlug || categories[0]?.slug} className="w-full rounded-xl border border-line bg-page px-3 py-3 text-sm focus:border-brand focus:outline-none">
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </Field>
              <Toggle name="active" label="Visible in store" defaultChecked={product?.active ?? true} />
              <Toggle name="featured" label="Featured on home page" defaultChecked={product?.featured ?? false} />
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}

function Toggle({ name, label, defaultChecked }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
      {label}
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-line transition after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:bg-brand peer-checked:after:left-[22px] peer-focus-visible:ring-2 peer-focus-visible:ring-brand" />
    </label>
  );
}
