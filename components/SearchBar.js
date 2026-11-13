"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { products as allProducts } from "../lib/product"; // client can import this plain JS file

export default function SearchBar({ initial = "" }) {
  const router = useRouter();
  const [query, setQuery] = useState(initial || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const hits = allProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) ||
          (p.desc && p.desc.toLowerCase().includes(q))
      )
      .slice(0, 6);
    setSuggestions(hits);
    setOpen(hits.length > 0);
  }, [query]);

  // click outside to close
  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const submit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-lg" ref={ref}>
      <form onSubmit={submit} className="flex items-center gap-2 rounded-full border border-line bg-page px-4 py-2.5 focus-within:border-brand focus-within:bg-surface">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search carry bags, containers, SKU…"
          className="flex-1 bg-transparent text-lightText placeholder-mutedText focus:outline-none"
          onFocus={() => setOpen(suggestions.length > 0)}
        />
        <button type="submit" aria-label="Search">
          <Search className="w-5 h-5 text-mutedText" />
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-darkCard border border-line rounded-lg shadow z-30">
          <ul className="divide-y divide-line">
            {suggestions.map((s) => (
              <li key={`s-${s.id}`}>
                <a
                  onClick={() => router.push(`/product/${s.id}`)}
                  className="block px-4 py-2 cursor-pointer hover:bg-surface2 flex items-center gap-3"
                >
                  <div className="w-10 h-10 relative rounded overflow-hidden">
                    <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-mutedText">${s.price} • {s.categoryName}</div>
                  </div>
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={submit}
                className="w-full text-left px-4 py-2 text-sm text-accent hover:bg-surface2"
              >
                Search for “{query}”
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
