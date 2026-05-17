/**
 * PublicRoutes Component
 * Handles routes that are accessible without authentication
 * Redirects authenticated users to their dashboard
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Spin } from "antd";

/**
 * PublicRoutes
 * Wrapper for public routes (landing, auth)
 * Redirects authenticated users to their dashboard
 */
const PublicRoutes = ({ restricted = false }) => {
  const { isAuthenticated, isLoading, getDashboardRoute } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // If restricted (like auth page) and user is authenticated, redirect to dashboard
  if (restricted && isAuthenticated) {
    const dashboardRoute = getDashboardRoute();
    return <Navigate to={dashboardRoute} replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default PublicRoutes;
