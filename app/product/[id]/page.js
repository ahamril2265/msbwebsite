"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Heart, Minus, Plus, ShoppingBag, Star, Truck, ShieldCheck, Boxes, Check } from "lucide-react";
import { products, formatPrice, getCategory } from "../../../lib/product";
import { recommendByCategory } from "../../../lib/recommend";
import ProductCard from "../../../components/ProductCard";
import { useRecentlyViewed } from "../../../context/RecentlyViewedContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useCart } from "../../../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const productId = parseInt(id, 10);
  const product = products.find((p) => p.id === productId);

  const { addRecentlyViewed } = useRecentlyViewed();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!product) return;
    addRecentlyViewed(product);
    localStorage.setItem("lastCategory", product.category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  if (!product) {
    return (
      <main className="container-x py-24 text-center">
        <h1 className="text-2xl">Product not found</h1>
        <Link href="/search" className="btn-primary mt-6">Browse all products</Link>
      </main>
    );
  }

  const category = getCategory(product.category);
  const siblings = products.filter((p) => p.category === product.category);
  const related = recommendByCategory(productId, 8);
  const isFav = wishlist.some((p) => p.id === product.id);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <main className="container-x py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link href="/" className="hover:text-brand">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/search?category=${product.category}`} className="hover:text-brand">{product.categoryName}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-ink">{product.sku}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-white">
            <Image src={product.img} alt={product.name} fill priority sizes="(max-width:1024px) 100vw, 600px" className="object-contain p-8" />
            <button
              onClick={() => toggleWishlist(product)}
              aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-surface shadow-card hover:scale-105"
            >
              <Heart className={`h-5 w-5 ${isFav ? "fill-red-500 text-red-500" : "text-muted"}`} />
            </button>
          </div>
        </div>

        {/* Details */}
        <div>
          <span className="eyebrow">{product.categoryName}</span>
          <h1 className="mt-2 text-3xl md:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber text-amber" /> <b className="text-ink">{product.rating}</b>
            </span>
            <span>SKU {product.sku}</span>
            <span className="flex items-center gap-1 text-brand"><Check className="h-4 w-4" /> In stock</span>
          </div>

          <div className="mt-6 font-display text-4xl font-extrabold">{formatPrice(product.price)}</div>
          <p className="mt-1 text-sm">per pack · bulk pricing available</p>

          <p className="mt-6">{product.desc}</p>

          {/* Size / variant picker — the other SKUs in this category */}
          {siblings.length > 1 && (
            <div className="mt-8">
              <div className="mb-3 text-sm font-semibold">Size / variant</div>
              <div className="flex flex-wrap gap-2">
                {siblings.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => router.push(`/product/${s.id}`)}
                    className={`rounded-xl border px-3.5 py-2 text-left text-sm font-medium leading-tight transition ${
                      s.id === product.id ? "border-brand bg-brandSoft text-brand" : "border-line bg-surface text-ink hover:border-brand"
                    }`}
                  >
                    {s.size || s.sku}
                    {s.size && <span className="block text-[10px] font-normal text-muted">{s.sku}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-line bg-surface">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="grid h-12 w-12 place-items-center hover:text-brand">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity" className="grid h-12 w-12 place-items-center hover:text-brand">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button onClick={handleAdd} className="btn-primary flex-1 sm:flex-none">
              {added ? <><Check className="h-4 w-4" /> Added</> : <><ShoppingBag className="h-4 w-4" /> Add to cart</>}
            </button>
            <button onClick={() => { addToCart(product, qty); router.push("/checkout"); }} className="btn-ghost flex-1 sm:flex-none">
              Buy now
            </button>
          </div>

          {/* Perks */}
          <div className="mt-8 grid gap-3 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-3">
            {[
              [Truck, "Fast dispatch", "Ships within 1–3 days"],
              [Boxes, "Bulk orders", "Carton pricing on request"],
              [ShieldCheck, "Quality checked", "Consistent gauge & seal"],
            ].map(([Icon, t, d]) => (
              <div key={t} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <div className="text-sm font-semibold">{t}</div>
                  <div className="text-xs text-muted">{d}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Specs */}
          <dl className="mt-8 divide-y divide-line rounded-2xl border border-line bg-surface text-sm">
            {[
              ["Category", category?.name],
              ["SKU", product.sku],
              ["Size", product.size || "See image"],
              ["Material", product.category.startsWith("pp") ? "Polypropylene (PP)" : "Polyethylene (HDPE/LDPE)"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between px-5 py-3">
                <dt className="text-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-2xl md:text-3xl">More {product.categoryName.toLowerCase()}s</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </main>
  );
}
