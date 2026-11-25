import { useState, useCallback } from 'react';
import api from '../utils/api';

export function useCart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const r = await api.get('/cart');
      setCart(r.data.data || { items: [], total: 0 });
    } catch (e) { /* ignore */ }
  }, []);

  const addToCart = useCallback(async (productId, quantity = 1, variant = {}) => {
    setIsLoading(true);
    try {
      const r = await api.post('/cart', { productId, quantity, variant });
      setCart(r.data.data);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.response?.data?.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { cart, items: cart.items, total: cart.total, isLoading, fetchCart, addToCart };
}

export default useCart;