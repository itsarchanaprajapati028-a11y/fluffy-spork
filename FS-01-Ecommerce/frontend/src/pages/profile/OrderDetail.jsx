import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

export function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data.order)).catch(() => {});
  }, [id]);
  if (!order) return <div className="py-8 text-center text-gray-500">Loading...</div>;
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order {order.orderNumber}</h1>
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-2">
        <div>Status: <span className="font-semibold">{order.status}</span></div>
        <div>Payment: <span className="font-semibold">{order.paymentStatus}</span></div>
        <div>Total: <span className="font-semibold">${order.total}</span></div>
        <div className="mt-4 space-y-2">
          {(order.items || []).map((it, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{it.name} x{it.quantity}</span>
              <span>${it.price * it.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;