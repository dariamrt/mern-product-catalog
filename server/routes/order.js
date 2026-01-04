import express from 'express';
import { orderController } from '#controllers';
import { protect, admin } from '#middlewares';

const router = express.Router();

// user
router.post('/', protect, orderController.createOrder);
router.get('/my', protect, orderController.getMyOrders);
router.get('/:id', protect, orderController.getOrderById);

// admin
router.get('/', protect, admin, orderController.getOrders);

export default router;
