const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, default: 0 },
    variant: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    couponCode: { type: String, default: null },
    shippingAddress: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

cartSchema.methods.compute = function () {
  const subtotal = this.items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
  let discount = 0;
  if (this.couponCode === 'SAVE10') discount = subtotal * 0.1;
  if (this.couponCode === 'SAVE20') discount = subtotal * 0.2;
  const tax = (subtotal - discount) * 0.05;
  const shippingCost = subtotal > 100 ? 0 : 5.99;
  const total = subtotal - discount + tax + shippingCost;
  return {
    items: this.items,
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    shippingCost: Number(shippingCost.toFixed(2)),
    total: Number(total.toFixed(2)),
    totalItems: this.items.reduce((s, i) => s + i.quantity, 0),
    couponCode: this.couponCode,
    shippingAddress: this.shippingAddress,
  };
};

module.exports = mongoose.model('Cart', cartSchema);