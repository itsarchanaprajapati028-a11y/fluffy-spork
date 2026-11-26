import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { Button } from './Button';
import { MagnifyingGlassIcon, UserCircleIcon, BookOpenIcon, ChartBarIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

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
  
  const handleLogout = () => {
    logout();
    toggleUserMenu();
  };
  
  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Courses', href: '/courses', current: location.pathname.startsWith('/courses') },
    { name: 'Featured', href: '/courses?isFeatured=true', current: false },
    { name: 'My Courses', href: '/my-courses', current: location.pathname.startsWith('/my-courses') },
    { name: 'Certificates', href: '/my-certificates', current: location.pathname.startsWith('/my-certificates') },
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
            
            <Link to="/" className="flex items-center gap-2" aria-label="FS-03 LMS Home">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">FS-03 LMS</span>
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
                aria-label="Search courses"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <span className="text-sm">Search courses, instructors...</span>
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
                        user?.role === 'instructor' ? 'bg-blue-100 text-blue-700' :
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
                      to="/my-courses"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={toggleUserMenu}
                    >
                      My Courses
                    </Link>
                    <Link
                      to="/my-certificates"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={toggleUserMenu}
                    >
                      Certificates
                    </Link>
                    {user?.role === 'instructor' && (
                      <Link
                        to="/instructor"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={toggleUserMenu}
                      >
                        Instructor Dashboard
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
          </div>
        </div>
      </div>
      
      <div className={`lg:hidden border-t border-gray-100 ${searchModalOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 py-3">
          <button
            onClick={toggleSearchModal}
            className="flex items-center gap-2 w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-500"
            aria-label="Search courses"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <span className="text-sm">Search courses, instructors...</span>
          </button>
        </div>
      </div>
    </header>
  );
}