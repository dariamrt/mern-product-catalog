import express from 'express';
import { orderController } from '#controllers';
import { protect, admin } from '#middlewares';

const router = express.Router();

router.post('/', protect, orderController.createOrder);
router.get('/my', protect, orderController.getMyOrders);
router.get('/:id', protect, orderController.getOrderById);

router.get('/', protect, admin, orderController.getOrders);
router.patch('/:id/status', protect, admin, orderController.updateOrderStatus);

export default router;