export const CURRENCY = "$";
export const formatPrice = (n) => `${CURRENCY}${Number(n || 0).toFixed(2)}`;

export const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
export const PAYMENT_LABELS = { bank: "Bank transfer", cod: "Cash on delivery" };

export const statusStyle = (s) =>
  ({
    pending: "bg-amber/20 text-[#8a5a00]",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-brandSoft text-brand",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-700",
    new: "bg-amber/20 text-[#8a5a00]",
    contacted: "bg-blue-100 text-blue-800",
    closed: "bg-surface2 text-muted",
  })[s] || "bg-surface2 text-muted";

export const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
