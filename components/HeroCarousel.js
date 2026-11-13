"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroCarousel() {
  const promos = [
    { id: 5, name: "Favorite 1", price: 149, img: "/sample001.jpg", alt: "Promo Banner 1" },
    { id: 6, name: "Favorite 2", price: 179, img: "/sample002.jpg", alt: "Promo Banner 2" },
    { id: 7, name: "Favorite 3", price: 209, img: "/sample003.jpg", alt: "Promo Banner 3" },
    { id: 8, name: "Favorite 4", price: 249, img: "/sample004.jpg", alt: "Promo Banner 4" },
  ];

  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Auto-slide every 5s
  useEffect(() => {
    if (promos.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [promos.length]);

  const goToSlide = (index) => setCurrent(index);
  const prevSlide = () => setCurrent((current - 1 + promos.length) % promos.length);
  const nextSlide = () => setCurrent((current + 1) % promos.length);

  // 🚨 Guard
  if (!promos.length || !promos[current]) return null;

  // --- Swipe Handlers ---
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipe = 50; // minimum swipe distance in px

    if (distance > minSwipe) {
      // swiped left
      nextSlide();
    } else if (distance < -minSwipe) {
      // swiped right
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section className="relative w-full mb-12">
      {/* Title above carousel */}
      <h2 className="text-lg md:text-2xl font-bold text-accent mb-4 text-center">
        Hero Banner / Promotions
      </h2>

      {/* Carousel container */}
      <div
        className="relative w-full h-48 sm:h-64 md:h-[28rem] rounded-2xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={promos[current].img}
          alt={promos[current].alt}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-2xl transition-all duration-500 ease-in-out"
          priority
        />

        {/* Left Arrow (hidden on mobile) */}
        <button
          onClick={prevSlide}
          className="hidden sm:flex absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 
                     bg-darkCard p-2 rounded-full shadow hover:bg-surface2 z-10"
        >
          <ChevronLeft className="text-lightText w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow (hidden on mobile) */}
        <button
          onClick={nextSlide}
          className="hidden sm:flex absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 
                     bg-darkCard p-2 rounded-full shadow hover:bg-surface2 z-10"
        >
          <ChevronRight className="text-lightText w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-2 sm:bottom-3 w-full flex justify-center space-x-2">
          {promos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition ${
                index === current ? "bg-accent scale-110" : "bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
