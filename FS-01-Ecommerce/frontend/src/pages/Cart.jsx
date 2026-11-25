import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/helpers';

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export function Cart() {
  const { items, subtotal, discount, tax, shippingCost, total, totalItems, couponCode, fetchCart, updateCartItem, removeFromCart, clearCart, applyCoupon, removeCoupon } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <Link to="/products" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart ({totalItems} items)</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product._id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4">
              <Link to={`/products/${item.product.slug}`} className="flex-shrink-0">
                <div className="relative w-24 h-24 rounded-lg bg-gray-100 overflow-hidden">
                  <img
                    src={(item.product.images && item.product.images[0] && item.product.images[0].url) || '/placeholder-product.svg'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div className="flex-1">
                <Link to={`/products/${item.product.slug}`}>
                  <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                </Link>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-lg font-semibold text-primary-600">{formatPrice(item.price)}</span>
                  <div className="flex items-center border border-gray-300 rounded-lg ml-auto">
                    <button
                      onClick={() => updateCartItem(item.product._id, item.quantity - 1, item.variant)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 text-gray-600 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItem(item.product._id, item.quantity + 1, item.variant)}
                      className="px-3 py-1 text-gray-600"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product._id, item.variant)}
                    className="ml-2 p-2 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4">
            <Link to="/products" className="text-primary-600 hover:underline">Continue Shopping</Link>
            <button onClick={clearCart} className="text-sm text-red-600 font-medium">Clear Cart</button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between"><span>Tax</span><span>{formatPrice(tax)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(shippingCost)}</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-3"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <input
                placeholder="Coupon code"
                defaultValue={couponCode || ''}
                onBlur={(e) => e.target.value && applyCoupon(e.target.value)}
                className="flex-1 border rounded px-3 py-2 text-sm"
              />
              {couponCode && <button onClick={removeCoupon} className="text-sm text-red-600">Remove</button>}
            </div>
            <Link to="/checkout" className="mt-4 block bg-primary-600 text-white text-center py-3 rounded-lg font-semibold">Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;