/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * Redirects unauthenticated users to login
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Spin } from "antd";

/**
 * PrivateRoute
 * Wrapper for protected routes
 * Requires user to be authenticated
 */
const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        state={{ from: location, message: "Please login to continue." }}
        replace
      />
    );
  }

  // Render child routes
  return <Outlet />;
};

export default PrivateRoute;
