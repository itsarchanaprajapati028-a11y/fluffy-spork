import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import cartReducer from '../slices/cartSlice';
import productReducer from '../slices/productSlice';
import orderReducer from '../slices/orderSlice';
import uiReducer from '../slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    order: orderReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['cart/setCart'],
        ignoredPaths: ['cart.items'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 * @typedef {typeof store.dispatch} AppDispatch
 */