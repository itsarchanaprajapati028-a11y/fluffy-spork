const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    slug: 'wireless-noise-canceling-headphones',
    description: 'Premium over-ear wireless headphones with active noise cancellation, 30-hour battery life, and plush memory-foam ear cups.',
    shortDescription: 'Immersive sound with active noise cancellation.',
    price: 199.99,
    originalPrice: 249.99,
    category: 'electronics',
    subCategory: 'audio',
    brand: 'AudioPro',
    stock: 50,
    rating: 4.7,
    reviewCount: 128,
    isFeatured: true,
    images: [{ url: '/placeholder-product.svg', alt: 'Wireless Headphones' }],
    attributes: { 'Battery Life': '30 hours', 'Connectivity': 'Bluetooth 5.2', 'Weight': '250g' },
  },
  {
    name: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    description: 'Adjustable ergonomic office chair with lumbar support, breathable mesh back, and smooth-rolling casters.',
    shortDescription: 'All-day comfort with lumbar support.',
    price: 159.0,
    originalPrice: 199.0,
    category: 'furniture',
    subCategory: 'office',
    brand: 'ErgoHome',
    stock: 30,
    rating: 4.5,
    reviewCount: 84,
    isFeatured: true,
    images: [{ url: '/placeholder-product.svg', alt: 'Office Chair' }],
    attributes: { 'Material': 'Mesh', 'Max Weight': '150kg', 'Warranty': '5 years' },
  },
  {
    name: 'Stainless Steel Water Bottle',
    slug: 'stainless-steel-water-bottle',
    description: 'Double-wall vacuum insulated stainless steel bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
    shortDescription: 'Keeps drinks cold 24h / hot 12h.',
    price: 24.99,
    originalPrice: 34.99,
    category: 'accessories',
    subCategory: 'drinkware',
    brand: 'HydroPlus',
    stock: 120,
    rating: 4.8,
    reviewCount: 256,
    isFeatured: true,
    images: [{ url: '/placeholder-product.svg', alt: 'Water Bottle' }],
    attributes: { 'Capacity': '750ml', 'Material': '18/8 Stainless Steel' },
  },
  {
    name: 'Mechanical Keyboard RGB',
    slug: 'mechanical-keyboard-rgb',
    description: 'Compact mechanical keyboard with hot-swappable switches, per-key RGB lighting, and PBT keycaps.',
    shortDescription: 'Hot-swappable mechanical RGB keyboard.',
    price: 89.99,
    originalPrice: 119.99,
    category: 'electronics',
    subCategory: 'computers',
    brand: 'KeyForge',
    stock: 65,
    rating: 4.6,
    reviewCount: 172,
    isFeatured: false,
    images: [{ url: '/placeholder-product.svg', alt: 'Mechanical Keyboard' }],
    attributes: { 'Switch Type': 'Hot-swappable', 'Layout': '75%' },
  },
  {
    name: 'Cotton Blend Hoodie',
    slug: 'cotton-blend-hoodie',
    description: 'Soft cotton-blend pullover hoodie with kangaroo pocket and relaxed fit.',
    shortDescription: 'Comfortable everyday hoodie.',
    price: 39.99,
    originalPrice: 49.99,
    category: 'clothing',
    subCategory: 'tops',
    brand: 'UrbanThread',
    stock: 80,
    rating: 4.3,
    reviewCount: 64,
    isFeatured: false,
    images: [{ url: '/placeholder-product.svg', alt: 'Hoodie' }],
    attributes: { 'Material': '80% Cotton 20% Polyester', 'Fit': 'Relaxed' },
  },
  {
    name: '4K Action Camera',
    slug: '4k-action-camera',
    description: 'Waterproof 4K action camera with image stabilization, waterproof to 30m without a case.',
    shortDescription: 'Waterproof 4K action camera.',
    price: 129.99,
    originalPrice: 159.99,
    category: 'electronics',
    subCategory: 'cameras',
    brand: 'GoCapture',
    stock: 40,
    rating: 4.4,
    reviewCount: 98,
    isFeatured: true,
    images: [{ url: '/placeholder-product.svg', alt: 'Action Camera' }],
    attributes: { 'Resolution': '4K60', 'Waterproof': '30m' },
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fs01_ecommerce';
  await mongoose.connect(uri);
  console.log('[FS-01] Connected for seeding');

  const adminEmail = 'admin@fs01.com';
  if (!(await User.findOne({ email: adminEmail }))) {
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail,
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
    });
    console.log('[FS-01] Admin created: admin@fs01.com / admin123');
  }
  const vendorEmail = 'vendor@fs01.com';
  let vendor;
  if (!(await User.findOne({ email: vendorEmail }))) {
    vendor = await User.create({
      firstName: 'Vendor',
      lastName: 'Owner',
      email: vendorEmail,
      password: await bcrypt.hash('vendor123', 10),
      role: 'vendor',
    });
    console.log('[FS-01] Vendor created: vendor@fs01.com / vendor123');
  } else {
    vendor = await User.findOne({ email: vendorEmail });
  }
  const customerEmail = 'customer@fs01.com';
  if (!(await User.findOne({ email: customerEmail }))) {
    await User.create({
      firstName: 'Cus',
      lastName: 'Tomer',
      email: customerEmail,
      password: await bcrypt.hash('customer123', 10),
      role: 'customer',
    });
    console.log('[FS-01] Customer created: customer@fs01.com / customer123');
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(products.map((p) => ({ ...p, vendor: vendor._id })));
    console.log('[FS-01] Seeded', products.length, 'products');
  } else {
    console.log('[FS-01] Products already present, skipping');
  }

  await mongoose.disconnect();
  console.log('[FS-01] Seeding complete');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});