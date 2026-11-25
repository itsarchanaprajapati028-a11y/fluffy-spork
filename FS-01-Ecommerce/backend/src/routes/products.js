const express = require('express');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseBool(v) {
  return v === true || v === 'true';
}

// GET /products/search
router.get('/search', async (req, res) => {
  const {
    search,
    category,
    subCategory,
    brand,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    rating,
    inStock,
    isFeatured,
    page = 1,
    limit = 20,
  } = req.query;

  const q = {};
  if (search) q.name = { $regex: search, $options: 'i' };
  if (category) q.category = category;
  if (subCategory) q.subCategory = subCategory;
  if (brand) q.brand = { $in: String(brand).split(',') };
  if (minPrice || maxPrice) {
    q.price = {};
    if (minPrice) q.price.$gte = Number(minPrice);
    if (maxPrice) q.price.$lte = Number(maxPrice);
  }
  if (rating) q.rating = { $gte: Number(rating) };
  if (parseBool(inStock)) q.stock = { $gt: 0 };
  if (parseBool(isFeatured)) q.isFeatured = true;

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const total = await Product.countDocuments(q);
  const products = await Product.find(q)
    .sort(sort)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .populate('vendor', 'firstName lastName');

  res.json({
    products,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum) || 1,
  });
});

// GET /products/featured
router.get('/featured', async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const products = await Product.find({ isFeatured: true }).limit(limit).populate('vendor', 'firstName lastName');
  res.json({ products });
});

// GET /products/categories
router.get('/categories', async (req, res) => {
  const raw = await Product.distinct('category');
  const categories = raw
    .filter(Boolean)
    .map((name, i) => ({ _id: 'cat-' + i, name, slug: slugify(name) }));
  res.json({ categories });
});

// GET /products/brands
router.get('/brands', async (req, res) => {
  const q = req.query.category ? { category: req.query.category } : {};
  const brands = await Product.distinct('brand', q);
  res.json({ brands: brands.filter(Boolean) });
});

// GET /products/vendor/my-products
router.get('/vendor/my-products', auth, authorize('vendor', 'admin'), async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 20);
  const q = { vendor: req.user._id };
  const total = await Product.countDocuments(q);
  const products = await Product.find(q)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('vendor', 'firstName lastName');
  res.json({ products, page, limit, total, totalPages: Math.ceil(total / limit) || 1 });
});

// GET /products/slug/:slug
router.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('vendor', 'firstName lastName');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
});

// GET /products/:id/related
router.get('/:id/related', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const limit = Number(req.query.limit) || 4;
  const products = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(limit)
    .populate('vendor', 'firstName lastName');
  res.json({ products });
});

// GET /products/:id
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('vendor', 'firstName lastName');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
});

// POST /products (vendor/admin)
router.post('/', auth, authorize('vendor', 'admin'), async (req, res) => {
  const b = req.body;
  const product = await Product.create({
    name: b.name,
    slug: b.slug || slugify(b.name),
    description: b.description || '',
    shortDescription: b.shortDescription || '',
    price: Number(b.price) || 0,
    originalPrice: Number(b.originalPrice) || Number(b.price) || 0,
    images: b.images || [{ url: '/placeholder-product.svg', alt: b.name }],
    category: b.category || '',
    subCategory: b.subCategory || '',
    brand: b.brand || '',
    stock: Number(b.stock) || 0,
    isFeatured: parseBool(b.isFeatured),
    attributes: b.attributes || {},
    variants: b.variants || [],
    vendor: req.user._id,
  });
  res.status(201).json({ product });
});

// PATCH /products/:id
router.patch('/:id', auth, authorize('vendor', 'admin'), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (req.user.role !== 'admin' && String(product.vendor) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  const allowed = [
    'name',
    'description',
    'shortDescription',
    'price',
    'originalPrice',
    'images',
    'category',
    'subCategory',
    'brand',
    'stock',
    'isFeatured',
    'attributes',
    'variants',
  ];
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) product[k] = req.body[k];
  });
  await product.save();
  res.json({ product });
});

// DELETE /products/:id
router.delete('/:id', auth, authorize('vendor', 'admin'), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (req.user.role !== 'admin' && String(product.vendor) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  await product.deleteOne();
  res.json({ message: 'Product deleted' });
});

module.exports = router;