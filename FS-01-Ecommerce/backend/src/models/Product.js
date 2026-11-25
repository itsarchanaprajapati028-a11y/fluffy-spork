const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    price: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number, default: 0 },
    images: [{ url: { type: String }, alt: { type: String } }],
    category: { type: String, default: '' },
    subCategory: { type: String, default: '' },
    brand: { type: String, default: '' },
    stock: { type: Number, default: 0 },
    reservedStock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    attributes: { type: Map, of: String, default: {} },
    variants: [
      {
        name: String,
        options: [{ value: String, priceAdjustment: { type: Number, default: 0 } }],
      },
    ],
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

productSchema.virtual('finalPrice').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return this.price;
  }
  return this.price;
});

productSchema.virtual('discountPercent').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);