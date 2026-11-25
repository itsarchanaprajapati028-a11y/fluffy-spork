import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { Button } from '../../components/Button';
import { FormFields } from '../../components/FormFields';
import { Card, CardHeader, CardBody } from '../../components/Card';
import { formatPrice } from '../../utils/helpers';
import { CreditCardIcon, ShieldCheckIcon, TruckIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/LoadingSpinner';

const paymentMethods = [
  { id: 'stripe', name: 'Credit/Debit Card', icon: CreditCardIcon, description: 'Visa, Mastercard, Amex' },
  { id: 'paypal', name: 'PayPal', icon: ShieldCheckIcon, description: 'Pay with your PayPal account' },
  { id: 'cod', name: 'Cash on Delivery', icon: TruckIcon, description: 'Pay when you receive your order' },
];

const steps = [
  { id: 1, name: 'Shipping', description: 'Delivery address' },
  { id: 2, name: 'Payment', description: 'Payment method' },
  { id: 3, name: 'Review', description: 'Confirm order' },
];

export function Checkout() {
  const navigate = useNavigate();
  const { 
    items, 
    subtotal, 
    discount, 
    tax, 
    shippingCost, 
    total, 
    shippingAddress,
    couponCode,
    fetchCart,
  } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { createOrder } = useOrders();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('stripe');
  const [formData, setFormData] = useState({
    firstName: shippingAddress?.firstName || user?.firstName || '',
    lastName: shippingAddress?.lastName || user?.lastName || '',
    email: user?.email || '',
    phone: shippingAddress?.phone || '',
    street: shippingAddress?.street || '',
    city: shippingAddress?.city || '',
    state: shippingAddress?.state || '',
    postalCode: shippingAddress?.postalCode || '',
    country: shippingAddress?.country || 'US',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    saveInfo: false,
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const validateStep = (step) => {
    setErrors({});
    
    if (step === 1) {
      if (!formData.firstName.trim()) setErrors({ firstName: 'First name is required' });
      if (!formData.lastName.trim()) setErrors({ lastName: 'Last name is required' });
      if (!formData.email.trim()) setErrors({ email: 'Email is required' });
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) setErrors({ email: 'Invalid email format' });
      if (!formData.street.trim()) setErrors({ street: 'Street address is required' });
      if (!formData.city.trim()) setErrors({ city: 'City is required' });
      if (!formData.state.trim()) setErrors({ state: 'State is required' });
      if (!formData.postalCode.trim()) setErrors({ postalCode: 'Postal code is required' });
      if (!formData.country.trim()) setErrors({ country: 'Country is required' });
    }
    
    if (step === 2 && selectedPayment === 'stripe') {
      if (!formData.cardName.trim()) setErrors({ cardName: 'Name on card is required' });
      if (!formData.cardNumber.trim()) setErrors({ cardNumber: 'Card number is required' });
      else if (formData.cardNumber.replace(/\s/g, '').length < 15) setErrors({ cardNumber: 'Invalid card number' });
      if (!formData.cardExpiry.trim()) setErrors({ cardExpiry: 'Expiry date is required' });
      else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) setErrors({ cardExpiry: 'Invalid expiry format (MM/YY)' });
      if (!formData.cardCvc.trim()) setErrors({ cardCvc: 'CVC is required' });
      else if (formData.cardCvc.length < 3) setErrors({ cardCvc: 'Invalid CVC' });
    }
    
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };
  
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setIsProcessing(true);
    try {
      const orderData = {
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        billingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: selectedPayment,
        couponCode,
      };
      
      const result = await createOrder(orderData);
      if (result.success) {
        setOrderCreated(true);
        setOrderId(result.order._id);
      } else {
        setErrors({ form: result.error || 'Failed to create order' });
      }
    } catch (error) {
      setErrors({ form: 'An error occurred. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!isAuthenticated) {
    return navigate('/login');
  }
  
  if (items.length === 0) {
    return navigate('/cart');
  }
  
  if (orderCreated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h2>
          <p className="text-gray-600">Your order has been confirmed. Order ID: <strong>{orderId}</strong></p>
          <p className="text-sm text-gray-500">A confirmation email has been sent to {formData.email}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(`/orders/${orderId}`)}>View Order</Button>
            <Button variant="outline" onClick={() => navigate('/products')}>Continue Shopping</Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-1">{items.length} item{items.length !== 1 ? 's' : ''} • {formatPrice(total)}</p>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`flex items-center ${index < steps.length - 1 ? 'relative' : ''}`}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep >= step.id ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.id ? <CheckCircleIcon className="h-5 w-5" /> : step.id}
                  </div>
                  <div className="hidden sm:block ml-4">
                    <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'}`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute left-1/2 top-5 w-full h-0.5 bg-gray-200 z-0" />
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentStep === 1 ? 'Shipping Address' : currentStep === 2 ? 'Payment Method' : 'Review Order'}
                </h2>
              </CardHeader>
              <CardBody>
                {errors.form && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm" role="alert">
                    {errors.form}
                  </div>
                )}
                
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormFields.Input
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        error={errors.firstName}
                        required
                      />
                      <FormFields.Input
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        error={errors.lastName}
                        required
                      />
                    </div>
                    <FormFields.Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      error={errors.email}
                      required
                    />
                    <FormFields.Input
                      label="Phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <FormFields.Input
                      label="Street Address"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      error={errors.street}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormFields.Input
                        label="City"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        error={errors.city}
                        required
                      />
                      <FormFields.Input
                        label="State"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        error={errors.state}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormFields.Input
                        label="Postal Code"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        error={errors.postalCode}
                        required
                      />
                      <FormFields.Select
                        label="Country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        options={[
                          { value: 'US', label: 'United States' },
                          { value: 'CA', label: 'Canada' },
                          { value: 'UK', label: 'United Kingdom' },
                          { value: 'AU', label: 'Australia' },
                        ]}
                        error={errors.country}
                        required
                      />
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.saveInfo}
                        onChange={(e) => setFormData({ ...formData, saveInfo: e.target.checked })}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-600">Save this information for next time</span>
                    </label>
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Choose Payment Method</h3>
                      <div className="space-y-3">
                        {paymentMethods.map(method => (
                          <label
                            key={method.id}
                            className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                              selectedPayment === method.id
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={method.id}
                              checked={selectedPayment === method.id}
                              onChange={() => setSelectedPayment(method.id)}
                              className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                            />
                            <method.icon className="h-6 w-6 text-gray-400" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{method.name}</p>
                              <p className="text-sm text-gray-500">{method.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {selectedPayment === 'stripe' && (
                      <div className="border-t border-gray-100 pt-6 space-y-4">
                        <h3 className="font-medium text-gray-900">Card Details</h3>
                        <FormFields.Input
                          label="Name on Card"
                          value={formData.cardName}
                          onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                          error={errors.cardName}
                          placeholder="John Doe"
                          required
                        />
                        <FormFields.Input
                          label="Card Number"
                          value={formData.cardNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                            setFormData({ ...formData, cardNumber: value });
                          }}
                          error={errors.cardNumber}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormFields.Input
                            label="Expiry (MM/YY)"
                            value={formData.cardExpiry}
                            onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                            error={errors.cardExpiry}
                            placeholder="12/25"
                            required
                          />
                          <FormFields.Input
                            label="CVC"
                            value={formData.cardCvc}
                            onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                            error={errors.cardCvc}
                            placeholder="123"
                            type="password"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Shipping Address</h3>
                      <address className="text-gray-600 not-italic">
                        {formData.firstName} {formData.lastName}<br />
                        {formData.street}<br />
                        {formData.city}, {formData.state} {formData.postalCode}<br />
                        {formData.country}<br />
                        Phone: {formData.phone}
                      </address>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Payment Method</h3>
                      <p className="text-gray-600 capitalize">{selectedPayment === 'stripe' ? 'Credit/Debit Card' : selectedPayment === 'paypal' ? 'PayPal' : 'Cash on Delivery'}</p>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
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
                          <span className="font-medium text-gray-900">{shippingCost > 0 ? formatPrice(shippingCost) : 'Free'}</span>
                        </div>
                        <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-100">
                          <span>Total</span>
                          <span>{formatPrice(total)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="/terms" className="text-primary-600 hover:text-primary-500">Terms of Service</a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
                      </label>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.product._id}-${JSON.stringify(item.variant)}`} className="flex gap-3">
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={item.product.images?.[0]?.url || '/placeholder-product.svg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-primary-600">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-100 pt-4 space-y-3">
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
                    <span className="font-medium text-gray-900">{shippingCost > 0 ? formatPrice(shippingCost) : 'Free'}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    Shipping, taxes, and discount codes calculated at checkout.
                  </p>
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody className="pt-0">
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={currentStep < 3 ? handleNext : handleSubmit}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        {currentStep === 3 ? 'Placing Order...' : 'Continue'}
                      </span>
                    ) : currentStep === 3 ? (
                      'Place Order'
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Continue
                        <ArrowRightIcon className="h-5 w-5" />
                      </span>
                    )}
                  </Button>
                  {currentStep > 1 && (
                    <Button variant="outline" className="w-full" onClick={handleBack}>
                      Back
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
            
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div>
                  <h4 className="font-medium text-primary-900">Secure Checkout</h4>
                  <p className="text-sm text-primary-700 mt-1">
                    Your payment information is encrypted and secure. We don't store your card details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;