import express from 'express';
import { reviewController } from '#controllers';
import { protect } from '#middlewares';

const router = express.Router();

// public
router.get('/product/:productId', reviewController.getReviewsByProduct);

// protected
router.post('/', protect, reviewController.createReview);
router.delete('/:id', protect, reviewController.deleteReview);

export default router;
