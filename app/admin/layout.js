import { redirect } from "next/navigation";
import { currentUser } from "../../lib/auth";
import AdminNav from "./AdminNav";

export const metadata = { title: "Admin · Mustawa" };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const user = await currentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-page lg:grid lg:grid-cols-[240px_1fr]">
      <AdminNav name={user.name} />
      <div className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
    </div>
  );
}
