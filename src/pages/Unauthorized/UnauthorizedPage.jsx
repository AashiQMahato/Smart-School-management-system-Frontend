/**
 * Unauthorized Page
 * Displayed when user tries to access a resource without proper permissions
 */

import { Button, Result } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getDashboardRoute, isAuthenticated, logout } = useAuth();

  // Get info from location state
  const { requiredRoles, userRole, from } = location.state || {};

  const handleGoBack = () => {
    if (isAuthenticated) {
      navigate(getDashboardRoute());
    } else {
      navigate("/auth");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Result
        status="403"
        title="Access Denied"
        subTitle={
          <div className="space-y-2">
            <p>Sorry, you don't have permission to access this page.</p>
            {userRole && (
              <p className="text-sm text-gray-500">
                Your role:{" "}
                <span className="font-medium capitalize">{userRole}</span>
              </p>
            )}
            {requiredRoles && requiredRoles.length > 0 && (
              <p className="text-sm text-gray-500">
                Required role(s):{" "}
                <span className="font-medium capitalize">
                  {requiredRoles.join(", ")}
                </span>
              </p>
            )}
          </div>
        }
        extra={
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button type="primary" onClick={handleGoBack}>
              Go to Dashboard
            </Button>
            <Button onClick={handleLogout}>Sign Out</Button>
          </div>
        }
      />
    </div>
  );
};

export default UnauthorizedPage;
