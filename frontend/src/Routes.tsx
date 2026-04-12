import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Home } from './pages/Home.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { UnknownPage } from "./pages/UnknownPage.tsx";
import { Lessons } from "./pages/Lessons.tsx";
import { LessonDetail } from "./pages/LessonDetail.tsx";

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
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lessons/:slug" element={<LessonDetail />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Catch-all route for 404s */}
            <Route path="*" element={<UnknownPage />} />
        </Routes>
    );
};
