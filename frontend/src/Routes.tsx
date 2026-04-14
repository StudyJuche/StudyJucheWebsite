import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Home } from './pages/Home.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { UnknownPage } from "./pages/UnknownPage.tsx";
import { Articles } from "./pages/Articles.tsx";
import { ArticleDetail } from "./pages/ArticleDetail.tsx";
import { Courses } from "./pages/Courses.tsx";
import { CourseDetail } from "./pages/CourseDetail.tsx";
import { CourseLessonDetail } from "./pages/CourseLessonDetail.tsx";
import { AdminDashboard } from "./pages/AdminDashboard.tsx";
import { ManageUsers } from './pages/ManageUsers.tsx'; // Import ManageUsers
import { Page } from "./pages/Page.tsx";
import { SearchResults } from './pages/SearchResults.tsx';
import { UserSettings } from './pages/UserSettings.tsx';
import { EmailVerified } from './pages/EmailVerified.tsx';
import { EmailVerificationFailed } from './pages/EmailVerificationFailed.tsx';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// This route is for moderators and admins
const ModeratorRoute = () => {
  const { hasRole, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return hasRole('moderator') ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

// This route is strictly for admins
const AdminRoute = () => {
  const { hasRole, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return hasRole('admin') ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/email-verified" element={<EmailVerified />} />
      <Route path="/email-verification-failed" element={<EmailVerificationFailed />} />
      <Route path="/404" element={<UnknownPage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:slug" element={<ArticleDetail />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:slug" element={<CourseDetail />} />
      <Route path="/courses/:courseSlug/:lessonSlug" element={<CourseLessonDetail />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<UserSettings />} />
      </Route>

      {/* Moderator & Admin Routes */}
      <Route element={<ModeratorRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Admin Only Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/manage-users" element={<ManageUsers />} />
      </Route>

      {/* Dynamic Page Route */}
      <Route path="/:slug" element={<Page />} />

      {/* Catch-all 404 */}
      <Route path="*" element={<UnknownPage />} />
    </Routes>
  );
};
