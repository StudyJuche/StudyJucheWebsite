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
import { Page } from "./pages/Page.tsx";
import { SearchResults } from './pages/SearchResults.tsx'; // Import new component

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
  const { hasRole, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return hasRole('moderator') ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/404" element={<UnknownPage />} />
      <Route path="/search" element={<SearchResults />} /> {/* Add search route */}
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:slug" element={<ArticleDetail />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:slug" element={<CourseDetail />} />
      <Route path="/courses/:courseSlug/:lessonSlug" element={<CourseLessonDetail />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Admin & Moderator Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Dynamic Page Route */}
      <Route path="/:slug" element={<Page />} />

      {/* Catch-all 404 */}
      <Route path="*" element={<UnknownPage />} />
    </Routes>
  );
};
