'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface HeroSlide {
  category: string;
  title: string;
  subtitle: string;
  cta: string;
  gradient: string;
  image: string;
  badge: string;
}

interface HeroSliderProps {
  categories: string[];
  onCategoryClick: (category: string) => void;
}

const categoryMeta: Record<string, { image: string; subtitle: string; gradient: string; badge: string }> = {
  'Food Consumer Goods': {
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=500&fit=crop&q=80',
    subtitle: 'Delicious snacks, beverages & everyday food essentials from top brands',
    gradient: 'from-orange-600 via-amber-600 to-yellow-500',
    badge: '🍫 Premium Selection',
  },
  'NON Food Consumer Goods': {
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=500&fit=crop&q=80',
    subtitle: 'Personal care, stationery & household essentials you can count on',
    gradient: 'from-blue-700 via-indigo-600 to-violet-500',
    badge: '🧴 Best Sellers',
  },
  'Pet Care Brands': {
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=500&fit=crop&q=80',
    subtitle: 'Premium nutrition & care products for your furry friends',
    gradient: 'from-teal-600 via-emerald-600 to-green-500',
    badge: '🐾 Pet Lovers Choice',
  },
};

const defaultMeta = {
  image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=500&fit=crop&q=80',
  subtitle: 'Discover amazing products at unbeatable prices',
  gradient: 'from-gray-800 via-gray-700 to-gray-600',
  badge: '🛍️ Shop Now',
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
      image: meta.image,
      badge: meta.badge,
    };
  });

  if (slides.length === 0) {
    slides.push({
      category: 'All',
      title: 'Welcome to Parvati',
      subtitle: 'Your one-stop shop for quality products',
      cta: 'Shop Now',
      gradient: 'from-blue-700 via-indigo-600 to-violet-500',
      image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=500&fit=crop&q=80',
      badge: '🛍️ Explore',
    });
  }

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  return (
    <section className="relative overflow-hidden bg-gray-900">
      <div className="relative h-[320px] sm:h-[400px] md:h-[480px]">
        {slides.map((slide, idx) => (
          <div
            key={slide.category}
            className={`absolute inset-0 transition-all duration-600 ease-in-out ${
              idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-[0.07]" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }} />

            {/* Content */}
            <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 sm:px-10 md:px-16">
              {/* Left text */}
              <div className="max-w-xl">
                <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  {slide.badge}
                </span>
                <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-[3.25rem] md:leading-[1.1]">
                  {slide.title}
                </h2>
                <p className="mb-8 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
                  {slide.subtitle}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onCategoryClick(slide.category)}
                    className="btn-press inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-gray-900 shadow-xl transition-all hover:shadow-2xl hover:scale-105"
                  >
                    {slide.cta}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onCategoryClick('All')}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-white/30 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/50"
                  >
                    View All
                  </button>
                </div>
              </div>

              {/* Right image */}
              <div className="hidden md:block relative">
                <div className="relative h-[320px] w-[340px] lg:h-[360px] lg:w-[380px]">
                  {/* Glow behind image */}
                  <div className="absolute inset-0 rounded-3xl bg-white/10 blur-2xl scale-110" />
                  {/* Image container */}
                  <div className="relative h-full w-full overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>
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
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all hover:bg-white/30 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all hover:bg-white/30 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === current ? 'h-3 w-10 bg-white shadow-lg' : 'h-3 w-3 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
