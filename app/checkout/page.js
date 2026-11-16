"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Landmark, Banknote, Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useStore } from "../../context/StoreContext";
import { formatPrice } from "../../lib/format";
import { Field, FormError, sendJSON, formValues } from "../../components/Form";

const PAYMENT = [
  { id: "bank", label: "Bank transfer", icon: Landmark, note: "We'll email our bank details with your order number. Your order ships once payment arrives." },
  { id: "cod", label: "Cash on delivery", icon: Banknote, note: "Pay the driver when your order arrives." },
];

export default function CheckoutPage() {
  const { items, orderLines, loaded, subtotal, shipping, clearCart } = useCart();
  const { user } = useStore();
  const [payment, setPayment] = useState("bank");
  const [placed, setPlaced] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const total = subtotal + shipping;

  const placeOrder = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { data, error } = await sendJSON("/api/orders", {
      ...formValues(e.currentTarget),
      payment,
      items: orderLines,
    });
    setBusy(false);
    if (error) return setError(error);
    setPlaced(data.order);
    clearCart();
    window.scrollTo(0, 0);
  };

  if (!loaded) return <main className="min-h-[60vh]" />;

  if (placed) {
    return (
      <main className="container-x py-24 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-brand" />
        <h1 className="mt-6 text-3xl">Thank you, order placed</h1>
        <p className="mt-2">Order <b className="text-ink">{placed.number}</b> · {formatPrice(placed.total)}</p>
        <p className="mx-auto mt-1 max-w-md text-sm">
          {placed.payment === "bank"
            ? `We'll email bank transfer details to ${placed.email}. Please use ${placed.number} as the payment reference.`
            : "Please have the payment ready when your order arrives."}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          {user ? <Link href={`/orders/${placed.number}`} className="btn-ghost">View order</Link> : <Link href="/signup" className="btn-ghost">Create an account</Link>}
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
      {!user && (
        <p className="mt-2 text-sm">
          Checking out as a guest. <Link href="/login?next=/checkout" className="font-semibold text-brand hover:underline">Sign in</Link> to save this order to your account.
        </p>
      )}

      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Section step="1" title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" autoComplete="name" defaultValue={user?.name} required />
              <Field label="Phone" name="phone" type="tel" autoComplete="tel" defaultValue={user?.phone || ""} required />
              <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={user?.email} className="sm:col-span-2" required />
              <Field label="Business name (optional)" name="company" autoComplete="organization" defaultValue={user?.company || ""} className="sm:col-span-2" />
            </div>
          </Section>

          <Section step="2" title="Delivery address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Street address" name="street" autoComplete="street-address" className="sm:col-span-2" required />
              <Field label="City" name="city" autoComplete="address-level2" required />
              <Field label="Postal code" name="postal" autoComplete="postal-code" required />
              <Field label="Country" name="country" autoComplete="country-name" className="sm:col-span-2" required />
              <Field label="Delivery notes (optional)" name="notes" as="textarea" rows={2} className="sm:col-span-2" />
            </div>
          </Section>

          <Section step="3" title="Payment">
            <div className="grid gap-3">
              {PAYMENT.map(({ id, label, icon: Icon, note }) => (
                <label
                  key={id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${payment === id ? "border-brand bg-brandSoft/60" : "border-line hover:border-brand/50"}`}
                >
                  <input type="radio" name="paymentChoice" checked={payment === id} onChange={() => setPayment(id)} className="mt-1 accent-[#0E6B52]" />
                  <Icon className="mt-0.5 h-5 w-5 text-brand" />
                  <span>
                    <span className="block font-semibold">{label}</span>
                    <span className="block text-xs text-muted">{note}</span>
                  </span>
                </label>
              ))}
            </div>
          </Section>
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-36">
          <h2 className="text-xl">Your order</h2>
          <ul className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1">
            {items.map((it) => (
              <li key={it.key} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 rounded-lg border border-line bg-white">
                  <Image src={it.img} alt={it.name} fill sizes="56px" className="object-contain p-1" />
                  <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">{it.qty}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{it.combo && <span className="mr-1 text-[10px] font-bold text-brand">COMBO</span>}{it.name}</div>
                  <div className="truncate text-xs text-muted">{it.sub}</div>
                </div>
                <span className="text-sm font-semibold">{formatPrice(it.price * it.qty)}</span>
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

          <div className="mt-5"><FormError>{error}</FormError></div>
          <button type="submit" disabled={busy} className="btn-primary mt-4 w-full disabled:opacity-60">
            <Lock className="h-4 w-4" /> {busy ? "Placing order…" : `Place order · ${formatPrice(total)}`}
          </button>
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
