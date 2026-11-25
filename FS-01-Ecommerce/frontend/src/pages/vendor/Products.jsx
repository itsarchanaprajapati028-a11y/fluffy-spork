import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ProductCard from '../../components/ProductCard';

export function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api.get('/products/vendor/my-products').then((r) => setProducts(r.data.products || [])).catch(() => {});
  }, []);
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        <Link to="/vendor/products/add" className="bg-primary-600 text-white px-4 py-2 rounded-lg">Add Product</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}

export default Products;