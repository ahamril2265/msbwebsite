"use client";

import Link from "next/link";
import { X, Heart, ShoppingBag, Package, User, Settings, ChevronRight } from "lucide-react";
import { categories } from "../lib/product";

export default function MobileMenu({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-ink/40" onClick={onClose} />}

      <div
        className={`fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw] overflow-y-auto bg-surface shadow-lift transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="font-display text-lg font-extrabold">Menu</span>
          <button onClick={onClose} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-5">
          <p className="eyebrow mb-3">Shop by category</p>
          <ul className="space-y-1">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/search?category=${c.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 font-medium text-ink hover:bg-brandSoft hover:text-brand"
                >
                  {c.name}
                  <ChevronRight className="h-4 w-4 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <nav className="space-y-1 border-t border-line px-5 py-5">
          {[
            ["/wishlist", "Wishlist", Heart],
            ["/cart", "Cart", ShoppingBag],
            ["/orders", "My Orders", Package],
            ["/profile", "Profile", User],
            ["/settings", "Settings", Settings],
          ].map(([href, label, Icon]) => (
            <Link key={href} href={href} onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-ink hover:bg-surface2">
              <Icon className="h-5 w-5 text-muted" /> {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
