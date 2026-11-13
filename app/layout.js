import "./globals.css";
import { Manrope, Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { WishlistProvider } from "../context/WishlistContext";
import { RecentlyViewedProvider } from "../context/RecentlyViewedContext";
import { CartProvider } from "../context/CartContext";

const display = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: "Mustawa — Packaging Bags & Containers",
  description: "Carry bags, garbage bags, HD string bags, PP containers and PP plastic — wholesale packaging made simple.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-page text-ink" suppressHydrationWarning>
        <CartProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            <Navbar />
            {children}
            <Footer />
          </RecentlyViewedProvider>
        </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
