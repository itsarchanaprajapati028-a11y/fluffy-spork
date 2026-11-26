import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { formatPrice } from '../utils/helpers';
import { ShieldCheckIcon, CreditCardIcon, DevicePhoneMobileIcon, BuildingLibraryIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const tabs = [
  { id: 'upi', name: 'UPI', icon: DevicePhoneMobileIcon },
  { id: 'card', name: 'Card', icon: CreditCardIcon },
  { id: 'netbanking', name: 'Netbanking', icon: BuildingLibraryIcon },
];

export default function RazorpayDemoCheckout({
  isOpen,
  onClose,
  config,
  amount,
  orderNumber,
  onPay,
  isProcessing,
  error,
}) {
  const [tab, setTab] = useState('upi');
  const [upiId, setUpiId] = useState('success@razorpay');
  const [card, setCard] = useState({ number: '4111 1111 1111 1111', expiry: '12/30', cvv: '123', name: 'Demo Customer' });
  const [bank, setBank] = useState('HDFC Bank');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTab('upi');
      setUpiId(config?.testCards?.upi || 'success@razorpay');
      setCard({
        number: config?.testCards?.card || '4111 1111 1111 1111',
        expiry: config?.testCards?.expiry || '12/30',
        cvv: config?.testCards?.cvv || '123',
        name: 'Demo Customer',
      });
      setBank(config?.testCards?.netbanking || 'HDFC Bank');
      setLocalError('');
    }
  }, [isOpen, config]);

  const handlePay = async () => {
    setLocalError('');
    if (tab === 'upi' && !/^[\w.-]+@[\w.-]+$/.test(upiId.trim())) {
      setLocalError('Enter a valid UPI ID (e.g. success@razorpay)');
      return;
    }
    if (tab === 'card') {
      const digits = card.number.replace(/\s/g, '');
      if (digits.length < 15) return setLocalError('Enter a valid test card number');
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return setLocalError('Expiry must be MM/YY');
      if (card.cvv.length < 3) return setLocalError('Enter a valid CVV');
    }
    const paymentId = `pay_demo_${Math.random().toString(36).slice(2, 12)}`;
    await onPay({
      razorpay_payment_id: paymentId,
      razorpay_signature: `demo_signature_${Date.now()}`,
      method: tab,
      instrument: tab === 'upi' ? upiId : tab === 'card' ? `card_${card.number.replace(/\s/g, '').slice(-4)}` : bank,
    });
  };

  const displayError = localError || error;

  return (
    <Modal isOpen={isOpen} onClose={isProcessing ? () => {} : onClose} size="md" showCloseButton={!isProcessing}>
      <div className="-m-4">
        <div className="bg-[#072654] text-white px-5 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-bold">R</div>
              <div>
                <p className="font-semibold leading-tight">Razorpay</p>
                <p className="text-xs text-white/70">{config?.merchantName || 'FS-01 Demo Store'}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold tracking-wider bg-yellow-400 text-yellow-950 px-2 py-1 rounded">
              TEST MODE
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-xs text-white/70">Amount payable</p>
              <p className="text-2xl font-bold">{formatPrice(Number(amount) || 0)}</p>
            </div>
            <p className="text-xs text-white/70 text-right">
              {orderNumber ? `Order ${orderNumber}` : 'Cart payment'}
              <br />Key: {config?.keyId || 'rzp_test_demo'}
            </p>
          </div>
        </div>

        <div className="p-5">
          <div className="flex gap-2 mb-5">
            {tabs.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  tab === id
                    ? 'border-[#072654] bg-[#072654]/5 text-[#072654]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {name}
              </button>
            ))}
          </div>

          {tab === 'upi' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">UPI ID</label>
              <input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#072654]/30"
                placeholder="success@razorpay"
              />
              <p className="text-xs text-gray-500">Demo success UPI: <code>success@razorpay</code></p>
            </div>
          )}

          {tab === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#072654]/30"
                  placeholder="4111 1111 1111 1111"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                  <input
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#072654]/30"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#072654]/30"
                    placeholder="123"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">Demo test card: <code>4111 1111 1111 1111</code> · any future expiry · CVV 123</p>
            </div>
          )}

          {tab === 'netbanking' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Bank</label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#072654]/30"
              >
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>State Bank of India</option>
                <option>Axis Bank</option>
                <option>Kotak Mahindra Bank</option>
              </select>
              <p className="text-xs text-gray-500">Demo netbanking always succeeds.</p>
            </div>
          )}

          {displayError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm" role="alert">
              {displayError}
            </div>
          )}

          <Button className="w-full mt-5 !bg-[#3395ff] hover:!bg-[#1f7fe8]" onClick={handlePay} disabled={isProcessing}>
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Processing payment...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LockClosedIcon className="h-4 w-4" />
                Pay {formatPrice(Number(amount) || 0)}
              </span>
            )}
          </Button>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <ShieldCheckIcon className="h-4 w-4 text-green-600" />
            Demo mode — no real money will be charged
          </div>
        </div>
      </div>
    </Modal>
  );
}
