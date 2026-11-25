const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

async function serialize(cart) {
  await cart.populate('items.product', 'name slug images price');
  return { cart: cart.compute() };
}

router.use(auth);

router.get('/', async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  res.json(await serialize(cart));
});

router.post('/items', async (req, res) => {
  const { productId, quantity = 1, variant = null } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const cart = await getOrCreateCart(req.user._id);
  const existing = cart.items.find(
    (i) => String(i.product) === String(productId) && JSON.stringify(i.variant) === JSON.stringify(variant)
  );
  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity), price: product.price, variant });
  }
  await cart.save();
  res.json(await serialize(cart));
});

router.patch('/items', async (req, res) => {
  const { productId, quantity, variant = null } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find(
    (i) => String(i.product) === String(productId) && JSON.stringify(i.variant) === JSON.stringify(variant)
  );
  if (!item) return res.status(404).json({ message: 'Item not in cart' });
  item.quantity = Number(quantity);
  await cart.save();
  res.json(await serialize(cart));
});

router.delete('/items', async (req, res) => {
  const { productId, variant = null } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter(
    (i) => !(String(i.product) === String(productId) && JSON.stringify(i.variant) === JSON.stringify(variant))
  );
  await cart.save();
  res.json(await serialize(cart));
});

router.delete('/', async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  cart.couponCode = null;
  await cart.save();
  res.json({ cart: cart.compute() });
});

router.post('/coupon', async (req, res) => {
  const { couponCode } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  cart.couponCode = couponCode || null;
  await cart.save();
  res.json(await serialize(cart));
});

router.delete('/coupon', async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.couponCode = null;
  await cart.save();
  res.json(await serialize(cart));
});

router.post('/shipping-address', async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.shippingAddress = req.body;
  await cart.save();
  res.json(await serialize(cart));
});

module.exports = router;