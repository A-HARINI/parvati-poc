const isServer = typeof window === 'undefined';
const API_BASE = isServer ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') : '';

export interface ProductResponse {
  products: Product[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  available: boolean;
  image: string;
  images: string[];
  stock: number;
  hotDeal?: boolean;
  zoho_item_id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  availability?: string;
  hotDeal?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<ProductResponse> {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.category && filters.category !== 'All') params.set('category', filters.category);
  if (filters.brand && filters.brand !== 'All') params.set('brand', filters.brand);
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
  if (filters.rating) params.set('rating', String(filters.rating));
  if (filters.availability) params.set('availability', filters.availability);
  if (filters.hotDeal) params.set('hotDeal', 'true');
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  const res = await fetch(`${API_BASE}/api/products?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/api/categories`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      // Fallback to old endpoint if new one fails
      const fallbackRes = await fetch(`${API_BASE}/api/products/categories`, { cache: 'no-store' });
      if (!fallbackRes.ok) return [];
      return fallbackRes.json();
    }
    const categories = await res.json();
    // Extract active category names
    return categories
      .filter((cat: { isActive: boolean }) => cat.isActive)
      .map((cat: { name: string }) => cat.name);
  } catch {
    return [];
  }
}

export async function fetchPriceRange(): Promise<{ minPrice: number; maxPrice: number }> {
  try {
    const res = await fetch(`${API_BASE}/api/products/price-range`, {
      cache: 'no-store',
    });
    if (!res.ok) return { minPrice: 0, maxPrice: 10000 };
    return res.json();
  } catch {
    return { minPrice: 0, maxPrice: 10000 };
  }
}

export async function fetchBrands(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/api/products/brands`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export interface SearchSuggestion {
  id: string;
  name: string;
  category: string;
  brand: string;
  image: string;
  price: number;
}

export interface SearchSuggestionsResponse {
  products: SearchSuggestion[];
  categories: string[];
}

export async function fetchSearchSuggestions(query: string): Promise<SearchSuggestionsResponse> {
  if (!query.trim()) return { products: [], categories: [] };
  try {
    const res = await fetch(`${API_BASE}/api/products/search-suggestions?q=${encodeURIComponent(query)}`);
    if (!res.ok) return { products: [], categories: [] };
    return res.json();
  } catch {
    return { products: [], categories: [] };
  }
}
