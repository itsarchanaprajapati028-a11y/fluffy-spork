import { useSelector, useDispatch } from 'react-redux';
import { createOrder, fetchOrders, fetchOrder, fetchVendorOrders, createPaymentIntent, confirmPayment, fetchRazorpayConfig, createRazorpayOrder, verifyRazorpayPayment, updateOrderStatus, cancelOrder } from '../slices/orderSlice';

export const useOrders = () => {
  const dispatch = useDispatch();
  const { orders, currentOrder, vendorOrders, pagination, vendorPagination, paymentIntent, razorpayConfig, razorpayOrder, isLoading, isCreating, isProcessing, isPaying, error } = useSelector(state => state.order);
  
  const handleCreateOrder = async (orderData) => {
    const result = await dispatch(createOrder(orderData));
    return createOrder.fulfilled.match(result) ? { success: true, order: result.payload } : { success: false, error: result.payload };
  };
  
  const handleFetchOrders = async (params = {}) => {
    const result = await dispatch(fetchOrders(params));
    return fetchOrders.fulfilled.match(result) ? result.payload : null;
  };
  
  const handleFetchOrder = async (id) => {
    const result = await dispatch(fetchOrder(id));
    return fetchOrder.fulfilled.match(result) ? result.payload : null;
  };
  
  const handleFetchVendorOrders = async (params = {}) => {
    const result = await dispatch(fetchVendorOrders(params));
    return fetchVendorOrders.fulfilled.match(result) ? result.payload : null;
  };
  
  const handleCreatePaymentIntent = async (orderId) => {
    const result = await dispatch(createPaymentIntent(orderId));
    return createPaymentIntent.fulfilled.match(result) ? result.payload : null;
  };
  
  const handleConfirmPayment = async (orderId, paymentIntentId) => {
    const result = await dispatch(confirmPayment({ orderId, paymentIntentId }));
    return confirmPayment.fulfilled.match(result) ? { success: true, order: result.payload } : { success: false, error: result.payload };
  };
  
  const handleFetchRazorpayConfig = async () => {
    const result = await dispatch(fetchRazorpayConfig());
    return fetchRazorpayConfig.fulfilled.match(result) ? result.payload : null;
  };
  
  const handleCreateRazorpayOrder = async (orderId) => {
    const result = await dispatch(createRazorpayOrder({ orderId }));
    return createRazorpayOrder.fulfilled.match(result) ? result.payload : { error: result.payload };
  };
  
  const handleVerifyRazorpayPayment = async (payload) => {
    const result = await dispatch(verifyRazorpayPayment(payload));
    return verifyRazorpayPayment.fulfilled.match(result) ? { success: true, data: result.payload } : { success: false, error: result.payload };
  };
  
  const handleUpdateOrderStatus = async (orderId, status, trackingData = {}) => {
    const result = await dispatch(updateOrderStatus({ orderId, status, trackingData }));
    return updateOrderStatus.fulfilled.match(result) ? { success: true, order: result.payload } : { success: false, error: result.payload };
  };
  
  const handleCancelOrder = async (orderId, reason) => {
    const result = await dispatch(cancelOrder({ orderId, reason }));
    return cancelOrder.fulfilled.match(result) ? { success: true, order: result.payload } : { success: false, error: result.payload };
  };
  
  return {
    orders,
    currentOrder,
    vendorOrders,
    pagination,
    vendorPagination,
    paymentIntent,
    razorpayConfig,
    razorpayOrder,
    isLoading,
    isCreating,
    isProcessing,
    isPaying,
    error,
    createOrder: handleCreateOrder,
    fetchOrders: handleFetchOrders,
    fetchOrder: handleFetchOrder,
    fetchVendorOrders: handleFetchVendorOrders,
    createPaymentIntent: handleCreatePaymentIntent,
    confirmPayment: handleConfirmPayment,
    fetchRazorpayConfig: handleFetchRazorpayConfig,
    createRazorpayOrder: handleCreateRazorpayOrder,
    verifyRazorpayPayment: handleVerifyRazorpayPayment,
    updateOrderStatus: handleUpdateOrderStatus,
    cancelOrder: handleCancelOrder,
  };
};

export default useOrders;