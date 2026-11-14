"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, LogOut } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Field, FormError, FormSuccess, sendJSON, formValues } from "../../components/Form";
import { logout } from "../../components/Navbar";

export default function ProfilePage() {
  const { user, setUser } = useStore();
  const router = useRouter();
  if (!user) return <main className="min-h-[60vh]" />;

  return (
    <main className="container-x max-w-3xl py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl">Account settings</h1>
          <p className="mt-1 text-sm">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/orders" className="btn-ghost px-4 py-2 text-sm"><Package className="h-4 w-4" /> My orders</Link>
          <button onClick={() => logout(setUser, router)} className="btn-ghost px-4 py-2 text-sm"><LogOut className="h-4 w-4" /> Sign out</button>
        </div>
      </div>

      <DetailsForm user={user} setUser={setUser} />
      <PasswordForm />
    </main>
  );
}

function DetailsForm({ user, setUser }) {
  const [msg, setMsg] = useState({});
  const submit = async (e) => {
    e.preventDefault();
    const { data, error } = await sendJSON("/api/auth/me", formValues(e.currentTarget), "PATCH");
    if (error) return setMsg({ error });
    setUser(data.user);
    setMsg({ ok: "Details saved." });
  };
  return (
    <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-line bg-surface p-6">
      <h2 className="text-lg">Your details</h2>
      <FormError>{msg.error}</FormError>
      <FormSuccess>{msg.ok}</FormSuccess>
      <Field label="Full name" name="name" defaultValue={user.name} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" name="phone" type="tel" defaultValue={user.phone || ""} />
        <Field label="Business" name="company" defaultValue={user.company || ""} />
      </div>
      <button className="btn-primary">Save details</button>
    </form>
  );
}

function PasswordForm() {
  const [msg, setMsg] = useState({});
  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const v = formValues(form);
    if (v.newPassword !== v.confirm) return setMsg({ error: "New passwords don't match." });
    const { error } = await sendJSON("/api/auth/me", { currentPassword: v.currentPassword, newPassword: v.newPassword }, "PATCH");
    if (error) return setMsg({ error });
    form.reset();
    setMsg({ ok: "Password changed." });
  };
  return (
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-line bg-surface p-6">
      <h2 className="text-lg">Change password</h2>
      <FormError>{msg.error}</FormError>
      <FormSuccess>{msg.ok}</FormSuccess>
      <Field label="Current password" name="currentPassword" type="password" autoComplete="current-password" required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="New password" name="newPassword" type="password" autoComplete="new-password" minLength={8} required />
        <Field label="Confirm new password" name="confirm" type="password" autoComplete="new-password" required />
      </div>
      <button className="btn-primary">Update password</button>
    </form>
  );
}
