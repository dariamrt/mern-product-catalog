import express from 'express';

import authRoutes from './auth.js';
import productRoutes from './product.js';
import userRoutes from './user.js';
import orderRoutes from './order.js';
import reviewRoutes from './review.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);

export default router;
