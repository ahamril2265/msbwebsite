"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, MessageSquareQuote, Settings, Store, LogOut } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { logout } from "../../components/Navbar";

const LINKS = [
  ["/admin", "Dashboard", LayoutDashboard],
  ["/admin/orders", "Orders", ShoppingCart],
  ["/admin/products", "Products", Package],
  ["/admin/quotes", "Quote requests", MessageSquareQuote],
  ["/admin/settings", "Settings", Settings],
];

export default function AdminNav({ name }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser } = useStore();
  const active = (href) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <aside className="sticky top-0 z-30 border-b border-white/10 bg-ink text-white lg:h-screen lg:border-b-0">
      <div className="flex items-center justify-between px-4 py-4 lg:px-5 lg:py-6">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-display text-lg font-extrabold">M</span>
          <span className="leading-none">
            <span className="block font-display font-extrabold">Mustawa</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Admin</span>
          </span>
        </Link>
      </div>

      <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
        {LINKS.map(([href, label, Icon]) => (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active(href) ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </nav>

      <div className="hidden border-t border-white/10 px-3 py-4 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
        <div className="px-3 pb-3 text-xs text-white/50">Signed in as <span className="text-white/80">{name}</span></div>
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white">
          <Store className="h-4 w-4" /> View store
        </Link>
        <button onClick={() => logout(setUser, router)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
