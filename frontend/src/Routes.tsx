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
import { Page } from "./pages/Page.tsx"; // Import the new Page component

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
            {/* Specific static routes first */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/404" element={<UnknownPage />} />
            
            {/* App-like sections */}
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

            {/* Dynamic Page Route - this should be near the end */}
            <Route path="/:slug" element={<Page />} />

            {/* Catch-all route for 404s - this must be last */}
            <Route path="*" element={<UnknownPage />} />
        </Routes>
    );
};
