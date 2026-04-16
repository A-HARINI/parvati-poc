'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, ArrowRight, Truck, Shield, Headphones, RefreshCw } from 'lucide-react';
import Navbar from './Navbar';
import HeroSlider from './HeroSlider';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/api';

interface HomePageProps {
  categories: string[];
  brands: string[];
  showcaseProducts?: Product[];
}

const categoryData: Record<string, { icon: string; gradient: string; items: string }> = {
  'Food Consumer Goods': {
    icon: '🍫',
    gradient: 'from-amber-500 to-orange-600',
    items: 'Snacks, Beverages & More',
  },
  'NON Food Consumer Goods': {
    icon: '🧴',
    gradient: 'from-blue-500 to-indigo-600',
    items: 'Personal Care & Essentials',
  },
  'Pet Care Brands': {
    icon: '🐾',
    gradient: 'from-emerald-500 to-teal-600',
    items: 'Pet Food & Accessories',
  },
};

const defaultCategoryData = {
  icon: '🛍️',
  gradient: 'from-gray-500 to-gray-700',
  items: 'Quality Products',
};

const brandLogos: Record<string, string> = {
  'lotus biscoff': '/brands/biscoff.png',
  'biscoff': '/brands/biscoff.png',
  'me-o': '/brands/meo.png',
  "palmer's": '/brands/palmers.png',
  'palmers': '/brands/palmers.png',
  'pentel': '/brands/pentel.png',
  'ovaltine': '/brands/ovaltine.png',
};

const features = [
  { icon: Truck, title: 'Fast Delivery', desc: 'Quick & reliable shipping' },
  { icon: Shield, title: 'Secure Payments', desc: '100% secure checkout' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
  { icon: RefreshCw, title: 'Easy Returns', desc: 'Hassle-free returns' },
];

export default function HomePage({ categories, brands, showcaseProducts = [] }: HomePageProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.trim()) {
      router.push(`/products?search=${encodeURIComponent(value)}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    if (category === 'All') {
      router.push('/products');
    } else if (category === 'Hot Sales') {
      router.push('/products?hotDeal=true');
    } else if (category === 'New Arrivals') {
      router.push('/products?sort=newest');
    } else {
      router.push(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  const handleBrandClick = (brand: string) => {
    router.push(`/products?brand=${encodeURIComponent(brand)}`);
  };

  const scrollProducts = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar
        searchValue={search}
        onSearchChange={handleSearch}
        cartCount={0}
        categories={categories}
        selectedCategory="All"
        onCategoryChange={handleCategoryClick}
      />

      <main>
        {/* Hero */}
        <div className="mx-auto max-w-[1440px]">
          <HeroSlider categories={categories} onCategoryClick={handleCategoryClick} />
        </div>

        {/* Trust Badges */}
        <div className="border-b border-border-color bg-white">
          <div className="mx-auto max-w-[1440px] grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 py-5 sm:px-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cta/10">
                  <f.icon className="h-5 w-5 text-cta" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{f.title}</p>
                  <p className="text-xs text-text-muted">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="mx-auto max-w-[1440px] px-4 sm:px-6 py-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">Shop by Category</h2>
                <p className="mt-1 text-sm text-text-muted">Find what you need, fast</p>
              </div>
              <button
                onClick={() => handleCategoryClick('All')}
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-cta hover:text-cta-dark transition"
              >
                All Products <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => {
                const data = categoryData[cat] || defaultCategoryData;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="group relative overflow-hidden rounded-2xl bg-white border border-border-color p-6 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.04]`} />
                    <div className="relative flex items-center gap-5">
                      <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${data.gradient} shadow-md`}>
                        <span className="text-3xl">{data.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-text-primary group-hover:text-cta transition-colors">
                          {cat}
                        </h3>
                        <p className="text-sm text-text-muted mt-0.5">{data.items}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-text-muted opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-cta" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {showcaseProducts.length > 0 && (
          <section className="bg-white border-y border-border-color">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">Featured Products</h2>
                  <p className="mt-1 text-sm text-text-muted">Handpicked just for you</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      onClick={() => scrollProducts('left')}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border-color text-text-muted transition hover:border-cta hover:text-cta"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => scrollProducts('right')}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border-color text-text-muted transition hover:border-cta hover:text-cta"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => router.push('/products')}
                    className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-cta hover:text-cta-dark transition"
                  >
                    View All <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
                  {showcaseProducts.map((product) => (
                    <div key={product._id} className="w-[230px] flex-shrink-0 snap-start sm:w-[255px]">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent" />
              </div>

              <button
                onClick={() => router.push('/products')}
                className="mt-6 w-full rounded-xl border-2 border-dashed border-border-color py-3 text-sm font-semibold text-text-secondary transition hover:border-cta hover:text-cta sm:hidden"
              >
                View All Products →
              </button>
            </div>
          </section>
        )}

        {/* Brands */}
        {brands.length > 0 && (
          <section className="mx-auto max-w-[1440px] px-4 sm:px-6 py-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary">Top Brands</h2>
              <p className="mt-1 text-sm text-text-muted">Trusted names you love</p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
              {brands.map((brand) => {
                const logo = brandLogos[brand.toLowerCase()];
                return (
                  <button
                    key={brand}
                    onClick={() => handleBrandClick(brand)}
                    className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border-color bg-white px-8 py-6 flex-shrink-0 snap-start transition-all duration-200 hover:border-cta hover:shadow-md hover:-translate-y-1"
                  >
                    {logo ? (
                      <div className="flex h-12 w-28 items-center justify-center">
                        <img
                          src={logo}
                          alt={brand}
                          className="max-h-full max-w-full object-contain grayscale opacity-60 transition-all duration-200 group-hover:grayscale-0 group-hover:opacity-100"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl font-bold text-text-primary transition group-hover:bg-cta/10 group-hover:text-cta">
                        {brand.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-text-muted group-hover:text-text-primary whitespace-nowrap transition">
                      {brand}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="mx-auto max-w-[1440px] px-4 sm:px-6 pb-12">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-12 sm:px-12 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-cta" />
              <div className="absolute right-20 bottom-5 h-24 w-24 rounded-full bg-primary" />
              <div className="absolute right-1/3 top-5 h-16 w-16 rounded-full bg-cta" />
            </div>
            <div className="relative">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to explore?</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-gray-300 leading-relaxed">
                Browse our full collection of products — from everyday essentials to specialty items.
              </p>
              <button
                onClick={() => router.push('/products')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cta px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-cta-dark hover:shadow-xl"
              >
                Browse All Products <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border-color bg-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src="/logo-black.png" alt="Parvati" className="h-7 w-auto" />
                <span className="text-sm text-text-muted">&copy; 2026 Parvati. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-text-muted">
                <span className="hover:text-text-primary transition cursor-pointer">Privacy Policy</span>
                <span className="hover:text-text-primary transition cursor-pointer">Terms of Service</span>
                <span className="hover:text-text-primary transition cursor-pointer">Contact Us</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
