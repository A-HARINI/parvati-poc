import HomePage from '@/components/HomePage';
import { fetchCategories, fetchBrands, fetchProducts } from '@/lib/api';
import type { Product } from '@/lib/api';

export default async function Home() {
  let categories: string[];
  let brands: string[];
  let products: Product[] = [];

  try {
    [categories, brands] = await Promise.all([
      fetchCategories(),
      fetchBrands(),
    ]);
    const data = await fetchProducts({ limit: 8, sort: 'newest' });
    products = data.products;
  } catch (error) {
    console.error('Failed to fetch initial data:', error);
    categories = [];
    brands = [];
  }

  return (
    <div className="min-h-screen bg-surface">
      <HomePage categories={categories} brands={brands} showcaseProducts={products} />
    </div>
  );
}
