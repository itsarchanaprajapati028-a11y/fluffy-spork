import { Link } from 'react-router-dom';
import { useUI } from '../hooks/useUI';
import { useAuth } from '../hooks/useAuth';
import { Button } from './Button';

export function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUI();
  const { isAuthenticated, user, logout } = useAuth();

  if (!mobileMenuOpen) return null;

  const close = () => setMobileMenuOpen(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'Featured', href: '/courses?isFeatured=true' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden" onClick={close}>
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div
        className="absolute right-0 top-0 h-full w-72 max-w-full bg-white shadow-lg p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Mobile menu"
        aria-modal="true"
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">Menu</span>
          <button onClick={close} className="p-2 text-gray-400 hover:text-gray-600" aria-label="Close menu">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={close}
              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <hr className="border-gray-100" />

        {isAuthenticated ? (
          <div className="flex flex-col gap-1">
            <p className="px-3 text-sm text-gray-500">{user?.firstName} {user?.lastName}</p>
            <Link to="/my-courses" onClick={close} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">My Courses</Link>
            <Link to="/my-certificates" onClick={close} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Certificates</Link>
            <Link to="/profile" onClick={close} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">My Profile</Link>
            {user?.role === 'instructor' && (
              <Link to="/instructor" onClick={close} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Instructor Dashboard</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={close} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Admin Dashboard</Link>
            )}
            <button
              onClick={() => { logout(); close(); }}
              className="text-left px-3 py-2 rounded-lg text-red-600 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link to="/login" onClick={close} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Sign In</Link>
            <Button asChild>
              <Link to="/register" onClick={close}>Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileMenu;
