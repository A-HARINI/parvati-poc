import Product from './Product';

export async function createProduct(data: {
  name: string;
  description?: string;
  category: string;
  brand?: string;
  price: number;
  rating?: number;
  available?: boolean;
  image?: string;
  images?: string[];
  stock?: number;
  zoho_item_id?: string;
}) {
  const product = await Product.create(data);
  return product.toJSON();
}

export async function getProductById(id: string) {
  const product = await Product.findById(id);
  return product ? product.toJSON() : null;
}

export async function updateProduct(id: string, update: Record<string, unknown>) {
  const product = await Product.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
  return product ? product.toJSON() : null;
}

export async function deleteProduct(id: string) {
  const product = await Product.findByIdAndDelete(id);
  return product ? product.toJSON() : null;
}

export async function bulkDeleteProducts(ids: string[]) {
  const result = await Product.deleteMany({ _id: { $in: ids } });
  return result.deletedCount;
}

export async function bulkUpdateProducts(ids: string[], update: Record<string, unknown>) {
  const result = await Product.updateMany({ _id: { $in: ids } }, { $set: update });
  return result.modifiedCount;
}

export async function searchProducts(options: {
  keyword?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  availability?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const filter: Record<string, unknown> = {};

  // Keyword search using regex for flexible matching
  if (options.keyword && options.keyword.trim()) {
    const escaped = options.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { name: { $regex: escaped, $options: 'i' } },
      { description: { $regex: escaped, $options: 'i' } },
      { category: { $regex: escaped, $options: 'i' } },
    ];
  }

  // Category filter
  if (options.category && options.category !== 'All') {
    filter.category = options.category;
  }

  // Brand filter
  if (options.brand && options.brand !== 'All') {
    filter.brand = options.brand;
  }

  // Price range filter
  if (typeof options.minPrice === 'number' || typeof options.maxPrice === 'number') {
    filter.price = {};
    if (typeof options.minPrice === 'number') {
      (filter.price as Record<string, number>).$gte = options.minPrice;
    }
    if (typeof options.maxPrice === 'number') {
      (filter.price as Record<string, number>).$lte = options.maxPrice;
    }
  }

  // Rating filter
  if (typeof options.rating === 'number' && options.rating > 0) {
    filter.rating = { $gte: options.rating };
  }

  // Availability filter
  if (options.availability === 'available') {
    filter.available = true;
  } else if (options.availability === 'unavailable') {
    filter.available = false;
  }

  // Sort mapping
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    priceLow: { price: 1 },
    priceHigh: { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
    nameAsc: { name: 1 },
    nameDesc: { name: -1 },
  };
  const sortOrder = sortMap[options.sort || 'newest'] || { createdAt: -1 };

  // Pagination
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit && options.limit > 0 ? options.limit : 12;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortOrder).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products: products.map((p) => ({ ...p, id: p._id })),
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
}

export async function getCategories() {
  const categories = await Product.distinct('category');
  return categories.sort();
}

export async function getPriceRange() {
  const result = await Product.aggregate([
    {
      $group: {
        _id: null,
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);
  return result[0] || { minPrice: 0, maxPrice: 10000 };
}

export async function getBrands() {
  const brands = await Product.distinct('brand', { brand: { $ne: '' } });
  return brands.sort();
}

export async function searchSuggestions(keyword: string, limit = 8) {
  if (!keyword || !keyword.trim()) return [];
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = { $regex: escaped, $options: 'i' };

  const [products, categories] = await Promise.all([
    Product.find(
      { $or: [{ name: regex }, { brand: regex }] },
      { name: 1, category: 1, brand: 1, image: 1, price: 1 }
    )
      .limit(limit)
      .lean(),
    Product.distinct('category', { category: regex }),
  ]);

  return {
    products: products.map((p) => ({
      id: p._id,
      name: p.name,
      category: p.category,
      brand: p.brand,
      image: p.image,
      price: p.price,
    })),
    categories: categories.slice(0, 4),
  };
}
