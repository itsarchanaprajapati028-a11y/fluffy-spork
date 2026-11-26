import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, register, logout, fetchProfile, updateProfile, refreshToken, forgotPassword, resetPassword, clearError } from '../slices/authSlice';
import { setCredentials } from '../slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, accessToken, isAuthenticated, isLoading, error } = useSelector(state => state.auth);
  
  const handleLogin = async (emailOrCredentials, password) => {
    const credentials = typeof emailOrCredentials === 'string'
      ? { email: emailOrCredentials, password }
      : emailOrCredentials;
    const result = await dispatch(login(credentials));
    if (login.fulfilled.match(result)) {
      const from = location.state?.from?.pathname || location.state?.from || '/';
      navigate(from, { replace: true });
      return { success: true };
    }
    return { success: false, error: result.payload };
  };
  
  const handleRegister = async (userData) => {
    const result = await dispatch(register(userData));
    if (register.fulfilled.match(result)) {
      const from = location.state?.from?.pathname || location.state?.from || '/';
      navigate(from, { replace: true });
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
  
  const handleForgotPassword = async (email) => {
    const result = await dispatch(forgotPassword(email));
    return forgotPassword.fulfilled.match(result)
      ? { success: true, message: result.payload?.message }
      : { success: false, error: result.payload };
  };
  
  const handleResetPassword = async (token, password) => {
    const result = await dispatch(resetPassword({ token, password }));
    return resetPassword.fulfilled.match(result)
      ? { success: true, message: result.payload?.message }
      : { success: false, error: result.payload };
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
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    clearError: handleClearError,
  };
};

export default useAuth;