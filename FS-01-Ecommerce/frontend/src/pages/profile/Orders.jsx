import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/orders').then((r) => setOrders(r.data.orders || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="py-8 text-center text-gray-500">Loading...</div>;
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o._id} to={`/orders/${o._id}`} className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow">
              <div className="flex justify-between">
                <span className="font-semibold">{o.orderNumber}</span>
                <span className="text-gray-500">{o.status}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Total: ${o.total}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;