"use client";

import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/ProductCard";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <main className="min-h-screen bg-darkBg text-lightText px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="bg-darkCard p-6 rounded-lg">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((p) => (
            <ProductCard key={`wish-${p.id}`} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
