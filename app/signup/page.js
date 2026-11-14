"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "../../components/AuthShell";
import { Field, FormError, sendJSON, formValues } from "../../components/Form";
import { useStore } from "../../context/StoreContext";

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useStore();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const v = formValues(e.currentTarget);
    if (v.password !== v.confirm) return setError("Passwords don't match.");
    setBusy(true);
    setError("");
    const { data, error } = await sendJSON("/api/auth/signup", v);
    setBusy(false);
    if (error) return setError(error);
    setUser(data.user);
    router.push("/");
    router.refresh();
  };

  return (
    <AuthShell title="Create your account" subtitle="Save your details, track orders and reorder in a few clicks.">
      <form onSubmit={submit} className="space-y-4">
        <FormError>{error}</FormError>
        <Field label="Full name" name="name" autoComplete="name" required />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
          <Field label="Business (optional)" name="company" autoComplete="organization" />
        </div>
        <Field label="Password" name="password" type="password" autoComplete="new-password" minLength={8} required hint="At least 8 characters." />
        <Field label="Confirm password" name="confirm" type="password" autoComplete="new-password" required />
        <button disabled={busy} className="btn-primary w-full disabled:opacity-60">{busy ? "Creating account…" : "Create account"}</button>
      </form>
      <p className="mt-6 text-center text-sm">
        Already have an account? <Link href="/login" className="font-semibold text-brand hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
