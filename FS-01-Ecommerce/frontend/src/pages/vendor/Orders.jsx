import { useEffect, useState } from 'react';
import api from '../../utils/api';

export function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api.get('/orders/vendor').then((r) => setOrders(r.data.orders || [])).catch(() => {});
  }, []);
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Vendor Orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="bg-white rounded-xl border border-gray-100 p-4 flex justify-between">
            <span className="font-semibold">{o.orderNumber}</span>
            <span className="text-gray-500">{o.status} · ${o.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;