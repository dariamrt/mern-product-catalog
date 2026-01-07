import mongoose from 'mongoose';
import { Product, Review } from '#models';

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = { 
      isActive: true,
      countInStock: { $gt: 0 }
    };

    if (req.query.keyword) {
      filter.name = { $regex: req.query.keyword, $options: 'i' };
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.minRating) {
      filter.rating = { $gte: Number(req.query.minRating) };
    }

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

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    return res.json({
      success: true,
      data: products,
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

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, data: product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $match: { isActive: true, countInStock: { $gt: 0 } },
      },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);

    const topRated = await Product.find({ isActive: true, countInStock: { $gt: 0 } })
      .sort({ rating: -1 })
      .limit(5);

    return res.json({
      success: true,
      data: {
        priceStats: stats[0] || {},
        topRated,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true, countInStock: { $gt: 0 } });
    return res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductStats,
  getProductCategories
};