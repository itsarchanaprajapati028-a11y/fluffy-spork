import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { useCart } from '../hooks/useCart';
import { Button } from './Button';
import { MagnifyingGlassIcon, UserCircleIcon, ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatNumber } from '../utils/helpers';

export default function Header() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { 
    toggleSearchModal, 
    toggleMobileMenu, 
    setCartDrawerOpen,
    toggleUserMenu,
    userMenuOpen,
    searchModalOpen 
  } = useUI();
  const { totalItems } = useCart();
  
  const handleLogout = () => {
    logout();
    toggleUserMenu();
  };
  
  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Products', href: '/products', current: location.pathname.startsWith('/products') },
    { name: 'Categories', href: '/products', current: false },
    { name: 'Featured', href: '/products?isFeatured=true', current: false },
  ];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex items-center gap-2" aria-label="FS-01 Home">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">FS-01</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              {navigation.map(item => (
                <Link 
                  key={item.name}
                  to={item.href} 
                  className={`text-sm font-medium transition-colors ${item.current ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:block relative">
              <button
                onClick={toggleSearchModal}
                className="flex items-center gap-2 w-full max-w-md px-4 py-2 bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
                aria-label="Search products"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <span className="text-sm">Search products...</span>
              </button>
            </div>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <UserCircleIcon className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.firstName}
                  </span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        user?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user?.role === 'vendor' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {user?.role}
                      </span>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={toggleUserMenu}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={toggleUserMenu}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/payments"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={toggleUserMenu}
                    >
                      Payments
                    </Link>
                    {user?.role === 'vendor' && (
                      <Link
                        to="/vendor"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={toggleUserMenu}
                      >
                        Vendor Dashboard
                      </Link>
                    )}
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={toggleUserMenu}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Sign In
                </Link>
                <Button variant="primary" size="sm" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}
            
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={`Shopping cart${totalItems > 0 ? ` with ${totalItems} items` : ''}`}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className={`lg:hidden border-t border-gray-100 ${searchModalOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 py-3">
          <button
            onClick={toggleSearchModal}
            className="flex items-center gap-2 w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-500"
            aria-label="Search products"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <span className="text-sm">Search products...</span>
          </button>
        </div>
      </div>
    </header>
  );
}