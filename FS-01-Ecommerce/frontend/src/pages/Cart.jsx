import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import { useProducts } from '../../hooks/useProducts';
import { Button } from '../../components/Button';
import { FormFields } from '../../components/FormFields';
import { CartDrawer } from '../../components/CartDrawer';
import { formatPrice } from '../../utils/helpers';
import { PlusIcon, MinusIcon, TrashIcon, ArrowRightIcon, GiftIcon, TagIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/LoadingSpinner';

export function Cart() {
  const navigate = useNavigate();
  const { 
    items, 
    subtotal, 
    discount, 
    tax, 
    shippingCost, 
    total, 
    totalItems, 
    couponCode, 
    isLoading,
    fetchCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    setShippingAddress,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const { openModal } = useUI();
  const { fetchProducts } = useProducts();
  
  const [couponInput, setCouponInput] = useState('');
  const [shippingAddress, setShippingAddressState] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
  });
  
  const handleUpdateQuantity = async (productId, quantity, variant = null) => {
    if (quantity < 1) {
      await removeFromCart(productId, variant);
    } else {
      await updateCartItem(productId, quantity, variant);
    }
  };
  
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    const result = await applyCoupon(couponInput);
    if (result.success) {
      setCouponInput('');
    }
  };
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      openModal('login');
      return;
    }
    navigate('/checkout');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
  );
  
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">Looks like you haven't added any items yet.</p>
            <Link to="/products" className="btn-primary inline-block mt-6">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-y border-gray-100">
                  {items.map(function(item) {
                    return <div key={item.product._id}>{item.product.name}</div>;
                  })}
                  </div>
                  
                  {items.length > 0 ? (
                    <div className="p-6 border-t border-gray-100 flex justify-between">
                      <span className="text-gray-600">
                        {items.length === 1 ? '1 item' : items.length + ' items'}
                      </span>
                      <button
                        onClick={clearCart}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Clear Cart
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-3">
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
                    
                    <div className="flex justify-between text-base font-semibold text-gray-900 pt-3 border-t border-gray-100">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {couponCode ? (
                        <button
                          onClick={removeCoupon}
                          className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={handleApplyCoupon}
                          disabled={!couponInput.trim()}
                          className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                      <p className="text-xs text-gray-500">On orders over $100</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button size="lg" className="w-full" onClick={handleCheckout}>
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/products')}>
                    Continue Shopping
                  </Button>
                </div>
                
                <p className="mt-4 text-center text-xs text-gray-500">
                  Shipping, taxes, and discount codes calculated at checkout.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Shipping Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormFields.Input
                    label="First Name"
                    value={shippingAddress.firstName}
                    onChange={(e) => setShippingAddressState({ ...shippingAddress, firstName: e.target.value })}
                    required
                  />
                  <FormFields.Input
                    label="Last Name"
                    value={shippingAddress.lastName}
                    onChange={(e) => setShippingAddressState({ ...shippingAddress, lastName: e.target.value })}
                    required
                  />
                  <FormFields.Input
                    label="Street Address"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddressState({ ...shippingAddress, street: e.target.value })}
                    required
                    className="col-span-2"
                  />
                  <FormFields.Input
                    label="City"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddressState({ ...shippingAddress, city: e.target.value })}
                    required
                  />
                  <FormFields.Input
                    label="State"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddressState({ ...shippingAddress, state: e.target.value })}
                    required
                  />
                  <FormFields.Input
                    label="Postal Code"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddressState({ ...shippingAddress, postalCode: e.target.value })}
                    required
                  />
                  <FormFields.Input
                    label="Country"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddressState({ ...shippingAddress, country: e.target.value })}
                    required
                  />
                  <FormFields.Input
                    label="Phone"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddressState({ ...shippingAddress, phone: e.target.value })}
                    type="tel"
                    className="col-span-2"
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full" 
                  onClick={() => setShippingAddress(shippingAddress)}
                >
                  Save Address
                </Button>
            </div>
          </div>
        </div>
      </div>
  </div>;
}

export default Cart;
