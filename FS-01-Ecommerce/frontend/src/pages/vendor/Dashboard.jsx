import { Link } from 'react-router-dom';

export function Dashboard() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Vendor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/vendor/products" className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow">My Products</Link>
        <Link to="/vendor/orders" className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow">Orders</Link>
        <Link to="/vendor/products/add" className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow">Add Product</Link>
      </div>
    </div>
  );
}

export default Dashboard;