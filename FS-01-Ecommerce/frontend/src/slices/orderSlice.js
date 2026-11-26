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

export const fetchRazorpayConfig = createAsyncThunk('order/fetchRazorpayConfig', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/payments/razorpay/config');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load Razorpay config');
  }
});

export const createRazorpayOrder = createAsyncThunk('order/createRazorpayOrder', async ({ orderId }, { rejectWithValue }) => {
  try {
    const response = await api.post('/payments/razorpay/create-order', { orderId });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create Razorpay order');
  }
});

export const verifyRazorpayPayment = createAsyncThunk(
  'order/verifyRazorpayPayment',
  async ({ orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/razorpay/verify', {
        orderId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Razorpay payment verification failed');
    }
  }
);

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
    razorpayConfig: null,
    razorpayOrder: null,
    isPaying: false,
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
    clearRazorpayOrder: (state) => {
      state.razorpayOrder = null;
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
      .addCase(fetchRazorpayConfig.fulfilled, (state, action) => {
        state.razorpayConfig = action.payload;
      })
      .addCase(fetchRazorpayConfig.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createRazorpayOrder.pending, (state) => {
        state.isPaying = true;
        state.error = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.isPaying = false;
        state.razorpayOrder = action.payload;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.isPaying = false;
        state.error = action.payload;
      })
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.isPaying = true;
        state.error = null;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        state.isPaying = false;
        const order = action.payload.order;
        if (order) {
          state.currentOrder = order;
          const index = state.orders.findIndex((o) => o._id === order._id);
          if (index !== -1) state.orders[index] = order;
        }
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.isPaying = false;
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

export const { setCurrentOrder, clearCurrentOrder, clearPaymentIntent, clearRazorpayOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;