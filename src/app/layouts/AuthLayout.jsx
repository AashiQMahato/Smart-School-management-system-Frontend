/**
 * AuthLayout Component
 * Layout wrapper for authentication pages (login, signup, forgot password)
 */

import { Outlet } from "react-router-dom";

/**
 * AuthLayout
 * Provides consistent layout for authentication pages
 */
const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
