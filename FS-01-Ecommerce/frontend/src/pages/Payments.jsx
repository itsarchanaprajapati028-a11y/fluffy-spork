import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { Button } from '../components/Button';
import { Card, CardHeader, CardBody } from '../components/Card';
import RazorpayDemoCheckout from '../components/RazorpayDemoCheckout';
import { formatPrice, formatDate } from '../utils/helpers';
import { ShieldCheckIcon, CreditCardIcon, CheckCircleIcon, ArrowRightIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_STYLES = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
};

export function Payments() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { user } = useAuth();
  const { items, total, shippingAddress, fetchCart } = useCart();
  const {
    orders,
    fetchOrders,
    fetchOrder,
    createOrder,
    fetchRazorpayConfig,
    createRazorpayOrder,
    verifyRazorpayPayment,
    razorpayConfig,
    isPaying,
    error: orderError,
  } = useOrders();

  const [order, setOrder] = useState(null);
  const [mode, setMode] = useState(orderId ? 'order' : 'cart');
  const [isLoadingOrder, setIsLoadingOrder] = useState(Boolean(orderId));
  const [session, setSession] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRazorpayConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!orderId) {
      setMode('cart');
      setOrder(null);
      setIsLoadingOrder(false);
      return;
    }
    setMode('order');
    setIsLoadingOrder(true);
    let active = true;
    fetchOrder(orderId).then((result) => {
      if (!active) return;
      if (result) {
        setOrder(result);
      } else {
        setError('Order not found or you do not have access to it.');
      }
      setIsLoadingOrder(false);
    });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    fetchCart();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const amount = mode === 'order' ? Number(order?.total) || 0 : Number(total) || 0;
  const unpaidOrders = (orders || []).filter((o) => o.paymentStatus !== 'paid');

  const startPayment = async () => {
    setError('');
    setSuccess(null);

    let target = order;
    if (mode === 'order') {
      if (!target && orderId) target = await fetchOrder(orderId);
      if (!target) {
        setError('Order not found. Please try again.');
        return;
      }
      if (target.paymentStatus === 'paid') {
        setSuccess({ order: target, paymentId: target.razorpayPaymentId || 'already_paid' });
        return;
      }
    } else {
      if (!items.length) {
        setError('Your cart is empty. Add products to your cart or open an unpaid order below.');
        return;
      }
      const orderData = {
        shippingAddress: shippingAddress || {
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || '',
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'US',
        },
        paymentMethod: 'razorpay',
      };
      const created = await createOrder(orderData);
      if (!created.success) {
        setError(created.error || 'Could not create order from cart.');
        return;
      }
      target = created.order;
      setOrder(created.order);
      setMode('order');
    }

    const rzp = await createRazorpayOrder(target._id);
    if (!rzp || rzp.error) {
      setError(rzp?.error || 'Could not start Razorpay checkout.');
      return;
    }
    setSession({ order: target, razorpay: rzp });
    setIsCheckoutOpen(true);
  };

  const handlePay = async ({ razorpay_payment_id, razorpay_signature }) => {
    if (!session) return;
    setError('');
    const result = await verifyRazorpayPayment({
      orderId: session.order._id,
      razorpay_order_id: session.razorpay.razorpayOrder.id,
      razorpay_payment_id,
      razorpay_signature,
    });
    if (result.success) {
      setIsCheckoutOpen(false);
      setSuccess({ order: result.data.order || session.order, paymentId: result.data.paymentId || razorpay_payment_id });
    } else {
      setError(result.error || 'Payment verification failed.');
    }
  };

  if (isLoadingOrder) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto text-center space-y-6 bg-white rounded-2xl border border-gray-100 p-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Successful</h1>
          <p className="text-gray-600">
            {formatPrice(Number(success.order?.total) || 0)} paid via Razorpay (demo).
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Order: <strong>{success.order?.orderNumber}</strong></p>
            <p>Payment ID: <code>{success.paymentId}</code></p>
            <p>Status: <span className="text-green-600 font-medium">Paid</span></p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link to={`/orders/${success.order?._id}`}>View Order</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">Secure checkout powered by Razorpay.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            Razorpay Demo Mode
          </span>
        </div>

        <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="h-6 w-6 text-primary-600 flex-shrink-0" />
            <div className="text-sm text-primary-900">
              <p className="font-medium">Test mode is enabled — no real money will be charged.</p>
              <p className="text-primary-700 mt-1">
                Use UPI <code className="bg-white/70 px-1 rounded">success@razorpay</code>, test card{' '}
                <code className="bg-white/70 px-1 rounded">4111 1111 1111 1111</code> (any future expiry, CVV 123),
                or any netbanking option. Key: <code className="bg-white/70 px-1 rounded">{razorpayConfig?.keyId || 'rzp_test_demo'}</code>
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm" role="alert">
            {error}
          </div>
        )}
        {orderError && !error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm" role="alert">
            {orderError}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {mode === 'order' ? 'Order Payment' : 'Cart Payment'}
                  </h2>
                  <span className="text-xs font-semibold tracking-wide text-gray-500">RAZORPAY</span>
                </div>
              </CardHeader>
              <CardBody>
                {mode === 'order' && order ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-500">Order</p>
                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-xl font-bold text-gray-900">{formatPrice(Number(order.total) || 0)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[order.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                        {order.paymentStatus || 'pending'}
                      </span>
                    </div>
                    {order.paymentStatus === 'paid' ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
                        This order has already been paid{order.razorpayPaymentId ? ` (${order.razorpayPaymentId})` : ''}.
                      </div>
                    ) : (
                      <Button size="lg" className="w-full" onClick={startPayment} disabled={isPaying}>
                        <LockClosedIcon className="h-5 w-5 mr-2" />
                        {isPaying ? 'Starting checkout...' : `Pay ${formatPrice(amount)} with Razorpay`}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.length === 0 ? (
                      <p className="text-gray-500">Your cart is empty. Open an unpaid order below or add products first.</p>
                    ) : (
                      <>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {items.map((item) => (
                            <div key={`${item.product?._id}-${JSON.stringify(item.variant)}`} className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                <img
                                  src={item.product?.images?.[0]?.url || '/placeholder-product.svg'}
                                  alt={item.product?.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder-product.svg'; }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{item.product?.name}</p>
                                <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                              </div>
                              <p className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>
                        <Button size="lg" className="w-full" onClick={startPayment} disabled={isPaying}>
                          <CreditCardIcon className="h-5 w-5 mr-2" />
                          {isPaying ? 'Starting checkout...' : `Pay ${formatPrice(amount)} with Razorpay`}
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">How the demo works</h2>
              </CardHeader>
              <CardBody>
                <ol className="space-y-3 text-sm text-gray-600 list-decimal list-inside">
                  <li>A demo Razorpay order is created on the backend with your order amount.</li>
                  <li>The Razorpay-style checkout opens preloaded with Razorpay test credentials.</li>
                  <li>Submitting generates a demo payment id and the backend verifies and marks the order paid.</li>
                  <li>No real Razorpay account or network call is used while <code>RAZORPAY_DEMO=true</code>.</li>
                </ol>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{mode === 'order' ? 'Order total' : 'Cart total'}</span>
                    <span className="font-semibold text-gray-900">{formatPrice(amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency</span>
                    <span className="font-medium text-gray-900">{razorpayConfig?.currency || 'USD'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider</span>
                    <span className="font-medium text-gray-900">Razorpay</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mode</span>
                    <span className="font-medium text-yellow-700">Demo</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {unpaidOrders.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">Unpaid Orders</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {unpaidOrders.slice(0, 5).map((o) => (
                      <Link
                        key={o._id}
                        to={`/payments?orderId=${o._id}`}
                        className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/40 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{o.orderNumber}</p>
                          <p className="text-xs text-gray-500">{formatPrice(Number(o.total) || 0)} · {o.paymentStatus}</p>
                        </div>
                        <ArrowRightIcon className="h-4 w-4 text-primary-600 flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            <div className="text-center text-xs text-gray-500">
              <p className="flex items-center justify-center gap-1">
                <LockClosedIcon className="h-3.5 w-3.5" />
                PCI-DSS compliant checkout experience
              </p>
            </div>
          </div>
        </div>
      </div>

      <RazorpayDemoCheckout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        config={razorpayConfig}
        amount={session?.order?.total}
        orderNumber={session?.order?.orderNumber}
        onPay={handlePay}
        isProcessing={isPaying}
        error={error}
      />
    </div>
  );
}

export default Payments;
