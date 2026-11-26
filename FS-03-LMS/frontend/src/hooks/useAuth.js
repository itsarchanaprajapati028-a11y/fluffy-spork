import { useSelector, useDispatch } from 'react-redux';
import { login, register, logout, fetchProfile, updateProfile, forgotPassword, resetPassword, clearError } from '../slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, accessToken, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const handleLogin = async (emailOrCredentials, password) => {
    const credentials = typeof emailOrCredentials === 'string'
      ? { email: emailOrCredentials, password }
      : emailOrCredentials;
    const result = await dispatch(login(credentials));
    if (login.fulfilled.match(result)) {
      return { success: true, user: result.payload.user };
    }
    return { success: false, error: result.payload };
  };

  const handleRegister = async (userData) => {
    const result = await dispatch(register(userData));
    if (register.fulfilled.match(result)) {
      return { success: true, user: result.payload.user };
    }
    return { success: false, error: result.payload };
  };

  const handleLogout = async () => {
    dispatch(logout());
    return { success: true };
  };

  const handleFetchProfile = async () => {
    const result = await dispatch(fetchProfile());
    return fetchProfile.fulfilled.match(result);
  };

  const handleUpdateProfile = async (data) => {
    const result = await dispatch(updateProfile(data));
    if (updateProfile.fulfilled.match(result)) {
      return { success: true, user: result.payload };
    }
    return { success: false, error: result.payload };
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
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    clearError: () => dispatch(clearError()),
  };
}

export default useAuth;
