import HomePage from '@/components/HomePage';
import { fetchCategories, fetchBrands } from '@/lib/api';

export default async function Home() {
  let categories: string[];
  let brands: string[];

  try {
    [categories, brands] = await Promise.all([
      fetchCategories(),
      fetchBrands(),
    ]);
  } catch (error) {
    console.error('Failed to fetch initial data:', error);
    categories = [];
    brands = [];
  }

  return (
    <div className="min-h-screen bg-surface">
      <HomePage categories={categories} brands={brands} />
    </div>
  );
}
