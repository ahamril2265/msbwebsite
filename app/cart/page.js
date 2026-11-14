"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Lock } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useStore } from "../../context/StoreContext";
import { formatPrice } from "../../lib/format";

export default function CartPage() {
  const { items, loaded, count, subtotal, shipping, setQty, removeFromCart } = useCart();
  const FREE_SHIPPING_OVER = useStore().settings.freeShippingOver;
  const total = subtotal + shipping;
  const toFree = Math.max(0, FREE_SHIPPING_OVER - subtotal);

  if (!loaded) return <main className="min-h-[60vh]" />;

  if (items.length === 0) {
    return (
      <main className="container-x py-24 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brandSoft text-brand">
          <ShoppingBag className="h-9 w-9" />
        </div>
        <h1 className="mt-6 text-3xl">Your cart is empty</h1>
        <p className="mx-auto mt-2 max-w-sm">Browse our carry bags, garbage bags and containers to get started.</p>
        <Link href="/search" className="btn-primary mt-8">Start shopping <ArrowRight className="h-4 w-4" /></Link>
      </main>
    );
  }

  return (
    <main className="container-x py-10">
      <h1 className="text-3xl md:text-4xl">Your cart</h1>
      <p className="mt-1 text-sm">{count} item{count === 1 ? "" : "s"}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Items */}
        <div className="space-y-6">
          {/* Free shipping progress */}
          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-brand" />
              {toFree > 0 ? (
                <span>Add <b className="text-ink">{formatPrice(toFree)}</b> more for free delivery</span>
              ) : (
                <span className="font-semibold text-brand">You&apos;ve unlocked free delivery</span>
              )}
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface2">
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_OVER) * 100)}%` }} />
            </div>
          </div>

          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {items.map(({ product: p, qty }) => (
              <li key={p.id} className="flex gap-4 p-4 sm:gap-6 sm:p-5">
                <Link href={`/product/${p.id}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-line bg-white sm:h-28 sm:w-28">
                  <Image src={p.img} alt={p.name} fill sizes="112px" className="object-contain p-2" />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">{p.categoryName}</span>
                      <Link href={`/product/${p.id}`} className="block font-semibold text-ink hover:text-brand">{p.name}</Link>
                      <span className="text-xs text-muted">SKU {p.sku} · {formatPrice(p.price)} each</span>
                    </div>
                    <button onClick={() => removeFromCart(p.id)} aria-label="Remove item" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-line">
                      <button onClick={() => setQty(p.id, qty - 1)} aria-label="Decrease quantity" className="grid h-9 w-9 place-items-center hover:text-brand"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                      <button onClick={() => setQty(p.id, Math.min(p.stock, qty + 1))} aria-label="Increase quantity" className="grid h-9 w-9 place-items-center hover:text-brand"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <span className="font-display text-lg font-extrabold">{formatPrice(p.price * qty)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link href="/search" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
            ← Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-36">
          <h2 className="text-xl">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Delivery" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
          </dl>
          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
            <span className="font-semibold">Total</span>
            <span className="font-display text-2xl font-extrabold">{formatPrice(total)}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Checkout <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs">
            <Lock className="h-3.5 w-3.5" /> Secure checkout
          </p>
          <div className="mt-5 rounded-xl bg-brandSoft p-4 text-xs text-brandDark">
            Ordering by the carton? <Link href="/quote" className="font-semibold underline">Ask for a bulk quote</Link>.
          </div>
        </aside>
      </div>
    </main>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
