import express from 'express';
import { reviewController } from '#controllers';
import { protect } from '#middlewares';

const router = express.Router();

router.get('/product/:productId', reviewController.getReviewsByProduct);

router.post('/', protect, reviewController.createReview);
router.delete('/:id', protect, reviewController.deleteReview);

export default router;