import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useUI } from './hooks/useUI';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Products = lazy(() => import('./pages/Products').then(module => ({ default: module.Products })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(module => ({ default: module.ProductDetail })));
const Login = lazy(() => import('./pages/auth/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/auth/Register').then(module => ({ default: module.Register })));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(module => ({ default: module.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword').then(module => ({ default: module.ResetPassword })));
const Profile = lazy(() => import('./pages/profile/Profile').then(module => ({ default: module.Profile })));
const Orders = lazy(() => import('./pages/profile/Orders').then(module => ({ default: module.Orders })));
const OrderDetail = lazy(() => import('./pages/profile/OrderDetail').then(module => ({ default: module.OrderDetail })));
const Cart = lazy(() => import('./pages/Cart').then(module => ({ default: module.Cart })));
const Payments = lazy(() => import('./pages/Payments').then(module => ({ default: module.Payments })));
const Checkout = lazy(() => import('./pages/Checkout').then(module => ({ default: module.Checkout })));
const VendorDashboard = lazy(() => import('./pages/vendor/Dashboard').then(module => ({ default: module.Dashboard })));
const VendorProducts = lazy(() => import('./pages/vendor/Products').then(module => ({ default: module.Products })));
const VendorOrders = lazy(() => import('./pages/vendor/Orders').then(module => ({ default: module.Orders })));
const VendorAddProduct = lazy(() => import('./pages/vendor/AddProduct').then(module => ({ default: module.AddProduct })));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(module => ({ default: module.Dashboard })));
const AdminUsers = lazy(() => import('./pages/admin/Users').then(module => ({ default: module.Users })));
const AdminProducts = lazy(() => import('./pages/admin/Products').then(module => ({ default: module.Products })));
const AdminOrders = lazy(() => import('./pages/admin/Orders').then(module => ({ default: module.Orders })));
const AdminCategories = lazy(() => import('./pages/admin/Categories').then(module => ({ default: module.Categories })));
const AdminCoupons = lazy(() => import('./pages/admin/Coupons').then(module => ({ default: module.Coupons })));
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));

/**
 * @param {{ children: React.ReactNode; allowedRoles?: string[] }} props
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { closeAllModals } = useUI();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) closeAllModals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated]);
  
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

/**
 * @param {{ children: React.ReactNode }} props
 */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const PageWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner size="lg" />}>{children}</Suspense>
);

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/products" element={<PageWrapper><Products /></PageWrapper>} />
        <Route path="/products/:slug" element={<PageWrapper><ProductDetail /></PageWrapper>} />
        
        <Route 
          path="/login" 
          element={
            <PublicOnlyRoute>
              <PageWrapper><Login /></PageWrapper>
            </PublicOnlyRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicOnlyRoute>
              <PageWrapper><Register /></PageWrapper>
            </PublicOnlyRoute>
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            <PublicOnlyRoute>
              <PageWrapper><ForgotPassword /></PageWrapper>
            </PublicOnlyRoute>
          } 
        />
        <Route 
          path="/reset-password" 
          element={
            <PublicOnlyRoute>
              <PageWrapper><ResetPassword /></PageWrapper>
            </PublicOnlyRoute>
          } 
        />
        
        <Route 
          path="/cart" 
          element={<PageWrapper><Cart /></PageWrapper>} 
        />
        <Route 
          path="/payments" 
          element={
            <ProtectedRoute>
              <PageWrapper><Payments /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <PageWrapper><Checkout /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <PageWrapper><Profile /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <PageWrapper><Orders /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders/:id" 
          element={
            <ProtectedRoute>
              <PageWrapper><OrderDetail /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/vendor/*" 
          element={
            <ProtectedRoute allowedRoles={['vendor', 'admin']}>
              <Routes>
                <Route path="/" element={<PageWrapper><VendorDashboard /></PageWrapper>} />
                <Route path="products" element={<PageWrapper><VendorProducts /></PageWrapper>} />
                <Route path="products/add" element={<PageWrapper><VendorAddProduct /></PageWrapper>} />
                <Route path="products/edit/:id" element={<PageWrapper><VendorAddProduct /></PageWrapper>} />
                <Route path="orders" element={<PageWrapper><VendorOrders /></PageWrapper>} />
              </Routes>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Routes>
                <Route path="/" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                <Route path="users" element={<PageWrapper><AdminUsers /></PageWrapper>} />
                <Route path="products" element={<PageWrapper><AdminProducts /></PageWrapper>} />
                <Route path="orders" element={<PageWrapper><AdminOrders /></PageWrapper>} />
                <Route path="categories" element={<PageWrapper><AdminCategories /></PageWrapper>} />
                <Route path="coupons" element={<PageWrapper><AdminCoupons /></PageWrapper>} />
              </Routes>
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </Layout>
  );
}

export default App;