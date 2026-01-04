import mongoose from 'mongoose';
import { Review, Product } from '#models';

/**
 * Helper: Recalculate product rating
 */
const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: stats[0].avgRating,
      numReviews: stats[0].numReviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      numReviews: 0,
    });
  }
};

/**
 * @desc    Create review
 * @route   POST /api/reviews
 * @access  Protected
 */
const createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    if (!product || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Product and rating are required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      product,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You already reviewed this product',
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      comment,
    });

    await updateProductRating(product);

    return res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get reviews for a product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const filter = { product: productId };
    if (req.query.minRating) {
      filter.rating = { $gte: Number(req.query.minRating) };
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      sort = {};
      const fields = req.query.sort.split(',');
      fields.forEach((field) => {
        if (field.startsWith('-')) {
          sort[field.substring(1)] = -1;
        } else {
          sort[field] = 1;
        }
      });
    }

    const total = await Review.countDocuments(filter);

    const reviews = await Review.find(filter)
      .populate('user', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Protected (owner)
 */
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    await review.deleteOne();
    await updateProductRating(review.product);

    return res.json({
      success: true,
      data: { message: 'Review deleted' },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createReview,
  getReviewsByProduct,
  deleteReview,
};
