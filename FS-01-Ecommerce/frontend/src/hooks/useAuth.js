import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, register, logout, fetchProfile, updateProfile, refreshToken, clearError } from '../slices/authSlice';
import { setCredentials } from '../slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, accessToken, isAuthenticated, isLoading, error } = useSelector(state => state.auth);
  
  const handleLogin = async (credentials) => {
    const result = await dispatch(login(credentials));
    if (login.fulfilled.match(result)) {
      navigate(location.state?.from?.pathname || '/');
      return { success: true };
    }
    return { success: false, error: result.payload };
  };
  
  const handleRegister = async (userData) => {
    const result = await dispatch(register(userData));
    if (register.fulfilled.match(result)) {
      navigate(location.state?.from?.pathname || '/');
      return { success: true };
    }
    return { success: false, error: result.payload };
  };
  
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };
  
  const handleFetchProfile = async () => {
    const result = await dispatch(fetchProfile());
    return fetchProfile.fulfilled.match(result);
  };
  
  const handleUpdateProfile = async (data) => {
    const result = await dispatch(updateProfile(data));
    if (updateProfile.fulfilled.match(result)) {
      return { success: true };
    }
    return { success: false, error: result.payload };
  };
  
  const handleRefreshToken = async (token) => {
    const result = await dispatch(refreshToken(token));
    return refreshToken.fulfilled.match(result);
  };
  
  const handleSetCredentials = (credentials) => {
    dispatch(setCredentials(credentials));
  };
  
  const handleClearError = () => {
    dispatch(clearError());
  };
  
  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    fetchProfile: handleFetchProfile,
    updateProfile: handleUpdateProfile,
    refreshToken: handleRefreshToken,
    setCredentials: handleSetCredentials,
    clearError: handleClearError,
  };
};

export default useAuth;