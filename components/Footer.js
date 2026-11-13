import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { categories } from "../lib/product";

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white/70">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-display text-lg font-extrabold text-white">M</span>
            <span className="font-display text-lg font-extrabold text-white">Mustawa</span>
          </div>
          <p className="mt-4 text-sm text-white/60">
            Everyday packaging for shops, restaurants and homes — carry bags, bin liners, string bags and food containers.
          </p>
        </div>

        <FooterCol title="Shop">
          {categories.map((c) => (
            <li key={c.slug}><Link href={`/search?category=${c.slug}`} className="hover:text-white">{c.name}</Link></li>
          ))}
        </FooterCol>

        <FooterCol title="Account">
          <li><Link href="/login" className="hover:text-white">Login</Link></li>
          <li><Link href="/signup" className="hover:text-white">Create account</Link></li>
          <li><Link href="/orders" className="hover:text-white">My orders</Link></li>
          <li><Link href="/wishlist" className="hover:text-white">Wishlist</Link></li>
        </FooterCol>

        <FooterCol title="Contact">
          <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@mustawa.com</li>
          <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +123 456 7890</li>
          <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Bulk & wholesale orders welcome</li>
        </FooterCol>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Mustawa. All rights reserved.</span>
          <span className="flex gap-4"><a href="#" className="hover:text-white">Privacy</a><a href="#" className="hover:text-white">Terms</a></span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-white">{title}</h4>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}
