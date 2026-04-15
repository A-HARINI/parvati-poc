import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  getCategories,
  getPriceRange,
  getBrands,
  bulkDeleteProducts,
  bulkUpdateProducts,
} from '../controllers/productController';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/price-range', getPriceRange);
router.get('/brands', getBrands);
router.post('/bulk-delete', authenticateAdmin, bulkDeleteProducts);
router.put('/bulk-update', authenticateAdmin, bulkUpdateProducts);
router.get('/:id', getProduct);
router.post('/', authenticateAdmin, createProduct);
router.put('/:id', authenticateAdmin, updateProduct);
router.delete('/:id', authenticateAdmin, deleteProduct);

export default router;
