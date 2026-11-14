"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FormError, FormSuccess, sendJSON, formValues } from "../../../components/Form";
import { PageHeader, Card } from "../ui";

export default function AdminSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState(null);
  const [msg, setMsg] = useState({});

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => setSettings(d.settings));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const { data, error } = await sendJSON("/api/admin/settings", formValues(e.currentTarget), "PUT");
    if (error) return setMsg({ error });
    setSettings(data.settings);
    setMsg({ ok: "Settings saved. The store is using them now." });
    router.refresh();
  };

  if (!settings) return <p className="text-sm">Loading…</p>;

  return (
    <form onSubmit={submit} className="max-w-2xl">
      <PageHeader title="Settings" />
      <div className="mb-6 space-y-2">
        <FormError>{msg.error}</FormError>
        <FormSuccess>{msg.ok}</FormSuccess>
      </div>
      <div className="space-y-6">
        <Card title="Contact details">
          <p className="-mt-2 mb-4 text-sm">Shown in the store header, footer and password help page.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone" name="storePhone" defaultValue={settings.storePhone} />
            <Field label="Email" name="storeEmail" type="email" defaultValue={settings.storeEmail} />
          </div>
        </Card>
        <Card title="Delivery">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Delivery fee" name="shippingFee" type="number" min="0" step="0.01" defaultValue={settings.shippingFee} required />
            <Field label="Free delivery on orders over" name="freeShippingOver" type="number" min="0" step="0.01" defaultValue={settings.freeShippingOver} required hint="Set to 0 to always deliver free." />
          </div>
        </Card>
        <button className="btn-primary">Save settings</button>
      </div>
    </form>
  );
}
