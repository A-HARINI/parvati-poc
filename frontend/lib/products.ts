// Fallback product type and static data for when backend is unavailable
export type Product = {
  _id: string;
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  available: boolean;
  image: string;
  stock: number;
  zoho_item_id?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Re-export from api module
export type { ProductFilters, ProductResponse } from './api';
