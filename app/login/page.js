"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "../../components/AuthShell";
import { Field, FormError, sendJSON, formValues } from "../../components/Form";
import { useStore } from "../../context/StoreContext";

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const { setUser } = useStore();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { data, error } = await sendJSON("/api/auth/login", formValues(e.currentTarget));
    setBusy(false);
    if (error) return setError(error);
    setUser(data.user);
    // Only follow same-site paths.
    const dest = next?.startsWith("/") && !next.startsWith("//") ? next : data.user.role === "admin" ? "/admin" : "/";
    router.push(dest);
    router.refresh();
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to see your orders and check out faster.">
      <form onSubmit={submit} className="space-y-4">
        <FormError>{error}</FormError>
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field label="Password" name="password" type="password" autoComplete="current-password" required />
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm font-medium text-brand hover:underline">Forgot password?</Link>
        </div>
        <button disabled={busy} className="btn-primary w-full disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
      <p className="mt-6 text-center text-sm">
        New to Mustawa? <Link href="/signup" className="font-semibold text-brand hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
