import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/cart');
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity, variant }, { rejectWithValue }) => {
  try {
    const response = await api.post('/cart/items', { productId, quantity, variant });
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ productId, quantity, variant }, { rejectWithValue }) => {
  try {
    const response = await api.patch('/cart/items', { productId, quantity, variant });
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ productId, variant }, { rejectWithValue }) => {
  try {
    const response = await api.delete('/cart/items', { data: { productId, variant } });
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart');
    return { items: [], subtotal: 0, total: 0, totalItems: 0 };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
  }
});

export const applyCoupon = createAsyncThunk('cart/applyCoupon', async (couponCode, { rejectWithValue }) => {
  try {
    const response = await api.post('/cart/coupon', { couponCode });
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to apply coupon');
  }
});

export const removeCoupon = createAsyncThunk('cart/removeCoupon', async (_, { rejectWithValue }) => {
  try {
    const response = await api.delete('/cart/coupon');
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove coupon');
  }
});

export const setShippingAddress = createAsyncThunk('cart/setShippingAddress', async (address, { rejectWithValue }) => {
  try {
    const response = await api.post('/cart/shipping-address', address);
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to set shipping address');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    shippingCost: 0,
    total: 0,
    totalItems: 0,
    couponCode: null,
    shippingAddress: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setCart: (state, action) => {
      Object.assign(state, action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      .addCase(removeCoupon.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      .addCase(setShippingAddress.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      });
  },
});

export const { setCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;