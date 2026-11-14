"use client";

// Shared form pieces for storefront and admin.

export function Field({ label, hint, className = "", as = "input", children, ...props }) {
  const Tag = as;
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children || (
        <Tag
          {...props}
          className="w-full rounded-xl border border-line bg-page px-4 py-3 text-ink placeholder:text-muted/70 focus:border-brand focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/10"
        />
      )}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function FormError({ children }) {
  if (!children) return null;
  return <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{children}</div>;
}

export function FormSuccess({ children }) {
  if (!children) return null;
  return <div role="status" className="rounded-xl border border-brand/20 bg-brandSoft px-4 py-3 text-sm text-brandDark">{children}</div>;
}

// POST/PATCH JSON and return { data } or { error }.
export async function sendJSON(url, body, method = "POST") {
  try {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    return res.ok ? { data } : { error: data.error || "Something went wrong. Please try again." };
  } catch {
    return { error: "Couldn't reach the server. Check your connection." };
  }
}

export const formValues = (form) => Object.fromEntries(new FormData(form).entries());
