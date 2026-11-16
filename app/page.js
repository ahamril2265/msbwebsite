"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Truck, BadgeCheck, Boxes, Recycle } from "lucide-react";
import Carousel from "../components/Carousel";
import ComboCard from "../components/ComboCard";
import { useStore } from "../context/StoreContext";
import { recommendForUser } from "../lib/recommend";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";

const img = (folder, file) => encodeURI(`/Products/${folder}/${file}`);

export default function Home() {
  const { products, categories, combos } = useStore();
  const featuredCombos = combos.filter((c) => c.featured).slice(0, 3);
  const byCat = (slug) => products.filter((p) => p.category === slug);
  const { recentlyViewed } = useRecentlyViewed();
  const [userRecs, setUserRecs] = useState([]);
  useEffect(() => setUserRecs(recommendForUser(products, 10)), [products]);

  const bestSellers = [...products].sort((a, b) => b.sold - a.sold || b.featured - a.featured).slice(0, 10);

  return (
    <main>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brandSoft via-page to-page">
        <div className="container-x grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="eyebrow">Wholesale & retail packaging</span>
            <h1 className="mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Packaging that <span className="text-brand">carries</span> your business.
            </h1>
            <p className="mt-5 max-w-md text-lg">
              Carry bags, bin liners, HD string bags and food-grade PP containers — in every size your shop needs, at bulk prices.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/search" className="btn-primary">
                Shop all products <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#categories" className="btn-ghost">Browse categories</Link>
            </div>
            <dl className="mt-10 flex gap-8">
              {[
                [products.length, "Products"],
                [categories.length, "Product lines"],
                ["Bulk", "Pricing tiers"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-extrabold text-ink">{n}</dt>
                  <dd className="text-xs text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Product collage */}
          <div className="relative mx-auto grid w-full max-w-lg grid-cols-2 gap-4">
            <HeroTile src={img("Carry Bag", "B1316.png")} label="Carry Bags" className="col-span-2 aspect-[2/1]" />
            <HeroTile src={img("PP Container", "TEKAR16.jpg")} label="PP Containers" className="aspect-square" />
            <HeroTile src={img("Garbage Bag", "GB303950.png")} label="Garbage Bags" className="aspect-square" />
            <div className="absolute -left-4 bottom-8 hidden rotate-[-4deg] rounded-xl bg-amber px-4 py-2 font-display text-sm font-extrabold text-ink shadow-lift sm:block">
              Bulk discounts ✦
            </div>
          </div>
        </div>
      </section>

      {/* ─── Value strip ─── */}
      <section className="border-y border-line bg-surface">
        <div className="container-x grid grid-cols-2 gap-6 py-6 md:grid-cols-4">
          {[
            [Truck, "Fast dispatch", "Same-week delivery on stock items"],
            [Boxes, "Bulk ready", "Carton & pallet quantities"],
            [BadgeCheck, "Food-grade PP", "Safe for hot & cold food"],
            [Recycle, "Recyclable", "Recyclable polyethylene & PP"],
          ].map(([Icon, t, d]) => (
            <div key={t} className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brandSoft text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold text-ink">{t}</div>
                <div className="text-xs text-muted">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="container-x">
        {/* ─── Categories ─── */}
        <section id="categories" className="scroll-mt-32 py-14">
          <div className="mb-8 max-w-xl">
            <span className="eyebrow">Shop by category</span>
            <h2 className="mt-2 text-3xl md:text-4xl">Everything you need to pack, carry & store</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
            {categories.map((c, i) => (
              <Link
                key={c.slug}
                href={`/search?category=${c.slug}`}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface p-5 transition hover:border-brand hover:shadow-lift ${
                  i < 2 ? "md:col-span-3" : "md:col-span-2"
                } ${i === 4 ? "col-span-2 md:col-span-2" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl">{c.name}</h3>
                    <p className="mt-1 hidden text-sm sm:block">{c.tagline}</p>
                  </div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-page text-ink transition group-hover:bg-brand group-hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                <div className={`relative mt-4 ${i < 2 ? "h-48 md:h-56" : "h-36 md:h-44"}`}>
                  <Image src={c.image} alt={c.name} fill sizes="(max-width:768px) 50vw, 33vw" className="object-contain transition duration-500 group-hover:scale-105" />
                </div>
                <span className="mt-3 text-xs font-semibold text-muted">{c.count} products</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── Combo offers ─── */}
        {featuredCombos.length > 0 && (
          <section className="pb-6">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="eyebrow">Bundle & save</span>
                <h2 className="mt-2 text-3xl md:text-4xl">Combo offers</h2>
              </div>
              <Link href="/combos" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
                All combos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCombos.map((c) => <ComboCard key={c.id} combo={c} />)}
            </div>
          </section>
        )}

        {recentlyViewed.length > 0 && <Carousel title="Recently viewed" products={recentlyViewed} />}

        <Carousel title="Best sellers" subtitle="Our most-ordered packaging" href="/search" products={bestSellers} />

        {/* ─── Bulk banner ─── */}
        <section className="my-10 overflow-hidden rounded-3xl bg-brand text-white">
          <div className="grid items-center gap-6 p-8 md:grid-cols-[1.4fr_1fr] md:p-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">For shops & restaurants</span>
              <h2 className="mt-3 text-3xl text-white md:text-4xl">Ordering by the carton?</h2>
              <p className="mt-3 max-w-md text-white/80">
                Get tiered wholesale pricing on carry bags, garbage bags and PP containers. Tell us what you need and we&apos;ll quote within a day.
              </p>
              <Link href="/quote" className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 font-semibold text-ink hover:brightness-95">
                Request a bulk quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative hidden h-56 md:block">
              <div className="absolute inset-0 rounded-2xl bg-white/95" />
              <Image src={img("PP Container", "TEKAA750.jpg")} alt="PP containers" fill sizes="400px" className="object-contain p-6" />
            </div>
          </div>
        </section>

        {categories.filter((c) => c.count > 1).map((c) => (
          <Carousel key={c.slug} title={c.name} subtitle={c.tagline} href={`/search?category=${c.slug}`} products={byCat(c.slug)} />
        ))}

        {userRecs.length > 0 && <Carousel title="Picked for you" products={userRecs} />}
      </div>
    </main>
  );
}

function HeroTile({ src, label, className }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-line bg-white shadow-card ${className}`}>
      <Image src={src} alt={label} fill priority sizes="(max-width:768px) 90vw, 500px" className="object-contain p-4" />
      <span className="absolute bottom-3 left-3 rounded-full bg-surface/95 px-3 py-1 text-xs font-semibold text-ink shadow-card">{label}</span>
    </div>
  );
}
