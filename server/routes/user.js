import express from 'express';
import { userController } from '#controllers';
import { protect, admin } from '#middlewares';

const router = express.Router();

router.get('/me', userController.getMe);
router.put('/me', userController.updateMe);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;