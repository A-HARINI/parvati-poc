export type Product = {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  available: boolean;
  image?: string;
  stock?: number;
  zoho_item_id?: string;
};
