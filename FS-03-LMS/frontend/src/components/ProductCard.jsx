import { Link } from 'react-router-dom';

export function ProductCard({ product }) {
  if (!product) return null;
  const image = (product.images && product.images[0] && product.images[0].url) || (product.thumbnail && product.thumbnail.url) || '/placeholder-course.svg';
  return (
    <Link to={`/courses/${product.slug}`} className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img src={image} alt={product.title || product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{product.title || product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.shortDescription}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-primary-600">${product.price}</span>
          {product.originalPrice > product.price && <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;