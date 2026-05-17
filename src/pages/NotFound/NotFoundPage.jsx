/**
 * Not Found Page
 * Displayed for 404 errors
 */

import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getDashboardRoute } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate(getDashboardRoute());
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Result
        status="404"
        title="Page Not Found"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={handleGoHome}>
            {isAuthenticated ? "Go to Dashboard" : "Go to Home"}
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;
