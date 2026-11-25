import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/Button';
import { FormFields } from '../components/FormFields';
import { XMarkIcon, ChevronDownIcon, FilterIcon, SparklesIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const sortOptions = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'price', label: 'Price: Low to High', order: 'asc' },
  { value: 'price', label: 'Price: High to Low', order: 'desc' },
  { value: 'rating', label: 'Highest Rated', order: 'desc' },
  { value: 'reviewCount', label: 'Most Reviewed', order: 'desc' },
];

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    fetchProducts, 
    fetchCategories, 
    fetchBrands, 
    products, 
    categories, 
    brands, 
    pagination, 
    filters, 
    isLoading,
    setFilters,
    clearFilters
  } = useProducts();
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  useEffect(() => {
    fetchCategories();
    const initialCategory = searchParams.get('category') || '';
    const initialSearch = searchParams.get('search') || '';
    const initialSort = searchParams.get('sortBy') || 'createdAt';
    const initialOrder = searchParams.get('sortOrder') || 'desc';
    const initialBrands = searchParams.get('brand')?.split(',').filter(Boolean) || [];
    
    setSelectedCategory(initialCategory);
    setSortBy(initialSort);
    setSortOrder(initialOrder);
    setSelectedBrands(initialBrands);
    
    setFilters({
      category: initialCategory,
      search: initialSearch,
      sortBy: initialSort,
      sortOrder: initialOrder,
      brand: initialBrands.length > 0 ? initialBrands : undefined,
    });
    
    fetchProducts({
      category: initialCategory,
      search: initialSearch,
      sortBy: initialSort,
      sortOrder: initialOrder,
      brand: initialBrands.length > 0 ? initialBrands : undefined,
      page: 1,
      limit: 20,
    });
  }, [fetchCategories, fetchProducts, searchParams, setFilters]);
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, String(value));
        }
      }
    });
    params.set('page', '1');
    setSearchParams(params);
  };
  
  const handleSortChange = (value) => {
    const [field, order] = value.split('-');
    setSortBy(field);
    setSortOrder(order);
    handleFilterChange({ sortBy: field, sortOrder: order });
  };
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    handleFilterChange({ category: category || undefined, page: 1 });
  };
  
  const handleBrandToggle = (brand) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);
    handleFilterChange({ brand: newBrands.length > 0 ? newBrands : undefined, page: 1 });
  };
  
  const handlePriceChange = () => {
    handleFilterChange({
      minPrice: priceRange.min || undefined,
      maxPrice: priceRange.max || undefined,
      page: 1,
    });
  };
  
  const handleClearAllFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSelectedBrands([]);
    setSortBy('createdAt');
    setSortOrder('desc');
    clearFilters();
    setSearchParams({});
    fetchProducts({ page: 1, limit: 20 });
  };
  
  const hasActiveFilters = selectedCategory || priceRange.min || priceRange.max || selectedBrands.length > 0;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 lg:hidden">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            Filters
            {hasActiveFilters && (
              <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                {((selectedCategory ? 1 : 0) + (priceRange.min ? 1 : 0) + (priceRange.max ? 1 : 0) + selectedBrands.length)}
              </span>
            )}
          </button>
        </div>
      </div>
      
      <div className="flex">
        <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 z-40 lg:relative lg:translate-x-0 ${showFilters ? 'translate-x-0' : '-translate-x-full'}`}>
          {showFilters && (
            <div className="fixed inset-0 bg-black/50 lg:hidden" onClick={() => setShowFilters(false)} />
          )}
          <div className="p-4 lg:p-6 overflow-y-auto h-full">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={!selectedCategory}
                      onChange={() => handleCategoryChange('')}
                      className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category.slug || category.name}
                        checked={selectedCategory === (category.slug || category.name)}
                        onChange={() => handleCategoryChange(category.slug || category.name)}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 truncate">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="0.01"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <button
                  onClick={handlePriceChange}
                  className="mt-2 w-full btn-secondary text-sm"
                >
                  Apply
                </button>
              </div>
              
              {brands.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brands</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.slice(0, 20).map((brand) => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={brand}
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleClearAllFilters}
                  disabled={!hasActiveFilters}
                  className="w-full btn-outline text-sm"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </aside>
        
        <main className="flex-1 lg:ml-0 min-w-0">
          <div className="bg-white border-b border-gray-100 px-4 py-4 lg:px-6 lg:py-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600 text-sm mt-1">
                  {pagination.total} products found
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative hidden sm:block">
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    {sortOptions.map(option => (
                      <option key={`${option.value}-${option.order || 'desc'}`} value={`${option.value}-${option.order || 'desc'}`}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </div>
                
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                  Filters
                  {hasActiveFilters && (
                    <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {((selectedCategory ? 1 : 0) + (priceRange.min ? 1 : 0) + (priceRange.max ? 1 : 0) + selectedBrands.length)}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                    Category: {categories.find((c) => (c.slug || c.name) === selectedCategory)?.name || selectedCategory}
                    <button onClick={() => handleCategoryChange('')} className="ml-1 p-0.5 hover:bg-primary-100 rounded-full">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </span>
                )}
                {priceRange.min && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                    Min: ${priceRange.min}
                    <button onClick={() => { setPriceRange({ ...priceRange, min: '' }); handlePriceChange(); }} className="ml-1 p-0.5 hover:bg-primary-100 rounded-full">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </span>
                )}
                {priceRange.max && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                    Max: ${priceRange.max}
                    <button onClick={() => { setPriceRange({ ...priceRange, max: '' }); handlePriceChange(); }} className="ml-1 p-0.5 hover:bg-primary-100 rounded-full">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </span>
                )}
                {selectedBrands.map(brand => (
                  <span key={brand} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                    {brand}
                    <button onClick={() => handleBrandToggle(brand)} className="ml-1 p-0.5 hover:bg-primary-100 rounded-full">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 lg:p-6">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-1" />
                    <div className="h-5 bg-gray-200 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => fetchProducts({ ...filters, page: pagination.page - 1 })}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1 mx-4">
                      {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => fetchProducts({ ...filters, page: pageNum })}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                              pageNum === pagination.page
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => fetchProducts({ ...filters, page: pagination.page + 1 })}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your filters or search terms</p>
                <button
                  onClick={handleClearAllFilters}
                  className="mt-6 btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Products;