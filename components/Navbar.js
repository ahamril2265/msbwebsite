"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User, Menu, ShoppingBag, Heart, Phone, LogOut, Package, LayoutDashboard, Settings } from "lucide-react";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-display text-lg font-extrabold text-white">M</span>
      <span className="leading-none">
        <span className="block font-display text-lg font-extrabold text-ink">Mustawa</span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Packaging</span>
      </span>
    </Link>
  );
}

export async function logout(setUser, router) {
  await fetch("/api/auth/logout", { method: "POST" });
  setUser(null);
  router.push("/");
  router.refresh();
}

export default function Navbar() {
  const [openMobile, setOpenMobile] = useState(false);
  const { count } = useCart();
  const { categories, combos, settings, user } = useStore();
  const pathname = usePathname();

  // The admin area has its own chrome.
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="hidden bg-ink text-xs text-white/80 md:block">
        <div className="container-x flex h-8 items-center justify-between">
          <span>
            Wholesale & retail packaging ·{" "}
            <Link href="/quote" className="underline-offset-2 hover:text-white hover:underline">Request a bulk quote</Link>
          </span>
          {settings.storePhone && (
            <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {settings.storePhone}</span>
          )}
        </div>
      </div>

      <div className="container-x flex h-16 items-center gap-4 md:gap-8">
        <Logo />
        <div className="hidden flex-1 md:flex"><SearchBar /></div>

        <nav className="ml-auto flex items-center gap-1">
          <IconLink href="/wishlist" label="Wishlist"><Heart className="h-5 w-5" /></IconLink>
          <IconLink href="/cart" label="Cart" className="relative grid">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-amber px-1 text-[10px] font-bold text-ink">{count}</span>
            )}
          </IconLink>
          {user ? (
            <AccountMenu />
          ) : (
            <Link href="/login" className="ml-2 hidden rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brandDark md:block">
              Sign in
            </Link>
          )}
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-surface2 md:hidden"
            onClick={() => setOpenMobile(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </div>

      <div className="hidden border-t border-line md:block">
        <div className="container-x flex h-11 items-center gap-6 text-sm font-medium">
          <Link href="/search" className="text-ink hover:text-brand">All products</Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/search?category=${c.slug}`} className="text-muted hover:text-brand">{c.name}</Link>
          ))}
          {combos.length > 0 && <Link href="/combos" className="font-semibold text-brand hover:underline">Combo offers</Link>}
          <Link href="/quote" className="ml-auto text-brand hover:underline">Bulk orders</Link>
        </div>
      </div>

      <div className="container-x pb-3 md:hidden"><SearchBar /></div>

      <MobileMenu open={openMobile} onClose={() => setOpenMobile(false)} />
    </header>
  );
}

function AccountMenu() {
  const { user, setUser } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const item = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface2";

  return (
    <div className="relative hidden md:block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="ml-1 flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm font-medium hover:border-brand"
        aria-expanded={open}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brandSoft font-semibold text-brand">
          {user.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
        </span>
        {user.name.split(" ")[0]}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-line bg-surface p-2 shadow-lift" onClick={() => setOpen(false)}>
          <div className="px-3 py-2">
            <div className="truncate text-sm font-semibold">{user.name}</div>
            <div className="truncate text-xs text-muted">{user.email}</div>
          </div>
          <div className="my-1 border-t border-line" />
          {user.role === "admin" && (
            <Link href="/admin" className={`${item} font-semibold text-brand`}><LayoutDashboard className="h-4 w-4" /> Admin panel</Link>
          )}
          <Link href="/orders" className={item}><Package className="h-4 w-4 text-muted" /> My orders</Link>
          <Link href="/profile" className={item}><Settings className="h-4 w-4 text-muted" /> Account settings</Link>
          <button onClick={() => logout(setUser, router)} className={`${item} w-full`}>
            <LogOut className="h-4 w-4 text-muted" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function IconLink({ href, label, children, className = "grid" }) {
  return (
    <Link href={href} aria-label={label} className={`${className} h-10 w-10 place-items-center rounded-full text-ink hover:bg-surface2 hover:text-brand`}>
      {children}
    </Link>
  );
}
