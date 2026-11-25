import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import SearchModal from './SearchModal';
import NotificationContainer from './NotificationContainer';
import ToastContainer from './ToastContainer';
import ModalManager from './ModalManager';

export default function Layout() {
  const location = useLocation();
  const { isAuthenticated, fetchProfile } = useAuth();
  const { notifications, modals, toasts } = useUI();
  
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
      
      <MobileMenu />
      <SearchModal />
      <NotificationContainer notifications={notifications} />
      <ToastContainer toasts={toasts} />
      <ModalManager modals={modals} />
    </div>
  );
}