'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const AUTOPLAY_MS = 6000;

interface HeroSlide {
  category: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  badge: string;
}

interface HeroSliderProps {
  categories: string[];
  onCategoryClick: (category: string) => void;
}

const categoryMeta: Record<string, { image: string; subtitle: string; badge: string }> = {
  'Food Consumer Goods': {
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1600&h=800&fit=crop&q=80',
    subtitle: 'Delicious snacks, beverages & everyday food essentials from top brands',
    badge: '🍫 Premium Selection',
  },
  'NON Food Consumer Goods': {
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1600&h=800&fit=crop&q=80',
    subtitle: 'Personal care, stationery & household essentials you can count on',
    badge: '🧴 Best Sellers',
  },
  'Pet Care Brands': {
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1600&h=800&fit=crop&q=80',
    subtitle: 'Premium nutrition & care products for your furry friends',
    badge: '🐾 Pet Lovers Choice',
  },
};

const defaultMeta = {
  image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1600&h=800&fit=crop&q=80',
  subtitle: 'Discover amazing products at unbeatable prices',
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
      image: defaultMeta.image,
      badge: '🛍️ Explore',
    });
  }

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [slides.length]);

  // Autoplay with smooth progress
  useEffect(() => {
    if (slides.length <= 1) return;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / AUTOPLAY_MS) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        setCurrent((c) => (c + 1) % slides.length);
        setProgress(0);
        startTimeRef.current = Date.now();
      }
      progressRef.current = requestAnimationFrame(tick);
    };

    progressRef.current = requestAnimationFrame(tick);
    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden bg-gray-900">
      <div className="relative h-[320px] sm:h-[420px] md:h-[500px]">
        {slides.map((slide, idx) => (
          <div
            key={slide.category}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03]'
            }`}
          >
            {/* Full background image with slow Ken Burns zoom */}
            <img
              src={slide.image}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[6500ms] ease-linear ${
                idx === current ? 'scale-110' : 'scale-100'
              }`}
              loading={idx === 0 ? 'eager' : 'lazy'}
              aria-hidden="true"
            />

            {/* Overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

            {/* Content with staggered entrance */}
            <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-6 sm:px-10 md:px-16">
              <div className="max-w-2xl">
                <span
                  className={`mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-700 ${
                    idx === current ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: idx === current ? '200ms' : '0ms' }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {slide.badge}
                </span>

                <h2
                  className={`mb-4 text-3xl font-extrabold leading-tight text-white drop-shadow-lg sm:text-4xl md:text-[3.5rem] md:leading-[1.1] transition-all duration-700 ${
                    idx === current ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                  }`}
                  style={{ transitionDelay: idx === current ? '350ms' : '0ms' }}
                >
                  {slide.title}
                </h2>

                <p
                  className={`mb-8 max-w-lg text-base leading-relaxed text-white/80 drop-shadow-sm sm:text-lg transition-all duration-700 ${
                    idx === current ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                  }`}
                  style={{ transitionDelay: idx === current ? '500ms' : '0ms' }}
                >
                  {slide.subtitle}
                </p>

                <div
                  className={`flex items-center gap-3 transition-all duration-700 ${
                    idx === current ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                  }`}
                  style={{ transitionDelay: idx === current ? '650ms' : '0ms' }}
                >
                  <button
                    onClick={() => onCategoryClick(slide.category)}
                    className="btn-press inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-gray-900 shadow-xl transition-all hover:shadow-2xl hover:scale-105"
                  >
                    {slide.cta}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onCategoryClick('All')}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-white/40 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:border-white/60"
                  >
                    View All
                  </button>
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
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-all hover:bg-black/50 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-all hover:bg-black/50 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Animated progress dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className="group relative flex items-center"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <div
                className={`h-[5px] rounded-full overflow-hidden transition-all duration-300 ${
                  idx === current ? 'w-14 bg-white/25' : 'w-5 bg-white/25 hover:bg-white/40'
                }`}
              >
                {idx === current && (
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${progress}%` }}
                  />
                )}
                {idx < current && (
                  <div className="h-full w-full rounded-full bg-white/60" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
