import { useSelector, useDispatch } from 'react-redux';
import { createOrder, fetchOrders, fetchOrder, fetchVendorOrders, createPaymentIntent, confirmPayment, updateOrderStatus, cancelOrder } from '../slices/orderSlice';

export const useOrders = () => {
  const dispatch = useDispatch();
  const { orders, currentOrder, vendorOrders, pagination, vendorPagination, paymentIntent, isLoading, isCreating, isProcessing, error } = useSelector(state => state.order);
  
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
    isLoading,
    isCreating,
    isProcessing,
    error,
    createOrder: handleCreateOrder,
    fetchOrders: handleFetchOrders,
    fetchOrder: handleFetchOrder,
    fetchVendorOrders: handleFetchVendorOrders,
    createPaymentIntent: handleCreatePaymentIntent,
    confirmPayment: handleConfirmPayment,
    updateOrderStatus: handleUpdateOrderStatus,
    cancelOrder: handleCancelOrder,
  };
};

export default useOrders;