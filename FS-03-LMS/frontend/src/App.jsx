import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useUI } from './hooks/useUI';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Courses = lazy(() => import('./pages/Courses').then(module => ({ default: module.Courses })));
const CourseDetail = lazy(() => import('./pages/CourseDetail').then(module => ({ default: module.CourseDetail })));
const Login = lazy(() => import('./pages/auth/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/auth/Register').then(module => ({ default: module.Register })));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(module => ({ default: module.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword').then(module => ({ default: module.ResetPassword })));
const Profile = lazy(() => import('./pages/profile/Profile').then(module => ({ default: module.Profile })));
const MyCourses = lazy(() => import('./pages/profile/MyCourses').then(module => ({ default: module.MyCourses })));
const MyCertificates = lazy(() => import('./pages/profile/MyCertificates').then(module => ({ default: module.MyCertificates })));
const LearningPath = lazy(() => import('./pages/LearningPath').then(module => ({ default: module.LearningPath })));
const CoursePlayer = lazy(() => import('./pages/CoursePlayer').then(module => ({ default: module.CoursePlayer })));
const QuizPlayer = lazy(() => import('./pages/QuizPlayer').then(module => ({ default: module.QuizPlayer })));
const LiveClassRoom = lazy(() => import('./pages/LiveClassRoom').then(module => ({ default: module.LiveClassRoom })));
const InstructorDashboard = lazy(() => import('./pages/instructor/Dashboard').then(module => ({ default: module.Dashboard })));
const InstructorCourses = lazy(() => import('./pages/instructor/Courses').then(module => ({ default: module.Courses })));
const InstructorAnalytics = lazy(() => import('./pages/instructor/Analytics').then(module => ({ default: module.Analytics })));
const InstructorLiveClasses = lazy(() => import('./pages/instructor/LiveClasses').then(module => ({ default: module.LiveClasses })));
const InstructorEarnings = lazy(() => import('./pages/instructor/Earnings').then(module => ({ default: module.Earnings })));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(module => ({ default: module.Dashboard })));
const AdminUsers = lazy(() => import('./pages/admin/Users').then(module => ({ default: module.Users })));
const AdminCourses = lazy(() => import('./pages/admin/Courses').then(module => ({ default: module.Courses })));
const AdminInstructors = lazy(() => import('./pages/admin/Instructors').then(module => ({ default: module.Instructors })));
const AdminLiveClasses = lazy(() => import('./pages/admin/LiveClasses').then(module => ({ default: module.LiveClasses })));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics').then(module => ({ default: module.Analytics })));
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
  const { fetchProfile, accessToken } = useAuth();
  
  useEffect(() => {
    if (accessToken) fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/courses" element={<PageWrapper><Courses /></PageWrapper>} />
        <Route path="/courses/:slug" element={<PageWrapper><CourseDetail /></PageWrapper>} />
        <Route path="/learning/:courseId" element={
          <ProtectedRoute>
            <PageWrapper><LearningPath /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/courses/:courseId/lesson/:lessonId" element={
          <ProtectedRoute>
            <PageWrapper><CoursePlayer /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/quiz/:quizId" element={
          <ProtectedRoute>
            <PageWrapper><QuizPlayer /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/live/:liveClassId" element={
          <ProtectedRoute>
            <PageWrapper><LiveClassRoom /></PageWrapper>
          </ProtectedRoute>
        } />
        
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
          path="/profile" 
          element={
            <ProtectedRoute>
              <PageWrapper><Profile /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-courses" 
          element={
            <ProtectedRoute>
              <PageWrapper><MyCourses /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-certificates" 
          element={
            <ProtectedRoute>
              <PageWrapper><MyCertificates /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/instructor/*" 
          element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <Routes>
                <Route path="/" element={<PageWrapper><InstructorDashboard /></PageWrapper>} />
                <Route path="courses" element={<PageWrapper><InstructorCourses /></PageWrapper>} />
                <Route path="analytics" element={<PageWrapper><InstructorAnalytics /></PageWrapper>} />
                <Route path="live-classes" element={<PageWrapper><InstructorLiveClasses /></PageWrapper>} />
                <Route path="earnings" element={<PageWrapper><InstructorEarnings /></PageWrapper>} />
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
                <Route path="courses" element={<PageWrapper><AdminCourses /></PageWrapper>} />
                <Route path="instructors" element={<PageWrapper><AdminInstructors /></PageWrapper>} />
                <Route path="live-classes" element={<PageWrapper><AdminLiveClasses /></PageWrapper>} />
                <Route path="analytics" element={<PageWrapper><AdminAnalytics /></PageWrapper>} />
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