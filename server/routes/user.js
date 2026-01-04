import express from 'express';
import { userController } from '#controllers';
import { protect, admin } from '#middlewares';

const router = express.Router();

// logged-in user
router.get('/me', protect, userController.getMe);
router.put('/me', protect, userController.updateMe);

// admin
router.get('/', protect, admin, userController.getUsers);
router.get('/:id', protect, admin, userController.getUserById);

export default router;
