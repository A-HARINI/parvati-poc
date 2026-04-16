import HomePage from '@/components/HomePage';
import { fetchCategories, fetchBrands, fetchProducts } from '@/lib/api';
import type { Product } from '@/lib/api';

export default async function Home() {
  let categories: string[];
  let brands: string[];
  let products: Product[] = [];

  try {
    const [cats, brs, data] = await Promise.all([
      fetchCategories(),
      fetchBrands(),
      fetchProducts({ limit: 8, sort: 'newest' }),
    ]);
    categories = cats;
    brands = brs;
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
