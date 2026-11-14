"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Check } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../lib/format";

export default function ProductCard({ product: saved, className = "" }) {
  const { getProduct } = useStore();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Wishlist / recently-viewed hold old copies; always show live details.
  const product = getProduct(saved.id);
  if (!product) return null;

  const isFav = wishlist.some((p) => p.id === product.id);
  const soldOut = product.stock <= 0;

  const add = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:-translate-y-0.5 hover:shadow-lift ${className}`}>
      <button
        onClick={() => toggleWishlist(product)}
        aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-surface/90 shadow-card hover:scale-105"
      >
        <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : "text-muted"}`} />
      </button>

      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square bg-white">
          <Image src={product.img} alt={product.name} fill sizes="(max-width: 640px) 50vw, 240px" className="object-contain p-5 transition duration-300 group-hover:scale-105" />
          {soldOut && <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">Out of stock</span>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col border-t border-line p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">{product.categoryName}</span>
        <Link href={`/product/${product.id}`} className="mt-1 line-clamp-2 font-semibold text-ink hover:text-brand">{product.name}</Link>
        <span className="mt-0.5 text-xs text-muted">SKU {product.sku}</span>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="font-display text-lg font-extrabold text-ink">{formatPrice(product.price)}</div>
          <button
            onClick={add}
            disabled={soldOut}
            aria-label="Add to cart"
            className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white hover:bg-brandDark disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
          >
            {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
