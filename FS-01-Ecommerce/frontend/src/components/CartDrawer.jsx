import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useUI } from '../hooks/useUI';
import { formatPrice } from '../utils/helpers';
import { XMarkIcon, PlusIcon, MinusIcon, TrashIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';

const CartDrawerContent = () => {
  const { items, subtotal, discount, tax, shippingCost, total, totalItems, couponCode, isLoading } = useCart();
  const { cartDrawerOpen, setCartDrawerOpen } = useUI();
  const location = useLocation();
  
  const handleUpdateQuantity = async (productId: string, quantity: number, variant: any = null) => {
    await useCart.getState().updateCartItem(productId, quantity, variant);
  };
  
  const handleRemoveItem = async (productId: string, variant: any = null) => {
    await useCart.getState().removeFromCart(productId, variant);
  };
  
  const handleClearCart = async () => {
    await useCart.getState().clearCart();
  };
  
  const handleApplyCoupon = async () => {
    // Implementation would go here
  };
  
  const handleCheckout = () => {
    setCartDrawerOpen(false);
    window.location.href = '/checkout';
  };
  
  if (!cartDrawerOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label="Shopping cart" aria-modal="true">
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={() => setCartDrawerOpen(false)}
        aria-hidden="true"
      />
      
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Shopping Cart ({totalItems})
          </h2>
          <button
            onClick={() => setCartDrawerOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <svg className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-2 text-gray-500">Looks like you haven't added any items yet.</p>
              <Link to="/products" onClick={() => setCartDrawerOpen(false)} className="mt-6 inline-block">
                <button className="btn-primary">Continue Shopping</button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item: any) => (
                  <div key={`${item.product._id}-${JSON.stringify(item.variant)}`} className="flex gap-4">
                    <Link to={`/products/${item.product.slug}`} className="flex-shrink-0">
                      <div className="relative w-20 h-20 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={item.product.images?.[0]?.url || '/placeholder-product.svg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product.slug}`}>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-1">
                          {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm font-semibold text-primary-600">
                          {formatPrice(item.price)}
                        </span>
                        
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1, item.variant)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="px-3 text-sm font-medium text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1, item.variant)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            aria-label="Increase quantity"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.product._id, item.variant)}
                          className="ml-auto p-1 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {items.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  Clear Cart
                </button>
              )}
            </>
          )}
        </div>
        
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({couponCode})</span>
                <span className="font-medium">-{formatPrice(discount)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Estimated Tax</span>
              <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-gray-900">
                {shippingCost > 0 ? formatPrice(shippingCost) : 'Free'}
              </span>
            </div>
            
            <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full btn-primary py-3"
            >
              <span className="flex items-center justify-center gap-2">
                Proceed to Checkout
                <ArrowRightIcon className="h-5 w-5" />
              </span>
            </button>
            
            <p className="text-center text-xs text-gray-500">
              Shipping, taxes, and discount codes calculated at checkout.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function CartDrawer() {
  return createPortal(<CartDrawerContent />, document.body);
}