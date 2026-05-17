/**
 * RoleRoute Component
 * Protects routes based on user role
 * Redirects unauthorized users to /unauthorized
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Spin } from "antd";

/**
 * RoleRoute
 * Wrapper for role-protected routes
 * Requires user to have specific role(s)
 *
 * @param {object} props
 * @param {string|string[]} props.allowedRoles - Role(s) allowed to access
 * @param {string} props.redirectTo - Custom redirect path (default: /unauthorized)
 */
const RoleRoute = ({ allowedRoles, redirectTo = "/unauthorized" }) => {
  const { isAuthenticated, isLoading, checkRole, userRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        state={{ from: location, message: "Please login to continue." }}
        replace
      />
    );
  }

  // Check if user has required role
  const hasAccess = checkRole(allowedRoles);

  if (!hasAccess) {
    // Log unauthorized access attempt (for security monitoring)
    console.warn(
      `Unauthorized access attempt: User role "${userRole}" tried to access "${location.pathname}"`
    );

    return (
      <Navigate
        to={redirectTo}
        state={{
          from: location,
          requiredRoles: Array.isArray(allowedRoles)
            ? allowedRoles
            : [allowedRoles],
          userRole,
        }}
        replace
      />
    );
  }

  // Render child routes
  return <Outlet />;
};

export default RoleRoute;
