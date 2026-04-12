import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
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

// A mock authentication hook. Replace this with actual auth logic
export const useAuth = () => {
    const isAuthenticated = false; // Change to true to test the protected route
    return { isAuthenticated };
};

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    // Render child routes if authenticated
    return <Outlet />;
};

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Unprotected/Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/404" element={<UnknownPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/courses/:courseSlug/:lessonSlug" element={<CourseLessonDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Catch-all route for 404s */}
            <Route path="*" element={<UnknownPage />} />
        </Routes>
    );
};
