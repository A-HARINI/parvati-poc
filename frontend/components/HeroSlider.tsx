'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  category: string;
  title: string;
  subtitle: string;
  cta: string;
  gradient: string;
  icon: string;
}

interface HeroSliderProps {
  categories: string[];
  onCategoryClick: (category: string) => void;
}

const categoryMeta: Record<string, { icon: string; subtitle: string; gradient: string }> = {
  'Food Consumer Goods': {
    icon: '🍫',
    subtitle: 'Discover delicious snacks, beverages & everyday food items from premium brands',
    gradient: 'from-amber-600 to-orange-700',
  },
  'NON Food Consumer Goods': {
    icon: '🧴',
    subtitle: 'Personal care, stationery & household essentials you can count on',
    gradient: 'from-blue-600 to-indigo-700',
  },
  'Pet Care Brands': {
    icon: '🐾',
    subtitle: 'Premium nutrition & care products to keep your pets happy and healthy',
    gradient: 'from-emerald-600 to-teal-700',
  },
};

const defaultMeta = {
  icon: '🛍️',
  subtitle: 'Discover amazing products at great prices',
  gradient: 'from-gray-700 to-gray-900',
};

export default function HeroSlider({ categories, onCategoryClick }: HeroSliderProps) {
  const slides: HeroSlide[] = categories.slice(0, 3).map((cat) => {
    const meta = categoryMeta[cat] || defaultMeta;
    return {
      category: cat,
      title: cat,
      subtitle: meta.subtitle,
      cta: `Shop ${cat}`,
      gradient: meta.gradient,
      icon: meta.icon,
    };
  });

  // Fallback if no categories
  if (slides.length === 0) {
    slides.push({
      category: 'All',
      title: 'Welcome to Parvati',
      subtitle: 'Your one-stop shop for the best products',
      cta: 'Shop Now',
      gradient: 'from-blue-600 to-indigo-700',
      icon: '🛍️',
    });
  }

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 sm:mx-6 mt-5">
      <div className="relative h-[280px] sm:h-[340px] md:h-[400px]">
        {slides.map((slide, idx) => (
          <div
            key={slide.category}
            className={`absolute inset-0 flex items-center transition-all duration-500 ease-in-out bg-gradient-to-br ${slide.gradient} ${
              idx === current ? 'opacity-100 translate-x-0' : idx < current ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'
            }`}
          >
            {/* Decorative shapes */}
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
              <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-white/30" />
              <div className="absolute right-32 bottom-10 h-24 w-24 rounded-full bg-white/20" />
              <div className="absolute right-60 top-20 h-16 w-16 rounded-full bg-white/25" />
            </div>

            <div className="relative z-10 flex w-full items-center justify-between px-8 sm:px-12 md:px-16">
              <div className="max-w-lg">
                <span className="mb-3 inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                  Featured Category
                </span>
                <h2 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
                  {slide.title}
                </h2>
                <p className="mb-6 text-base text-white/80 sm:text-lg">
                  {slide.subtitle}
                </p>
                <button
                  onClick={() => onCategoryClick(slide.category)}
                  className="btn-press inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-gray-900 shadow-lg transition hover:shadow-xl hover:scale-105"
                >
                  {slide.cta}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="hidden md:flex items-center justify-center">
                <span className="text-[120px] leading-none drop-shadow-lg select-none">
                  {slide.icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/40"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/40"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
