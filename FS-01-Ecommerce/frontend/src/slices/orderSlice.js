import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const createOrder = createAsyncThunk('order/createOrder', async (orderData, { rejectWithValue }) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data.order;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create order');
  }
});

export const fetchOrders = createAsyncThunk('order/fetchOrders', async (params, { rejectWithValue }) => {
  try {
    const response = await api.get('/orders', { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchOrder = createAsyncThunk('order/fetchOrder', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data.order;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
  }
});

export const fetchVendorOrders = createAsyncThunk('order/fetchVendorOrders', async (params, { rejectWithValue }) => {
  try {
    const response = await api.get('/orders/vendor', { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendor orders');
  }
});

export const createPaymentIntent = createAsyncThunk('order/createPaymentIntent', async (orderId, { rejectWithValue }) => {
  try {
    const response = await api.post(`/orders/${orderId}/payment-intent`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create payment intent');
  }
});

export const confirmPayment = createAsyncThunk('order/confirmPayment', async ({ orderId, paymentIntentId }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/orders/${orderId}/confirm-payment`, { paymentIntentId });
    return response.data.order;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Payment confirmation failed');
  }
});

export const updateOrderStatus = createAsyncThunk('order/updateOrderStatus', async ({ orderId, status, trackingData }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/orders/${orderId}/status`, { status, ...trackingData });
    return response.data.order;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
  }
});

export const cancelOrder = createAsyncThunk('order/cancelOrder', async ({ orderId, reason }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/orders/${orderId}/cancel`, { reason });
    return response.data.order;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    currentOrder: null,
    vendorOrders: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },
    vendorPagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },
    paymentIntent: null,
    isLoading: false,
    isCreating: false,
    isProcessing: false,
    error: null,
  },
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearPaymentIntent: (state) => {
      state.paymentIntent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isCreating = false;
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchVendorOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVendorOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendorOrders = action.payload.orders;
        state.vendorPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchVendorOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.paymentIntent = action.payload;
      })
      .addCase(confirmPayment.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.currentOrder = action.payload;
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) state.orders[index] = action.payload;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
        const index = state.vendorOrders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) state.vendorOrders[index] = action.payload;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) state.orders[index] = action.payload;
      });
  },
});

export const { setCurrentOrder, clearCurrentOrder, clearPaymentIntent, clearError } = orderSlice.actions;
export default orderSlice.reducer;