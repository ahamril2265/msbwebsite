"use client";

import Link from "next/link";
import { useState } from "react";
import { User, Menu, ShoppingBag, Heart, Phone } from "lucide-react";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import { categories } from "../lib/product";
import { useCart } from "../context/CartContext";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-display text-lg font-extrabold text-white">
        M
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg font-extrabold text-ink">Mustawa</span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Packaging</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [openMobile, setOpenMobile] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      {/* Utility strip */}
      <div className="hidden bg-ink text-xs text-white/80 md:block">
        <div className="container-x flex h-8 items-center justify-between">
          <span>Wholesale & retail packaging · Bulk pricing on request</span>
          <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> +123 456 7890</span>
        </div>
      </div>

      <div className="container-x flex h-16 items-center gap-4 md:gap-8">
        <Logo />

        <div className="hidden flex-1 md:flex">
          <SearchBar />
        </div>

        <nav className="ml-auto flex items-center gap-1">
          <IconLink href="/wishlist" label="Wishlist"><Heart className="h-5 w-5" /></IconLink>
          <IconLink href="/cart" label="Cart" className="relative grid">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-amber px-1 text-[10px] font-bold text-ink">{count}</span>
            )}
          </IconLink>
          <IconLink href="/profile" label="Account" className="hidden md:grid"><User className="h-5 w-5" /></IconLink>
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-surface2 md:hidden"
            onClick={() => setOpenMobile(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </div>

      {/* Category row */}
      <div className="hidden border-t border-line md:block">
        <div className="container-x flex h-11 items-center gap-6 text-sm font-medium">
          <Link href="/search" className="text-ink hover:text-brand">All products</Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/search?category=${c.slug}`} className="text-muted hover:text-brand">
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="container-x pb-3 md:hidden">
        <SearchBar />
      </div>

      <MobileMenu open={openMobile} onClose={() => setOpenMobile(false)} />
    </header>
  );
}

function IconLink({ href, label, children, className = "grid" }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`${className} h-10 w-10 place-items-center rounded-full text-ink hover:bg-surface2 hover:text-brand`}
    >
      {children}
    </Link>
  );
}
