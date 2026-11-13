"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function Carousel({ title, subtitle, href, products }) {
  const rowRef = useRef(null);
  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * 520, behavior: "smooth" });

  if (!products?.length) return null;

  return (
    <section className="py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {href && (
            <Link href={href} className="mr-2 text-sm font-semibold text-brand hover:underline">
              View all
            </Link>
          )}
          <ArrowBtn onClick={() => scroll(-1)} label="Scroll left"><ChevronLeft className="h-5 w-5" /></ArrowBtn>
          <ArrowBtn onClick={() => scroll(1)} label="Scroll right"><ChevronRight className="h-5 w-5" /></ArrowBtn>
        </div>
      </div>

      <div ref={rowRef} className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {products.map((p, i) => (
          <ProductCard key={`${title}-${p.id}-${i}`} product={p} className="w-[46%] shrink-0 snap-start sm:w-56 lg:w-60" />
        ))}
      </div>
    </section>
  );
}

function ArrowBtn({ onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="hidden h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink hover:border-brand hover:text-brand sm:grid"
    >
      {children}
    </button>
  );
}
