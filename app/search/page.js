"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import { useStore } from "../../context/StoreContext";

const SORTS = {
  relevance: "Recommended",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  popular: "Best selling",
  name: "Name A–Z",
};

function SearchContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { products, categories, getCategory } = useStore();
  const [showFilters, setShowFilters] = useState(false);

  const q = params.get("q") || "";
  const selected = params.getAll("category");
  const inStock = params.get("inStock") === "1";
  const sort = params.get("sort") || "relevance";
  const min = params.get("min") || "";
  const max = params.get("max") || "";

  // Every filter change updates the URL, so results are shareable and survive refresh.
  const update = (changes) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) {
      next.delete(k);
      [].concat(v).filter((x) => x !== "" && x != null && x !== false).forEach((x) => next.append(k, x));
    }
    router.replace(`/search?${next.toString()}`, { scroll: false });
  };

  const results = useMemo(() => {
    const term = q.toLowerCase().trim();
    let r = products.filter(
      (p) =>
        (!term || [p.name, p.sku, p.desc, p.categoryName].some((s) => s?.toLowerCase().includes(term))) &&
        (selected.length === 0 || selected.includes(p.category)) &&
        (!inStock || p.stock > 0) &&
        (min === "" || p.price >= Number(min)) &&
        (max === "" || p.price <= Number(max))
    );
    const by = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      popular: (a, b) => b.sold - a.sold,
      name: (a, b) => a.name.localeCompare(b.name),
    }[sort];
    return by ? [...r].sort(by) : r;
  }, [products, q, selected.join(), inStock, min, max, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const title = q ? `Results for “${q}”` : selected.length === 1 ? getCategory(selected[0])?.name : "All products";
  const activeCount = selected.length + (inStock ? 1 : 0) + (min || max ? 1 : 0);

  const filters = (
    <div className="space-y-7">
      <div>
        <h3 className="mb-3 text-sm">Category</h3>
        <div className="space-y-1">
          {categories.map((c) => (
            <label key={c.slug} className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-surface2">
              <span className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#0E6B52]"
                  checked={selected.includes(c.slug)}
                  onChange={(e) => update({ category: e.target.checked ? [...selected, c.slug] : selected.filter((s) => s !== c.slug) })}
                />
                {c.name}
              </span>
              <span className="text-xs text-muted">{c.count}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm">Price</h3>
        <div className="flex items-center gap-2">
          <PriceInput placeholder="Min" defaultValue={min} onCommit={(v) => update({ min: v })} />
          <span className="text-muted">–</span>
          <PriceInput placeholder="Max" defaultValue={max} onCommit={(v) => update({ max: v })} />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-[#0E6B52]" checked={inStock} onChange={(e) => update({ inStock: e.target.checked ? "1" : "" })} />
        In stock only
      </label>

      {activeCount > 0 && (
        <button onClick={() => update({ category: [], inStock: "", min: "", max: "" })} className="text-sm font-semibold text-brand hover:underline">
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <main className="container-x py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl">{title}</h1>
          <p className="mt-1 text-sm">{results.length} product{results.length === 1 ? "" : "s"}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(true)} className="btn-ghost px-4 py-2 text-sm lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filters{activeCount ? ` (${activeCount})` : ""}
          </button>
          <select
            value={sort}
            onChange={(e) => update({ sort: e.target.value === "relevance" ? "" : e.target.value })}
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium focus:border-brand focus:outline-none"
            aria-label="Sort products"
          >
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden h-fit rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-36 lg:block">{filters}</aside>

        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setShowFilters(false)} />
            <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-surface p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl">Filters</h2>
                <button onClick={() => setShowFilters(false)} aria-label="Close filters" className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface2">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {filters}
              <button onClick={() => setShowFilters(false)} className="btn-primary mt-8 w-full">Show {results.length} products</button>
            </div>
          </div>
        )}

        <section>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-line bg-surface p-12 text-center">
              <h2 className="text-xl">No products found</h2>
              <p className="mt-2 text-sm">Try a different search or clear the filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {results.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function PriceInput({ defaultValue, onCommit, placeholder }) {
  return (
    <input
      key={defaultValue}
      type="number"
      min="0"
      inputMode="decimal"
      placeholder={placeholder}
      defaultValue={defaultValue}
      onBlur={(e) => e.target.value !== defaultValue && onCommit(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      className="w-full rounded-lg border border-line bg-page px-3 py-2 text-sm focus:border-brand focus:outline-none"
    />
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <SearchContent />
    </Suspense>
  );
}
