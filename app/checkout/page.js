"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CreditCard, Landmark, Banknote, Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { useCart, shippingFor } from "../../context/CartContext";
import { formatPrice } from "../../lib/product";

const PAYMENT = [
  { id: "card", label: "Credit / debit card", icon: CreditCard },
  { id: "bank", label: "Bank transfer", icon: Landmark, note: "We'll email bank details with your order number." },
  { id: "cod", label: "Cash on delivery", icon: Banknote, note: "Pay the driver when your order arrives." },
];

export default function CheckoutPage() {
  const { items, loaded, subtotal, clearCart } = useCart();
  const [payment, setPayment] = useState("card");
  const [placed, setPlaced] = useState(null);

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  const placeOrder = (e) => {
    e.preventDefault();
    // TODO: send to backend / payment provider. For now, confirm locally.
    setPlaced({ number: "MW" + Date.now().toString().slice(-6), total });
    clearCart();
  };

  if (!loaded) return <main className="min-h-[60vh]" />;

  if (placed) {
    return (
      <main className="container-x py-24 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-brand" />
        <h1 className="mt-6 text-3xl">Thank you — order placed</h1>
        <p className="mt-2">Order <b className="text-ink">{placed.number}</b> · {formatPrice(placed.total)}</p>
        <p className="mx-auto mt-1 max-w-sm text-sm">We&apos;ll send a confirmation with delivery details shortly.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/orders" className="btn-ghost">View orders</Link>
          <Link href="/" className="btn-primary">Back to shop</Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container-x py-24 text-center">
        <h1 className="text-3xl">Nothing to check out</h1>
        <p className="mt-2">Your cart is empty.</p>
        <Link href="/search" className="btn-primary mt-8">Browse products</Link>
      </main>
    );
  }

  return (
    <main className="container-x py-10">
      <Link href="/cart" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </Link>
      <h1 className="mt-3 text-3xl md:text-4xl">Checkout</h1>

      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Section step="1" title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" autoComplete="name" required />
              <Field label="Phone" name="phone" type="tel" autoComplete="tel" required />
              <Field label="Email" name="email" type="email" autoComplete="email" className="sm:col-span-2" required />
              <Field label="Business name (optional)" name="company" autoComplete="organization" className="sm:col-span-2" />
            </div>
          </Section>

          <Section step="2" title="Delivery address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Street address" name="street" autoComplete="street-address" className="sm:col-span-2" required />
              <Field label="City" name="city" autoComplete="address-level2" required />
              <Field label="Postal code" name="postal" autoComplete="postal-code" required />
              <Field label="Country" name="country" autoComplete="country-name" className="sm:col-span-2" required />
            </div>
          </Section>

          <Section step="3" title="Payment">
            <div className="grid gap-3">
              {PAYMENT.map(({ id, label, icon: Icon, note }) => (
                <label
                  key={id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    payment === id ? "border-brand bg-brandSoft/60" : "border-line hover:border-brand/50"
                  }`}
                >
                  <input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)} className="mt-1 accent-[#0E6B52]" />
                  <Icon className="mt-0.5 h-5 w-5 text-brand" />
                  <span>
                    <span className="block font-semibold">{label}</span>
                    {note && <span className="block text-xs text-muted">{note}</span>}
                  </span>
                </label>
              ))}
            </div>

            {payment === "card" && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Name on card" name="ccname" autoComplete="cc-name" className="sm:col-span-2" />
                <Field label="Card number" name="ccnumber" autoComplete="cc-number" inputMode="numeric" className="sm:col-span-2" placeholder="1234 5678 9012 3456" />
                <Field label="Expiry" name="ccexp" autoComplete="cc-exp" placeholder="MM / YY" />
                <Field label="CVC" name="cccvc" autoComplete="cc-csc" inputMode="numeric" placeholder="123" />
              </div>
            )}
          </Section>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-36">
          <h2 className="text-xl">Your order</h2>
          <ul className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1">
            {items.map(({ product: p, qty }) => (
              <li key={p.id} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 rounded-lg border border-line bg-white">
                  <Image src={p.img} alt={p.name} fill sizes="56px" className="object-contain p-1" />
                  <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">{qty}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted">SKU {p.sku}</div>
                </div>
                <span className="text-sm font-semibold">{formatPrice(p.price * qty)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-display text-2xl font-extrabold">{formatPrice(total)}</span>
          </div>

          <button type="submit" className="btn-primary mt-6 w-full">
            <Lock className="h-4 w-4" /> Place order · {formatPrice(total)}
          </button>
          <p className="mt-3 text-center text-xs">By placing your order you agree to our terms.</p>
        </aside>
      </form>
    </main>
  );
}

function Section({ step, title, children }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="mb-5 flex items-center gap-3 text-lg">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-sm text-white">{step}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-line bg-page px-4 py-3 text-ink placeholder:text-muted/70 focus:border-brand focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/10"
      />
    </label>
  );
}
