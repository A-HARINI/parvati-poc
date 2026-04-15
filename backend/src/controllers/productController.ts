import { Request, Response, NextFunction } from 'express';
import * as productModel from '../models/productModel';
import { createZohoItem, updateZohoStock } from '../services/zohoService';

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, category, brand, price, rating, available, image, images, stock } = req.body;

    const product = await productModel.createProduct({
      name,
      description,
      category,
      brand,
      price,
      rating,
      available,
      image,
      images: images || [],
      stock,
    });

    // Attempt Zoho integration (non-blocking)
    try {
      const zohoItem = await createZohoItem(product as any);
      if (zohoItem?.item?.item_id) {
        const updated = await productModel.updateProduct(String(product.id || product._id), {
          zoho_item_id: zohoItem.item.item_id,
        });
        return res.status(201).json(updated);
      }
    } catch (error) {
      console.error('Zoho create item failed (non-blocking):', error);
    }

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);
    const search = String(req.query.search || '');
    const category = String(req.query.category || '');
    const brand = String(req.query.brand || '');
    const rating = req.query.rating ? Number(req.query.rating) : undefined;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const availability = String(req.query.availability || '');
    const sort = String(req.query.sort || 'newest');

    const data = await productModel.searchProducts({
      keyword: search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      availability,
      sort,
      page,
      limit,
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const updated = await productModel.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Attempt Zoho update (non-blocking)
    try {
      await updateZohoStock(updated);
    } catch (error) {
      console.error('Zoho update stock failed (non-blocking):', error);
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await productModel.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(deleted);
  } catch (error) {
    next(error);
  }
}

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await productModel.getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function getPriceRange(req: Request, res: Response, next: NextFunction) {
  try {
    const range = await productModel.getPriceRange();
    res.json(range);
  } catch (error) {
    next(error);
  }
}

export async function getBrands(req: Request, res: Response, next: NextFunction) {
  try {
    const brands = await productModel.getBrands();
    res.json(brands);
  } catch (error) {
    next(error);
  }
}

export async function searchSuggestions(req: Request, res: Response, next: NextFunction) {
  try {
    const keyword = String(req.query.q || '');
    const limit = Math.min(Number(req.query.limit) || 8, 20);
    const suggestions = await productModel.searchSuggestions(keyword, limit);
    res.json(suggestions);
  } catch (error) {
    next(error);
  }
}

export async function bulkDeleteProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'ids array is required' });
    }
    const deletedCount = await productModel.bulkDeleteProducts(ids);
    res.json({ deletedCount });
  } catch (error) {
    next(error);
  }
}

export async function bulkUpdateProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { ids, update } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'ids array is required' });
    }
    if (!update || typeof update !== 'object') {
      return res.status(400).json({ message: 'update object is required' });
    }
    // Only allow safe fields to be bulk-updated
    const allowed = ['category', 'brand', 'available', 'price', 'rating', 'stock'];
    const safeUpdate: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in update) safeUpdate[key] = update[key];
    }
    if (Object.keys(safeUpdate).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }
    const modifiedCount = await productModel.bulkUpdateProducts(ids, safeUpdate);
    res.json({ modifiedCount });
  } catch (error) {
    next(error);
  }
}
