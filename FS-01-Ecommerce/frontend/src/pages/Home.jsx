import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useUI } from '../hooks/useUI';
import ProductCard from '../components/ProductCard';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { SparklesIcon, TruckIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const features = [
  {
    icon: SparklesIcon,
    title: 'Curated Marketplace',
    description: 'Hand-picked products from verified vendors worldwide',
  },
  {
    icon: TruckIcon,
    title: 'Fast Shipping',
    description: 'Quick delivery with real-time tracking on all orders',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Payments',
    description: 'Protected transactions with buyer protection guarantee',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: '24/7 Support',
    description: 'Dedicated customer service whenever you need help',
  },
];

const categories = [
  { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop', count: '2,500+' },
  { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', count: '5,000+' },
  { name: 'Home & Garden', slug: 'home-garden', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', count: '3,200+' },
  { name: 'Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop', count: '1,800+' },
  { name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop', count: '2,100+' },
  { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=300&fit=crop', count: '2,500+' },
];

export function Home() {
  const { fetchFeaturedProducts, fetchProducts, featuredProducts, isLoading } = useProducts();
  const { openModal } = useUI();
  
  useEffect(() => {
    fetchFeaturedProducts(8);
    fetchProducts({ isFeatured: true, limit: 8 });
  }, [fetchFeaturedProducts, fetchProducts]);
  
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%2E')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              New Season Collection Now Available
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Discover Amazing Products
              <br />
              <span className="text-yellow-300">From Top Vendors</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl">
              Shop thousands of curated products from verified sellers worldwide. 
              Fast shipping, secure payments, and 24/7 support.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="!bg-white !text-primary-600 hover:!bg-gray-100">
                <Link to="/products">Start Shopping</Link>
              </Button>
              <Button size="lg" variant="outline" className="!border-white !text-white hover:!bg-white/10" asChild>
                <Link to="/register">Become a Vendor <ArrowRightIcon className="h-5 w-5 ml-2" /></Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>
      
      <section className="py-16 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-xl flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-600 mt-1">Explore our curated collections</p>
            </div>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium">
              View All <ArrowRightIcon className="h-4 w-4 inline ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link key={index} to={`/products?category=${category.slug}`} className="group relative aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder-product.svg'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm text-white/80">{category.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600 mt-1">Hand-picked selections from our top vendors</p>
            </div>
            <Link to="/products?isFeatured=true" className="text-primary-600 hover:text-primary-700 font-medium">
              View All <ArrowRightIcon className="h-4 w-4 inline ml-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-1" />
                  <div className="h-5 bg-gray-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>
      
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of vendors growing their business on FS-01. 
            Easy setup, low fees, and access to millions of customers.
          </p>
          <Button size="lg" variant="secondary" asChild className="!bg-white !text-primary-600 hover:!bg-gray-100">
            <Link to="/register">Become a Vendor</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Home;