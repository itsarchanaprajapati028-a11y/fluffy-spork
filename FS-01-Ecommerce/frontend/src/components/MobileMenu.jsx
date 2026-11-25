import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { XMarkIcon, Bars3Icon, UserCircleIcon, ShoppingCartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';

const MobileMenuContent = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { mobileMenuOpen, setMobileMenuOpen, toggleSearchModal, setCartDrawerOpen, toggleUserMenu, userMenuOpen } = useUI();
  const { totalItems } = require('../hooks/useCart').useCart();
  
  if (!mobileMenuOpen) return null;
  
  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };
  
  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Products', href: '/products', current: location.pathname.startsWith('/products') },
    { name: 'Categories', href: '/categories', current: location.pathname === '/categories' },
    { name: 'Featured', href: '/products?isFeatured=true', current: false },
  ];
  
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-label="Mobile menu" aria-modal="true">
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)} aria-label="FS-01 Home">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FS-01</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            aria-label="Close menu"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <nav aria-label="Mobile navigation">
            <ul className="space-y-1">
              {navigation.map(item => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                      item.current ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={toggleSearchModal}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg text-gray-500"
              aria-label="Search products"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <span className="text-base">Search products...</span>
            </button>
          </div>
          
          {isAuthenticated ? (
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                  ) : (
                    <UserCircleIcon className="h-6 w-6 text-primary-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  My Orders
                </Link>
                {user?.role === 'vendor' && (
                  <Link
                    to="/vendor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Vendor Dashboard
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-red-600 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center btn-primary"
              >
                Get Started
              </Link>
            </div>
          )}
          
          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={() => { setMobileMenuOpen(false); setCartDrawerOpen(true); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>View Cart</span>
              {totalItems > 0 && (
                <span className="bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MobileMenu() {
  return createPortal(<MobileMenuContent />, document.body);
}