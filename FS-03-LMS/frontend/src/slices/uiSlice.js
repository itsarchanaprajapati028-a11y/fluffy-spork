import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    modals: {},
    notifications: [],
    toasts: [],
    sidebarOpen: false,
    mobileMenuOpen: false,
    searchModalOpen: false,
    cartDrawerOpen: false,
    userMenuOpen: false,
  },
  reducers: {
    openModal: (state, action) => {
      const name = typeof action.payload === 'string' ? action.payload : action.payload?.modal;
      if (name) state.modals[name] = true;
    },
    closeModal: (state, action) => {
      const name = typeof action.payload === 'string' ? action.payload : action.payload?.modal;
      if (name) state.modals[name] = false;
    },
    closeAllModals: (state) => { state.modals = {}; },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen: (state, action) => { state.sidebarOpen = action.payload; },
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen; },
    setMobileMenuOpen: (state, action) => { state.mobileMenuOpen = action.payload; },
    toggleSearchModal: (state) => { state.searchModalOpen = !state.searchModalOpen; },
    setSearchModalOpen: (state, action) => { state.searchModalOpen = action.payload; },
    toggleCartDrawer: (state) => { state.cartDrawerOpen = !state.cartDrawerOpen; },
    setCartDrawerOpen: (state, action) => { state.cartDrawerOpen = action.payload; },
    toggleUserMenu: (state) => { state.userMenuOpen = !state.userMenuOpen; },
    setUserMenuOpen: (state, action) => { state.userMenuOpen = action.payload; },
    addNotification: (state, action) => { state.notifications.push(action.payload); },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => { state.notifications = []; },
    addToast: (state, action) => { state.toasts.push(action.payload); },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  openModal, closeModal, closeAllModals,
  toggleSidebar, setSidebarOpen,
  toggleMobileMenu, setMobileMenuOpen,
  toggleSearchModal, setSearchModalOpen,
  toggleCartDrawer, setCartDrawerOpen,
  toggleUserMenu, setUserMenuOpen,
  addNotification, removeNotification, clearNotifications,
  addToast, removeToast,
} = uiSlice.actions;
export default uiSlice.reducer;
