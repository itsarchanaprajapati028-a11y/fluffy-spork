const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// POST /orders
router.post('/', async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
  const totals = cart.compute();
  const order = await Order.create({
    orderNumber: 'ORD-' + Date.now().toString().slice(-8),
    user: req.user._id,
    items: cart.items.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      price: i.price,
      quantity: i.quantity,
      variant: i.variant,
    })),
    shippingAddress: req.body.shippingAddress || cart.shippingAddress,
    billingAddress: req.body.billingAddress || cart.shippingAddress,
    paymentMethod: req.body.paymentMethod || 'cod',
    paymentStatus: req.body.paymentMethod === 'cod' ? 'pending' : 'paid',
    status: 'pending',
    subtotal: totals.subtotal,
    discount: totals.discount,
    tax: totals.tax,
    shippingCost: totals.shippingCost,
    total: totals.total,
    couponCode: totals.couponCode,
  });
  cart.items = [];
  cart.couponCode = null;
  await cart.save();
  res.status(201).json({ order });
});

// GET /orders/vendor
router.get('/vendor', authorize('vendor', 'admin'), async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 20);
  const q = {};
  if (req.query.status) q.status = req.query.status;
  const total = await Order.countDocuments(q);
  const orders = await Order.find(q)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'firstName lastName email');
  res.json({ orders, page, limit, total, totalPages: Math.ceil(total / limit) || 1 });
});

// GET /orders
router.get('/', async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 20);
  const q = { user: req.user._id };
  if (req.query.status) q.status = req.query.status;
  const total = await Order.countDocuments(q);
  const orders = await Order.find(q)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'firstName lastName email');
  res.json({ orders, page, limit, total, totalPages: Math.ceil(total / limit) || 1 });
});

// GET /orders/:id
router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (req.user.role === 'customer' && String(order.user._id) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.json({ order });
});

// POST /orders/:orderId/payment-intent
router.post('/:orderId/payment-intent', async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  const paymentIntentId = 'pi_mock_' + Date.now();
  order.paymentIntentId = paymentIntentId;
  await order.save();
  res.json({ clientSecret: paymentIntentId + '_secret', paymentIntentId });
});

// POST /orders/:orderId/confirm-payment
router.post('/:orderId/confirm-payment', async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.paymentStatus = 'paid';
  order.status = 'processing';
  await order.save();
  res.json({ order });
});

// PATCH /orders/:orderId/status
router.patch('/:orderId/status', authorize('vendor', 'admin'), async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (req.body.status) order.status = req.body.status;
  order.trackingData = { ...order.trackingData, ...req.body };
  delete order.trackingData.status;
  await order.save();
  res.json({ order });
});

// POST /orders/:orderId/cancel
router.post('/:orderId/cancel', async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = 'cancelled';
  await order.save();
  res.json({ order });
});

module.exports = router;