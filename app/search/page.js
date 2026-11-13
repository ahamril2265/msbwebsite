// app/search/page.js
"use client";

import { products, getCategory } from "../../lib/product";
import ProductCard from "../../components/ProductCard";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Get query params ---
  const q = searchParams.get("q") || "";
  const categoryParams = searchParams.getAll("category");
  const minPrice = parseFloat(searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000");
  const minRating = parseFloat(searchParams.get("minRating") || "0");
  const inStock = searchParams.get("inStock") === "true";

  // --- Categories available ---
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // --- Controlled state for filters ---
  const [selectedCategories, setSelectedCategories] = useState(categoryParams);
  const [price, setPrice] = useState([minPrice, maxPrice]);
  const [rating, setRating] = useState(minRating);
  const [stockOnly, setStockOnly] = useState(inStock);

  // --- Handle filter apply ---
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    selectedCategories.forEach((c) => params.append("category", c));
    if (price[0] > 0) params.set("minPrice", price[0]);
    if (price[1] < 1000) params.set("maxPrice", price[1]);
    if (rating > 0) params.set("minRating", rating);
    if (stockOnly) params.set("inStock", "true");
    router.push(`/search?${params.toString()}`);
  };

  // --- Filter products ---
  let results = products.filter((p) => {
    const textMatch =
      !q ||
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.desc && p.desc.toLowerCase().includes(q.toLowerCase()));

    const catMatch =
  selectedCategories.length === 0 ||
  selectedCategories.some((c) => c.toLowerCase() === p.category.toLowerCase());


    const priceMatch = p.price >= price[0] && p.price <= price[1];
    const ratingMatch = p.rating >= rating;
    const stockMatch = !stockOnly || Math.random() > 0.2; // fake 80% in-stock

    return textMatch && catMatch && priceMatch && ratingMatch && stockMatch;
  });

  return (
    <main className="min-h-screen bg-darkBg text-lightText px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* --- Sidebar Filters --- */}
        <aside className="md:col-span-1 bg-darkCard p-6 rounded-lg space-y-6">
          <h2 className="text-lg font-semibold mb-2">Filters</h2>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium mb-2">Categories</h3>
            {categories.map((c) => (
  <label key={c} className="block text-sm">
    <input
      type="checkbox"
      className="mr-2"
      checked={selectedCategories.includes(c)}
      onChange={(e) => {
        if (e.target.checked) {
          setSelectedCategories([...selectedCategories, c]);
        } else {
          setSelectedCategories(selectedCategories.filter((cat) => cat !== c));
        }
      }}
    />
    {getCategory(c)?.name || c}
  </label>
))}

          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-medium mb-2">Price Range ($)</h3>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={price[0]}
                min="0"
                max={price[1]}
                onChange={(e) => setPrice([+e.target.value, price[1]])}
                className="w-20 bg-darkBg border border-line rounded px-2 py-1 text-sm"
              />
              <span>-</span>
              <input
                type="number"
                value={price[1]}
                min={price[0]}
                max="1000"
                onChange={(e) => setPrice([price[0], +e.target.value])}
                className="w-20 bg-darkBg border border-line rounded px-2 py-1 text-sm"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-sm font-medium mb-2">Minimum Rating</h3>
            {[0, 3, 4].map((r) => (
              <label key={r} className="block text-sm">
                <input
                  type="radio"
                  name="rating"
                  value={r}
                  className="mr-2"
                  checked={rating === r}
                  onChange={() => setRating(r)}
                />
                {r === 0 ? "Any" : `${r}★ & up`}
              </label>
            ))}
          </div>

          {/* Availability */}
          <div>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={stockOnly}
                onChange={() => setStockOnly(!stockOnly)}
              />
              In Stock Only
            </label>
          </div>

          {/* Apply Filters */}
          <button
            onClick={applyFilters}
            className="w-full bg-accent text-white py-2 rounded mt-4 hover:bg-accentDark transition"
          >
            Apply Filters
          </button>
        </aside>

        {/* --- Results --- */}
        <section className="md:col-span-3">
          <h1 className="text-2xl font-bold mb-6">
            Results {q ? `for “${q}”` : ""}
          </h1>
          {results.length === 0 ? (
            <div className="bg-darkCard p-6 rounded-lg">No results found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((p) => (
                <ProductCard product={p} key={`res-${p.id}`} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <SearchContent />
    </Suspense>
  );
}
