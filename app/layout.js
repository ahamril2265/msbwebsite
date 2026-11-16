import "./globals.css";
import { Manrope, Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { StoreProvider } from "../context/StoreContext";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import { RecentlyViewedProvider } from "../context/RecentlyViewedContext";
import { loadCatalog } from "../lib/catalog";
import { currentUser, publicUser } from "../lib/auth";

const display = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

// Catalog and session are read per request so admin edits show up immediately.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mustawa — Packaging Bags & Containers",
  description: "Carry bags, garbage bags, HD string bags, PP containers and PP plastic — wholesale packaging made simple.",
};

export default async function RootLayout({ children }) {
  const [{ products, categories, settings, combos }, user] = await Promise.all([loadCatalog(), currentUser()]);

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-page text-ink" suppressHydrationWarning>
        <StoreProvider products={products} combos={combos} categories={categories} settings={settings} user={publicUser(user)}>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <Navbar />
                {children}
                <Footer />
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
