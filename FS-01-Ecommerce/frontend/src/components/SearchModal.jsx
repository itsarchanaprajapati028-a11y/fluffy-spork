import { useState, useEffect, useRef } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useUI } from '../hooks/useUI';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon, SparklesIcon, ClockIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';
import { debounce } from '../utils/helpers';

const SearchModalContent = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchModalOpen, setSearchModalOpen } = useUI();
  const { fetchProducts } = useProducts();
  
  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      const stored = localStorage.getItem('recentSearches');
      if (stored) setRecentSearches(JSON.parse(stored));
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [searchModalOpen]);
  
  const handleClose = () => {
    setSearchModalOpen(false);
    setQuery('');
    setSuggestions([]);
    setShowResults(false);
  };
  
  const debouncedSearch = useRef(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const result = await fetchProducts({ search: searchQuery, limit: 5 });
        setSuggestions(result.products || []);
      } catch (error) {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300)
  ).current;
  
  useEffect(() => {
    if (query.length >= 2) {
      debouncedSearch(query);
      setShowResults(true);
    } else {
      setSuggestions([]);
      setShowResults(false);
    }
  }, [query]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const searches = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(searches));
      setRecentSearches(searches);
      setSearchModalOpen(false);
      window.location.href = `/products?search=${encodeURIComponent(query.trim())}`;
    }
  };
  
  const handleSuggestionClick = (product: any) => {
    const searches = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    setSearchModalOpen(false);
    window.location.href = `/products/${product.slug}`;
  };
  
  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    setSearchModalOpen(false);
    window.location.href = `/products?search=${encodeURIComponent(search)}`;
  };
  
  const handleClearRecent = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };
  
  if (!searchModalOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label="Search" aria-modal="true">
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />
      
      <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-2xl top-20 lg:top-32">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="w-full px-12 py-3 pl-12 text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoComplete="off"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  aria-label="Clear search"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </form>
          
          {(showResults || recentSearches.length > 0) && (
            <div className="border-t border-gray-100 max-h-96 overflow-y-auto">
              {showResults && query.length >= 2 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          Searching...
                        </span>
                      ) : (
                        `Results for "${query}"`
                      )}
                    </h3>
                  </div>
                  
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse flex gap-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="space-y-2">
                      {suggestions.map((product: any) => (
                        <button
                          key={product._id}
                          onClick={() => handleSuggestionClick(product)}
                          className="w-full flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            <img
                              src={product.images?.[0]?.url || '/placeholder-product.svg'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-sm text-primary-600 font-semibold">{product.finalPrice || product.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No results found for "{query}"</p>
                      <p className="text-sm mt-1">Try different keywords</p>
                    </div>
                  )}
                </div>
              )}
              
              {!showResults && recentSearches.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      Recent Searches
                    </h3>
                    {recentSearches.length > 0 && (
                      <button
                        onClick={handleClearRecent}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search: string) => (
                      <button
                        key={search}
                        onClick={() => handleRecentSearchClick(search)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-700">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {!showResults && recentSearches.length === 0 && !query && (
                <div className="p-8 text-center">
                  <SparklesIcon className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Start searching</h3>
                  <p className="mt-2 text-gray-500">Type to search products, brands, or categories</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty'].map(category => (
                      <button
                        key={category}
                        onClick={() => { setQuery(category); handleRecentSearchClick(category); }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function SearchModal() {
  return createPortal(<SearchModalContent />, document.body);
}