'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, Grid3X3, List, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import Navbar from './Navbar';
import FiltersSidebar from './FiltersSidebar';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';
import type { Product, ProductResponse } from '@/lib/api';

const sortOptions = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'priceLow', label: 'Price: Low to High' },
  { value: 'priceHigh', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'nameAsc', label: 'Name: A to Z' },
  { value: 'nameDesc', label: 'Name: Z to A' },
];

type FilterState = {
  category: string;
  brand: string;
  rating: number;
  minPrice: number;
  maxPrice: number;
  availability: string;
};

interface ProductSectionProps {
  initialData: ProductResponse;
  initialCategories: string[];
  initialBrands: string[];
  initialPriceRange: { minPrice: number; maxPrice: number };
  initialCategory?: string;
  initialBrand?: string;
  initialSearch?: string;
}

const API_BASE = '';

export default function ProductSection({
  initialData,
  initialCategories,
  initialBrands,
  initialPriceRange,
  initialCategory,
  initialBrand,
  initialSearch,
}: ProductSectionProps) {
  const [products, setProducts] = useState<Product[]>(initialData.products);
  const [total, setTotal] = useState(initialData.total);
  const [pages, setPages] = useState(initialData.pages);
  const [page, setPage] = useState(initialData.page);
  const [loading, setLoading] = useState(false);

  const priceRange = useMemo(
    () => ({
      min: Math.floor(initialPriceRange.minPrice),
      max: Math.ceil(initialPriceRange.maxPrice),
    }),
    [initialPriceRange]
  );

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory || 'All',
    brand: initialBrand || 'All',
    rating: 0,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    availability: 'all',
  });

  const [search, setSearch] = useState(initialSearch || '');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filters.category !== 'All') params.set('category', filters.category);
      if (filters.brand !== 'All') params.set('brand', filters.brand);
      if (filters.minPrice > priceRange.min) params.set('minPrice', String(filters.minPrice));
      if (filters.maxPrice < priceRange.max) params.set('maxPrice', String(filters.maxPrice));
      if (filters.rating > 0) params.set('rating', String(filters.rating));
      if (filters.availability !== 'all') params.set('availability', filters.availability);
      params.set('sort', sort);
      params.set('page', String(page));
      params.set('limit', '12');

      const res = await fetch(`${API_BASE}/api/products?${params.toString()}`);
      if (res.ok) {
        const data: ProductResponse = await res.json();
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [search, filters, sort, page, priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [search, filters, sort, page]);

  const handleFilterChange = (name: string, value: string | number) => {
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1);
  };

  const handleClearAll = () => {
    setFilters({
      category: 'All',
      brand: 'All',
      rating: 0,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      availability: 'all',
    });
    setSearch('');
    setPage(1);
  };

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (page > 3) pageNumbers.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) {
        pageNumbers.push(i);
      }
      if (page < pages - 2) pageNumbers.push('...');
      pageNumbers.push(pages);
    }
    return pageNumbers;
  };

  return (
    <>
      <Navbar
        searchValue={search}
        onSearchChange={setSearch}
        cartCount={0}
        categories={initialCategories}
        selectedCategory={filters.category}
        onCategoryChange={(cat) => handleFilterChange('category', cat)}
      />

      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-text-secondary" aria-label="Breadcrumb">
          <a href="/" className="text-cta hover:text-cta-dark hover:underline">Home</a>
          <span className="mx-2 text-text-muted">/</span>
          <span className="text-cta hover:text-cta-dark hover:underline cursor-pointer">Products</span>
          {filters.category !== 'All' && (
            <>
              <span className="mx-2 text-text-muted">/</span>
              <span className="font-medium text-text-primary">{filters.category}</span>
            </>
          )}
        </nav>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden w-[250px] flex-shrink-0 lg:block">
            <FiltersSidebar
              categories={initialCategories}
              brands={initialBrands}
              filters={filters}
              priceRange={priceRange}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
              mobileOpen={mobileFiltersOpen}
              onMobileClose={() => setMobileFiltersOpen(false)}
            />
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Results header */}
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-border-color bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button
                  id="mobile-filter-btn"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-border-color bg-white px-3 py-2 text-sm font-medium text-text-primary shadow-sm hover:bg-gray-50 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 text-cta" />
                  Filters
                </button>

                <div>
                  {search ? (
                    <h1 className="text-base font-semibold text-text-primary">
                      Results for <span className="text-cta">"{search}"</span>
                    </h1>
                  ) : (
                    <h1 className="text-base font-semibold text-text-primary">
                      {filters.category !== 'All' ? filters.category : 'All Products'}
                    </h1>
                  )}
                  <p className="text-sm text-text-muted">
                    {total > 0
                      ? `Showing ${(page - 1) * 12 + 1}–${Math.min(page * 12, total)} of ${total} results`
                      : 'No results found'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {/* View mode toggle */}
                <div className="hidden items-center rounded-xl border border-border-color sm:flex">
                  <button
                    id="grid-view-btn"
                    onClick={() => setViewMode('grid')}
                    className={`rounded-l-xl p-2 transition-colors ${
                      viewMode === 'grid' ? 'bg-cta-light text-cta' : 'text-text-muted hover:bg-gray-50'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    id="list-view-btn"
                    onClick={() => setViewMode('list')}
                    className={`rounded-r-xl border-l border-border-color p-2 transition-colors ${
                      viewMode === 'list' ? 'bg-cta-light text-cta' : 'text-text-muted hover:bg-gray-50'
                    }`}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort dropdown */}
                <select
                  id="sort-select"
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="rounded-xl border border-border-color bg-white px-3 py-2 text-sm text-text-primary outline-none transition hover:border-gray-300 focus:border-cta focus:ring-2 focus:ring-cta/20"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      Sort: {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product grid */}
            {loading ? (
              <div className={viewMode === 'grid'
                ? 'grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'space-y-4'
              }>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} viewMode={viewMode} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={viewMode === 'grid'
                ? 'grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'space-y-4'
              }>
                {products.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border-color bg-white py-16 text-center">
                <div className="mb-4 rounded-2xl bg-primary/10 p-4">
                  <Package className="h-12 w-12 text-text-muted" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-text-primary">No products found</h3>
                <p className="mb-6 max-w-md text-sm text-text-secondary">
                  We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={handleClearAll}
                  className="btn-press rounded-xl cta-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && !loading && (
              <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Pagination">
                <button
                  id="prev-page-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 rounded-xl border border-border-color bg-white px-4 py-2 text-sm font-medium text-text-primary shadow-soft transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                <div className="flex items-center gap-1 mx-1">
                  {getPageNumbers().map((pageNum, idx) =>
                    pageNum === '...' ? (
                      <span key={`dots-${idx}`} className="px-2 text-text-muted">...</span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum as number)}
                        className={`h-9 min-w-[36px] rounded-xl text-sm font-medium transition-all ${
                          page === pageNum
                            ? 'cta-gradient text-white shadow-sm'
                            : 'border border-border-color bg-white text-text-primary hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </div>

                <button
                  id="next-page-btn"
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page >= pages}
                  className="flex items-center gap-1 rounded-xl border border-border-color bg-white px-4 py-2 text-sm font-medium text-text-primary shadow-soft transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
