import ProductSection from '@/components/ProductSection';
import { fetchProducts, fetchCategories, fetchPriceRange, fetchBrands } from '@/lib/api';

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; brand?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = params.category || '';
  const brand = params.brand || '';
  const search = params.search || '';

  let initialData;
  let categories: string[];
  let brands: string[];
  let priceRange: { minPrice: number; maxPrice: number };

  try {
    [initialData, categories, brands, priceRange] = await Promise.all([
      fetchProducts({
        limit: 12,
        ...(category ? { category } : {}),
        ...(brand ? { brand } : {}),
        ...(search ? { search } : {}),
      }),
      fetchCategories(),
      fetchBrands(),
      fetchPriceRange(),
    ]);
  } catch (error) {
    console.error('Failed to fetch initial data:', error);
    initialData = { products: [], page: 1, limit: 12, total: 0, pages: 0 };
    categories = [];
    brands = [];
    priceRange = { minPrice: 0, maxPrice: 10000 };
  }

  return (
    <div className="min-h-screen bg-surface">
      <ProductSection
        initialData={initialData}
        initialCategories={categories}
        initialBrands={brands}
        initialPriceRange={priceRange}
        initialCategory={category || undefined}
        initialBrand={brand || undefined}
        initialSearch={search || undefined}
      />
    </div>
  );
}
