import { useSelector, useDispatch } from 'react-redux';
import { 
  toggleSidebar, setSidebarOpen,
  toggleMobileMenu, setMobileMenuOpen,
  toggleSearchModal, setSearchModalOpen,
  toggleCartDrawer, setCartDrawerOpen,
  toggleUserMenu, setUserMenuOpen,
  openModal, closeModal, closeAllModals,
  addNotification, removeNotification, clearNotifications,
  addToast, removeToast
} from '../slices/uiSlice';

export const useUI = () => {
  const dispatch = useDispatch();
  const { 
    sidebarOpen, mobileMenuOpen, searchModalOpen, cartDrawerOpen, userMenuOpen, 
    notifications, modals, toasts 
  } = useSelector(state => state.ui);
  
  return {
    sidebarOpen,
    mobileMenuOpen,
    searchModalOpen,
    cartDrawerOpen,
    userMenuOpen,
    notifications,
    modals,
    toasts,
    toggleSidebar: () => dispatch(toggleSidebar()),
    setSidebarOpen: (open) => dispatch(setSidebarOpen(open)),
    toggleMobileMenu: () => dispatch(toggleMobileMenu()),
    setMobileMenuOpen: (open) => dispatch(setMobileMenuOpen(open)),
    toggleSearchModal: () => dispatch(toggleSearchModal()),
    setSearchModalOpen: (open) => dispatch(setSearchModalOpen(open)),
    toggleCartDrawer: () => dispatch(toggleCartDrawer()),
    setCartDrawerOpen: (open) => dispatch(setCartDrawerOpen(open)),
    toggleUserMenu: () => dispatch(toggleUserMenu()),
    setUserMenuOpen: (open) => dispatch(setUserMenuOpen(open)),
    openModal: (modal, data) => dispatch(openModal({ modal, data })),
    closeModal: (modal) => dispatch(closeModal(modal)),
    closeAllModals: () => dispatch(closeAllModals()),
    addNotification: (notification) => dispatch(addNotification(notification)),
    removeNotification: (id) => dispatch(removeNotification(id)),
    clearNotifications: () => dispatch(clearNotifications()),
    addToast: (toast) => dispatch(addToast(toast)),
    removeToast: (id) => dispatch(removeToast(id)),
  };
};

export default useUI;