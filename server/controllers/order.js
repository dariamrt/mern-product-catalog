import mongoose from 'mongoose';
import { Order, Product } from '#models';

const createOrder = async (req, res) => {
  try {
    const { items, status } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    let totalPrice = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      }
      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stoc insuficient pentru ${product.name}. Disponibil: ${product.countInStock}`,
        });
      }

      totalPrice += product.price * item.quantity;
      processedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      product.countInStock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: processedItems,
      totalPrice,
      status: status || 'pending'
    });

    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sort = {};
    if (req.query.sort) {
      const fields = req.query.sort.split(',');
      fields.forEach((field) => {
        if (field.startsWith('-')) {
          sort[field.substring(1)] = -1;
        } else {
          sort[field] = 1;
        }
      });
    } else {
      sort.createdAt = -1;
    }

    const filter = { user: req.user._id };
    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate('items.product', 'name price')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      data: orders,
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

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Comanda nu a fost gasita' });
    }

    order.status = status;
    await order.save();

    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID',
      });
    }

    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.isAdmin === true;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const sort = {};
    if (req.query.sort) {
      const fields = req.query.sort.split(',');
      fields.forEach((field) => {
        if (field.startsWith('-')) {
          sort[field.substring(1)] = -1;
        } else {
          sort[field] = 1;
        }
      });
    } else {
      sort.createdAt = -1;
    }

    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      data: orders,
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

export {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus
};