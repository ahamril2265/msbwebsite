"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/ProductCard";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { getProduct } = useStore();
  const items = wishlist.filter((p) => getProduct(p.id));

  return (
    <main className="container-x py-10">
      <h1 className="text-3xl md:text-4xl">Wishlist</h1>
      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-12 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted" />
          <h2 className="mt-4 text-xl">Nothing saved yet</h2>
          <p className="mt-1 text-sm">Tap the heart on any product to save it here.</p>
          <Link href="/search" className="btn-primary mt-6">Browse products</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </main>
  );
}
