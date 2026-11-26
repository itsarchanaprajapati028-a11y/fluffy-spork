import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import ProductCard from '../components/ProductCard';
import { formatPrice } from '../utils/helpers';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, TruckIcon, ShieldCheckIcon, ArrowRightIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

function normalizeImages(product) {
  const raw = Array.isArray(product?.images) ? product.images : [];
  const images = raw
    .map((img) => (typeof img === 'string' ? { url: img } : img))
    .filter((img) => img && img.url);
  if (images.length === 0) {
    return [{ url: '/placeholder-product.svg', alt: product?.name || 'Product' }];
  }
  return images;
}

export function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { fetchProductBySlug, fetchRelated, currentProduct, relatedProducts, isLoading, error, clearCurrentProduct } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { openModal, closeModal, modals } = useUI();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setSelectedVariant({});
    if (slug) fetchProductBySlug(slug);
    return () => clearCurrentProduct();
  }, [slug, fetchProductBySlug, clearCurrentProduct]);

  useEffect(() => {
    if (currentProduct?._id && currentProduct.category) {
      fetchRelated(currentProduct._id, currentProduct.category, 4);
    }
  }, [currentProduct?._id, currentProduct?.category, fetchRelated]);

  const product = currentProduct;
  const images = product ? normalizeImages(product) : [];
  const primaryImage = images[selectedImage] || images[0] || { url: '/placeholder-product.svg', alt: product?.name };

  const availableStock = product
    ? Math.max(0, Number(product.stock || 0) - Number(product.reservedStock || 0))
    : 0;
  const inStock = availableStock > 0;
  const discountPercent = Number(product?.discountPercent) || 0;
  const hasDiscount = discountPercent > 0 && Number(product?.originalPrice) > 0;
  const displayPrice = hasDiscount
    ? Number(product.originalPrice) * (1 - discountPercent / 100)
    : Number(product?.price) || 0;

  const vendorName = product?.vendor && typeof product.vendor === 'object'
    ? [product.vendor.firstName, product.vendor.lastName].filter(Boolean).join(' ')
    : '';

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      openModal('login');
      return;
    }
    setIsAddingToCart(true);
    try {
      await addToCart(product._id, quantity, Object.keys(selectedVariant).length ? selectedVariant : null);
      closeModal('login');
    } catch (err) {
      console.error('Add to cart failed:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      openModal('login');
      return;
    }
    setIsAddingToCart(true);
    try {
      await addToCart(product._id, quantity, Object.keys(selectedVariant).length ? selectedVariant : null);
      navigate('/checkout');
    } catch (err) {
      console.error('Buy now failed:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-6">
            {error || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <Link to="/products" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const renderSpecifications = () => {
    const attributes = product.attributes;
    if (!attributes || typeof attributes !== 'object' || Object.keys(attributes).length === 0) {
      return null;
    }
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(attributes).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <dt className="text-sm font-medium text-gray-500">{key}</dt>
              <dd className="text-sm text-gray-900">{String(value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  };

  const maxQuantity = Math.max(1, availableStock);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm">
            <li><Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link></li>
            {product.category && (
              <>
                <li className="text-gray-400">/</li>
                <li>
                  <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-gray-500 hover:text-gray-700 capitalize">
                    {product.category}
                  </Link>
                </li>
              </>
            )}
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 truncate max-w-xs" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                className="w-full h-full object-cover"
                id="main-product-image"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder-product.svg'; }}
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{discountPercent}%
                  </span>
                </div>
              )}
              {product.isFeatured && !hasDiscount && (
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    Featured
                  </span>
                </div>
              )}
              <button
                onClick={() => setShowImageModal(true)}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                aria-label="View full size"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === selectedImage ? 'border-primary-600' : 'border-transparent hover:border-gray-300'
                    }`}
                    aria-label={`View image ${index + 1}`}
                    aria-current={index === selectedImage ? 'true' : 'false'}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder-product.svg'; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              {vendorName && <p className="text-sm text-gray-500 mb-1">Sold by</p>}
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <StarIcon className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold text-gray-900">{(Number(product.rating) || 0).toFixed(1)}</span>
                  <span className="text-gray-500">({Number(product.reviewCount) || 0} reviews)</span>
                </div>
                {vendorName && (
                  <span className="text-primary-600 text-sm font-medium">{vendorName}</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <TruckIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {inStock ? `In Stock (${availableStock} available)` : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span className="text-sm">Secure checkout</span>
                </div>
              </div>
            </div>

            <div className="border-t border-b border-gray-100 py-6">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-primary-600">{formatPrice(displayPrice)}</span>
                {hasDiscount && (
                  <span className="text-2xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-sm text-green-600 mt-1">
                  Save {formatPrice(Number(product.originalPrice) - displayPrice)} ({discountPercent}% off)
                </p>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>
            )}

            {Array.isArray(product.variants) && product.variants.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Select Options</h3>
                <div className="space-y-4">
                  {product.variants.map((variantGroup, groupIndex) => {
                    if (!variantGroup || !Array.isArray(variantGroup.options)) return null;
                    return (
                      <div key={groupIndex}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{variantGroup.name}</label>
                        <div className="flex flex-wrap gap-2">
                          {variantGroup.options.map((option, optionIndex) => {
                            if (!option) return null;
                            const isSelected = selectedVariant?.[variantGroup.name] === option.value;
                            return (
                              <button
                                key={optionIndex}
                                onClick={() => setSelectedVariant((prev) => ({
                                  ...(prev || {}),
                                  [variantGroup.name]: option.value,
                                  priceAdjustment: option.priceAdjustment,
                                }))}
                                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                  isSelected
                                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                }`}
                              >
                                {option.value}
                                {Number(option.priceAdjustment) > 0 && (
                                  <span className="ml-1 text-primary-600">(+{formatPrice(option.priceAdjustment)})</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value, 10) || 1)))}
                  min="1"
                  max={maxQuantity}
                  className="w-16 text-center border-x border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Quantity"
                />
                <button
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              {availableStock < 20 && availableStock > 0 && (
                <span className="text-sm text-orange-600 font-medium">Only {availableStock} left in stock!</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isAddingToCart || !inStock}
              >
                {isAddingToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Adding to Cart...
                  </span>
                ) : (
                  'Add to Cart'
                )}
              </Button>
              <Button
                size="lg"
                variant="primary"
                className="flex-1"
                onClick={handleBuyNow}
                disabled={isAddingToCart || !inStock}
              >
                <ArrowRightIcon className="h-5 w-5 mr-2" />
                Buy Now
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-gray-50">
                <TruckIcon className="mx-auto h-6 w-6 text-primary-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over $100</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <ShieldCheckIcon className="mx-auto h-6 w-6 text-primary-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-500">100% protected</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <ChevronLeftIcon className="mx-auto h-6 w-6 text-primary-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                <p className="text-xs text-gray-500">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="border-t border-gray-100 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap">{product.description}</div>
            </div>
            {renderSpecifications()}
          </div>
        </div>

        {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
              <Link to={`/products?category=${encodeURIComponent(product.category || '')}`} className="text-primary-600 hover:text-primary-700 font-medium">
                View All <ArrowRightIcon className="h-4 w-4 inline ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        size="full"
        showCloseButton
      >
        <div className="relative aspect-square max-h-[80vh]">
          <img
            src={primaryImage.url}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder-product.svg'; }}
          />
        </div>
      </Modal>

      <Modal
        isOpen={modals.login || false}
        onClose={() => closeModal('login')}
        title="Sign In to Continue"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">Please sign in to add items to your cart or proceed to checkout.</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { closeModal('login'); openModal('register'); }}>
              Create Account
            </Button>
            <Button className="flex-1" onClick={() => { closeModal('login'); navigate('/login'); }}>
              Sign In
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProductDetail;
