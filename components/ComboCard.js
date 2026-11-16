"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, ShoppingBag, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";

// A combo offer: its photo (or a collage of its products), contents, price and saving.
export default function ComboCard({ combo, className = "" }) {
  const { addComboToCart } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = combo.stock <= 0;
  const pct = combo.compareAt > 0 ? Math.round((combo.savings / combo.compareAt) * 100) : 0;

  const add = () => {
    addComboToCart(combo);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className={`flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:-translate-y-0.5 hover:shadow-lift ${className}`}>
      <div className="relative aspect-[4/3] bg-white">
        {combo.img ? (
          <Image src={combo.img} alt={combo.name} fill sizes="(max-width: 640px) 100vw, 400px" className="object-contain p-4" />
        ) : (
          <div className={`grid h-full gap-1 p-3 ${combo.items.length > 2 ? "grid-cols-2 grid-rows-2" : "grid-cols-2"}`}>
            {combo.items.slice(0, 4).map((i) => (
              <div key={i.productId} className="relative">
                <Image src={i.img} alt="" fill sizes="200px" className="object-contain p-2" />
              </div>
            ))}
          </div>
        )}
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber px-2.5 py-1 text-[11px] font-bold text-ink">
          <Tag className="h-3 w-3" /> {pct > 0 ? `Save ${pct}%` : "Combo"}
        </span>
        {soldOut && <span className="absolute right-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">Out of stock</span>}
      </div>

      <div className="flex flex-1 flex-col border-t border-line p-5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">Combo offer</span>
        <h3 className="mt-1 text-lg">{combo.name}</h3>
        {combo.desc && <p className="mt-1 line-clamp-2 text-sm">{combo.desc}</p>}

        <ul className="mt-3 space-y-1 text-sm">
          {combo.items.map((i) => (
            <li key={i.productId} className="flex gap-2">
              <span className="font-semibold text-brand">{i.qty}×</span>
              <span className="text-ink">{i.name}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            {combo.savings > 0 && <div className="text-sm text-muted line-through">{formatPrice(combo.compareAt)}</div>}
            <div className="font-display text-2xl font-extrabold text-ink">{formatPrice(combo.price)}</div>
          </div>
          <button onClick={add} disabled={soldOut} className="btn-primary px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50">
            {added ? <><Check className="h-4 w-4" /> Added</> : <><ShoppingBag className="h-4 w-4" /> Add combo</>}
          </button>
        </div>
      </div>
    </article>
  );
}
