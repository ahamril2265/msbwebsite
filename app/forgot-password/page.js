"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import AuthShell from "../../components/AuthShell";
import { useStore } from "../../context/StoreContext";

// Password reset by email needs an email provider; until one is set up, customers contact the store.
export default function ForgotPasswordPage() {
  const { settings } = useStore();
  return (
    <AuthShell title="Forgot your password?" subtitle="Get in touch and we'll reset it for you.">
      <div className="space-y-3 rounded-2xl border border-line bg-surface p-6">
        {settings.storeEmail && (
          <a href={`mailto:${settings.storeEmail}?subject=Password%20reset`} className="flex items-center gap-3 font-medium text-ink hover:text-brand">
            <Mail className="h-5 w-5 text-brand" /> {settings.storeEmail}
          </a>
        )}
        {settings.storePhone && (
          <a href={`tel:${settings.storePhone}`} className="flex items-center gap-3 font-medium text-ink hover:text-brand">
            <Phone className="h-5 w-5 text-brand" /> {settings.storePhone}
          </a>
        )}
        <p className="pt-2 text-sm">Send us the email address on your account and we&apos;ll set a temporary password.</p>
      </div>
      <p className="mt-6 text-center text-sm">
        Remembered it? <Link href="/login" className="font-semibold text-brand hover:underline">Back to sign in</Link>
      </p>
    </AuthShell>
  );
}
