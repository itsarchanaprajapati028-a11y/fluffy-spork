import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    mobileMenuOpen: false,
    searchModalOpen: false,
    cartDrawerOpen: false,
    userMenuOpen: false,
    notifications: [],
    modals: {
      login: false,
      register: false,
      productQuickView: null,
      checkout: false,
      orderSuccess: null,
    },
    toasts: [],
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleSearchModal: (state) => {
      state.searchModalOpen = !state.searchModalOpen;
    },
    setSearchModalOpen: (state, action) => {
      state.searchModalOpen = action.payload;
    },
    toggleCartDrawer: (state) => {
      state.cartDrawerOpen = !state.cartDrawerOpen;
    },
    setCartDrawerOpen: (state, action) => {
      state.cartDrawerOpen = action.payload;
    },
    toggleUserMenu: (state) => {
      state.userMenuOpen = !state.userMenuOpen;
    },
    setUserMenuOpen: (state, action) => {
      state.userMenuOpen = action.payload;
    },
    openModal: (state, action) => {
      const { modal, data } = action.payload;
      state.modals[modal] = data !== undefined ? data : true;
    },
    closeModal: (state, action) => {
      const modal = action.payload;
      if (typeof state.modals[modal] === 'object') {
        state.modals[modal] = null;
      } else {
        state.modals[modal] = false;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        if (typeof state.modals[key] === 'object') {
          state.modals[key] = null;
        } else {
          state.modals[key] = false;
        }
      });
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    addToast: (state, action) => {
      state.toasts.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleSearchModal,
  setSearchModalOpen,
  toggleCartDrawer,
  setCartDrawerOpen,
  toggleUserMenu,
  setUserMenuOpen,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;