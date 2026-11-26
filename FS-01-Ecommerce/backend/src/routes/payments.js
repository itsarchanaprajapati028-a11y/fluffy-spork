const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

const KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_demo_fs01000001';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'fs01_razorpay_demo_secret';
const DEMO_MODE = String(process.env.RAZORPAY_DEMO || 'true') !== 'false';
const DEFAULT_CURRENCY = process.env.RAZORPAY_CURRENCY || 'USD';

function canAccessOrder(req, order) {
  return req.user.role !== 'customer' || String(order.user) === String(req.user._id);
}

// Public config so the Payments page can show the (demo) key details
router.get('/razorpay/config', (req, res) => {
  res.json({
    enabled: true,
    demoMode: DEMO_MODE,
    keyId: DEMO_MODE ? KEY_ID : undefined,
    currency: DEFAULT_CURRENCY,
    merchantName: 'FS-01 Demo Store',
    description: 'Razorpay demo checkout',
    theme: { color: '#0284c7' },
    testCards: {
      card: '4111 1111 1111 1111',
      expiry: '12/30',
      cvv: '123',
      upi: 'success@razorpay',
      netbanking: 'HDFC Bank',
    },
  });
});

router.use(auth);

// Create a (demo) Razorpay order for an existing order or the current cart
router.post('/razorpay/create-order', async (req, res) => {
  try {
    const { orderId } = req.body || {};
    let order = null;
    let amount;
    let receipt;

    if (orderId) {
      order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      if (!canAccessOrder(req, order)) return res.status(403).json({ message: 'Access denied' });
      if (order.paymentStatus === 'paid') {
        return res.status(400).json({ message: 'This order is already paid' });
      }
      amount = Number(order.total) || 0;
      receipt = order.orderNumber;
    } else {
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
      amount = cart.compute().total;
      receipt = 'cart_' + Date.now();
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    const amountMinor = Math.round(amount * 100);
    const razorpayOrderId = `${DEMO_MODE ? 'order_demo_' : 'order_'}${crypto.randomBytes(8).toString('hex')}`;

    if (order) {
      order.paymentMethod = 'razorpay';
      order.razorpayOrderId = razorpayOrderId;
      await order.save();
    }

    res.status(201).json({
      demoMode: DEMO_MODE,
      keyId: KEY_ID,
      orderId: order ? order._id : null,
      razorpayOrder: {
        id: razorpayOrderId,
        amount: amountMinor,
        currency: DEFAULT_CURRENCY,
        receipt,
        status: 'created',
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create Razorpay order', error: err.message });
  }
});

// Verify a (demo) Razorpay payment and mark the order as paid
router.post('/razorpay/verify', async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ message: 'Missing Razorpay payment details' });
    }

    let order = null;
    if (orderId) {
      order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      if (!canAccessOrder(req, order)) return res.status(403).json({ message: 'Access denied' });
      if (order.razorpayOrderId && order.razorpayOrderId !== razorpay_order_id) {
        return res.status(400).json({ message: 'Razorpay order mismatch' });
      }
    }

    if (DEMO_MODE) {
      if (!String(razorpay_payment_id).startsWith('pay_demo_')) {
        return res.status(400).json({ message: 'Demo payments must use a pay_demo_ payment id' });
      }
    } else {
      const expected = crypto
        .createHmac('sha256', KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
      if (expected !== razorpay_signature) {
        return res.status(400).json({ message: 'Invalid Razorpay signature' });
      }
    }

    if (order) {
      order.paymentMethod = 'razorpay';
      order.paymentStatus = 'paid';
      order.status = 'processing';
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature || 'demo_signature';
      await order.save();
    }

    res.json({
      verified: true,
      demoMode: DEMO_MODE,
      paymentId: razorpay_payment_id,
      order,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to verify Razorpay payment', error: err.message });
  }
});

// Demo failure endpoint (optional, useful for testing declined payments)
router.post('/razorpay/failure', async (req, res) => {
  try {
    const { orderId, reason } = req.body || {};
    if (!orderId) return res.status(400).json({ message: 'orderId is required' });
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!canAccessOrder(req, order)) return res.status(403).json({ message: 'Access denied' });
    order.paymentMethod = 'razorpay';
    order.paymentStatus = 'failed';
    await order.save();
    res.json({ failed: true, reason: reason || 'Payment was declined', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to record payment failure', error: err.message });
  }
});

// Demo-only: mark an order as paid without the Razorpay modal (admin/testing helper)
router.post('/razorpay/demo-complete', authorize('admin'), async (req, res) => {
  const { orderId } = req.body || {};
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.paymentMethod = 'razorpay';
  order.paymentStatus = 'paid';
  order.status = 'processing';
  order.razorpayPaymentId = 'pay_demo_' + crypto.randomBytes(8).toString('hex');
  await order.save();
  res.json({ order });
});

module.exports = router;
