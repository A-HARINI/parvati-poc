'use client';

import { useState } from 'react';
import { Star, ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react';

interface FiltersProps {
  categories: string[];
  brands: string[];
  filters: {
    category: string;
    brand: string;
    rating: number;
    minPrice: number;
    maxPrice: number;
    availability: string;
  };
  priceRange: { min: number; max: number };
  onFilterChange: (name: string, value: string | number) => void;
  onClearAll: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 py-4 last:border-b-0">
      <button
        className="flex w-full items-center justify-between text-sm font-semibold text-text-primary"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? 'mt-3 max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}

function StarRating({ value, onChange }: { value: number; onChange: (val: number) => void }) {
  const ratings = [4, 3, 2, 1];

  return (
    <div className="space-y-1">
      {ratings.map((rating) => (
        <button
          key={rating}
          onClick={() => onChange(value === rating ? 0 : rating)}
          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-all ${
            value === rating ? 'bg-cta-light ring-1 ring-cta/30' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  star <= rating ? 'fill-star text-star' : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-text-secondary">& Up</span>
        </button>
      ))}
    </div>
  );
}

export default function FiltersSidebar({
  categories,
  brands,
  filters,
  priceRange,
  onFilterChange,
  onClearAll,
  mobileOpen,
  onMobileClose,
}: FiltersProps) {
  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.brand !== 'All' ||
    filters.rating > 0 ||
    filters.maxPrice < priceRange.max ||
    filters.minPrice > priceRange.min ||
    filters.availability !== 'all';

  const filterContent = (
    <div className="space-y-0">
      {/* Active filters chips */}
      {hasActiveFilters && (
        <div className="border-b border-gray-100 pb-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">Active</span>
            <button
              onClick={onClearAll}
              className="text-xs font-medium text-cta hover:text-cta-dark hover:underline"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.category !== 'All' && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-cta-light px-2.5 py-1 text-xs font-medium text-cta">
                {filters.category}
                <button onClick={() => onFilterChange('category', 'All')} className="hover:text-cta-dark">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.brand !== 'All' && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                {filters.brand}
                <button onClick={() => onFilterChange('brand', 'All')} className="hover:text-blue-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.rating > 0 && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                {filters.rating}+ Stars
                <button onClick={() => onFilterChange('rating', 0)} className="hover:text-amber-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {(filters.minPrice > priceRange.min || filters.maxPrice < priceRange.max) && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                ${filters.minPrice}–${filters.maxPrice}
                <button
                  onClick={() => { onFilterChange('minPrice', priceRange.min); onFilterChange('maxPrice', priceRange.max); }}
                  className="hover:text-green-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.availability !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                {filters.availability === 'available' ? 'In Stock' : 'Out of Stock'}
                <button onClick={() => onFilterChange('availability', 'all')} className="hover:text-purple-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-0.5">
          <button
            onClick={() => onFilterChange('category', 'All')}
            className={`block w-full rounded-lg px-2.5 py-2 text-left text-sm transition-all ${
              filters.category === 'All'
                ? 'bg-primary/15 font-semibold text-text-primary'
                : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onFilterChange('category', cat)}
              className={`block w-full rounded-lg px-2.5 py-2 text-left text-sm transition-all ${
                filters.category === cat
                  ? 'bg-cta-light font-semibold text-cta ring-1 ring-cta/20'
                  : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="space-y-0.5 max-h-[200px] overflow-y-auto">
          <button
            onClick={() => onFilterChange('brand', 'All')}
            className={`block w-full rounded-lg px-2.5 py-2 text-left text-sm transition-all ${
              filters.brand === 'All'
                ? 'bg-primary/15 font-semibold text-text-primary'
                : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
            }`}
          >
            All Brands
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => onFilterChange('brand', brand)}
              className={`block w-full rounded-lg px-2.5 py-2 text-left text-sm transition-all ${
                filters.brand === brand
                  ? 'bg-cta-light font-semibold text-cta ring-1 ring-cta/20'
                  : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3 px-0.5">
          <div className="flex items-center justify-between text-sm">
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 font-medium text-text-primary">${filters.minPrice}</span>
            <span className="text-text-muted">—</span>
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 font-medium text-text-primary">${filters.maxPrice}</span>
          </div>
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            step={10}
            value={filters.minPrice}
            onChange={(e) => { const v = Number(e.target.value); if (v <= filters.maxPrice) onFilterChange('minPrice', v); }}
            className="w-full"
          />
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            step={10}
            value={filters.maxPrice}
            onChange={(e) => { const v = Number(e.target.value); if (v >= filters.minPrice) onFilterChange('maxPrice', v); }}
            className="w-full"
          />
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {[
              { label: 'Under $50', min: 0, max: 50 },
              { label: '$50–$200', min: 50, max: 200 },
              { label: '$200–$500', min: 200, max: 500 },
              { label: '$500+', min: 500, max: priceRange.max },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => { onFilterChange('minPrice', range.min); onFilterChange('maxPrice', range.max); }}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                  filters.minPrice === range.min && filters.maxPrice === range.max
                    ? 'border-cta bg-cta-light text-cta'
                    : 'border-border-color text-text-secondary hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Reviews">
        <StarRating value={filters.rating} onChange={(val) => onFilterChange('rating', val)} />
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <div className="space-y-1">
          {[
            { value: 'all', label: 'All Items' },
            { value: 'available', label: 'In Stock' },
            { value: 'unavailable', label: 'Out of Stock' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all hover:bg-gray-50 ${
                filters.availability === opt.value ? 'font-medium text-text-primary' : 'text-text-secondary'
              }`}
            >
              <input
                type="radio"
                name="availability"
                value={opt.value}
                checked={filters.availability === opt.value}
                onChange={(e) => onFilterChange('availability', e.target.value)}
                className="h-4 w-4 accent-cta"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-[130px] h-fit max-h-[calc(100vh-150px)] overflow-y-auto rounded-2xl border border-border-color bg-white p-5 shadow-soft">
        <h2 className="mb-1 text-base font-bold text-text-primary">Filters</h2>
        {filterContent}
      </aside>

      {/* Mobile filter drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] overlay lg:hidden" onClick={onMobileClose}>
          <div
            className="absolute left-0 top-0 h-full w-[320px] max-w-[85vw] overflow-y-auto bg-white shadow-xl slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-color bg-white px-5 py-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-cta" />
                <span className="text-lg font-bold text-text-primary">Filters</span>
              </div>
              <button onClick={onMobileClose} className="rounded-lg p-1.5 hover:bg-gray-100" aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5">{filterContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
