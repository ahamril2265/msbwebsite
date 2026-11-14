import { redirect } from "next/navigation";

// Account settings live on the profile page.
export default function SettingsPage() {
  redirect("/profile");
}
