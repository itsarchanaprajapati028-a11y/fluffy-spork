import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { useCart } from '../hooks/useCart';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import MobileMenu from './MobileMenu';
import SearchModal from './SearchModal';
import NotificationContainer from './NotificationContainer';
import ToastContainer from './ToastContainer';
import ModalManager from './ModalManager';

export default function Layout({ children }) {
  const location = useLocation();
  const { isAuthenticated, fetchProfile } = useAuth();
  const { notifications, modals, toasts } = useUI();
  const { fetchCart } = useCart();
  
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      fetchCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Header />}
      <main className={`flex-1 ${isAuthPage ? '' : 'pt-16'}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
      
      <CartDrawer />
      <MobileMenu />
      <SearchModal />
      <NotificationContainer notifications={notifications} />
      <ToastContainer toasts={toasts} />
      <ModalManager modals={modals} />
    </div>
  );
}