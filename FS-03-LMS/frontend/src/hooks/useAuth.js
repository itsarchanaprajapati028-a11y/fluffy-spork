import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) { setIsLoading(false); return; }
    try {
      const r = await api.get('/auth/me');
      setUser(r.data.data);
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', r.data.accessToken);
    localStorage.setItem('refreshToken', r.data.refreshToken);
    setUser(r.data.user);
    return { success: true };
  };

  const register = async (data) => {
    const r = await api.post('/auth/register', data);
    localStorage.setItem('accessToken', r.data.accessToken);
    localStorage.setItem('refreshToken', r.data.refreshToken);
    setUser(r.data.user);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    fetchProfile,
    login,
    register,
    logout,
  };
}

export default useAuth;