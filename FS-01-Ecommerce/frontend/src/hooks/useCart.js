import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, addToCart, updateCartItem, removeFromCart, clearCart, applyCoupon, removeCoupon, setShippingAddress } from '../slices/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, subtotal, discount, tax, shippingCost, total, totalItems, couponCode, shippingAddress, isLoading, error } = useSelector(state => state.cart);
  
  const handleFetchCart = async () => {
    const result = await dispatch(fetchCart());
    return fetchCart.fulfilled.match(result);
  };
  
  const handleAddToCart = async (productId, quantity = 1, variant = null) => {
    const result = await dispatch(addToCart({ productId, quantity, variant }));
    return addToCart.fulfilled.match(result) ? { success: true } : { success: false, error: result.payload };
  };
  
  const handleUpdateCartItem = async (productId, quantity, variant = null) => {
    const result = await dispatch(updateCartItem({ productId, quantity, variant }));
    return updateCartItem.fulfilled.match(result) ? { success: true } : { success: false, error: result.payload };
  };
  
  const handleRemoveFromCart = async (productId, variant = null) => {
    const result = await dispatch(removeFromCart({ productId, variant }));
    return removeFromCart.fulfilled.match(result) ? { success: true } : { success: false, error: result.payload };
  };
  
  const handleClearCart = async () => {
    const result = await dispatch(clearCart());
    return clearCart.fulfilled.match(result);
  };
  
  const handleApplyCoupon = async (couponCode) => {
    const result = await dispatch(applyCoupon(couponCode));
    return applyCoupon.fulfilled.match(result) ? { success: true } : { success: false, error: result.payload };
  };
  
  const handleRemoveCoupon = async () => {
    const result = await dispatch(removeCoupon());
    return removeCoupon.fulfilled.match(result);
  };
  
  const handleSetShippingAddress = async (address) => {
    const result = await dispatch(setShippingAddress(address));
    return setShippingAddress.fulfilled.match(result) ? { success: true } : { success: false, error: result.payload };
  };
  
  return {
    items,
    subtotal,
    discount,
    tax,
    shippingCost,
    total,
    totalItems,
    couponCode,
    shippingAddress,
    isLoading,
    error,
    fetchCart: handleFetchCart,
    addToCart: handleAddToCart,
    updateCartItem: handleUpdateCartItem,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,
    applyCoupon: handleApplyCoupon,
    removeCoupon: handleRemoveCoupon,
    setShippingAddress: handleSetShippingAddress,
  };
};

export default useCart;