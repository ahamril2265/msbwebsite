"use client";

import Link from "next/link";
import { Tag } from "lucide-react";
import ComboCard from "../../components/ComboCard";
import { useStore } from "../../context/StoreContext";

export default function CombosPage() {
  const { combos } = useStore();
  return (
    <main className="container-x py-10">
      <span className="eyebrow">Bundle & save</span>
      <h1 className="mt-2 text-3xl md:text-4xl">Combo offers</h1>
      <p className="mt-2 max-w-xl">Packaging that goes together, bundled at a lower price than buying each item on its own.</p>

      {combos.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-line bg-surface p-12 text-center">
          <Tag className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-3">No combo offers right now. Check back soon.</p>
          <Link href="/search" className="btn-primary mt-6">Browse all products</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {combos.map((c) => <ComboCard key={c.id} combo={c} />)}
        </div>
      )}
    </main>
  );
}
