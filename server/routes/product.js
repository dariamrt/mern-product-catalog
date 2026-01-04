import express from 'express';
import { productController } from '#controllers';
import { protect, admin } from '#middlewares';

const router = express.Router();

// public
router.get('/', productController.getProducts);
router.get('/stats', productController.getProductStats);
router.get('/:id', productController.getProductById);

// admin
router.post('/', protect, admin, productController.createProduct);
router.put('/:id', protect, admin, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

export default router;
