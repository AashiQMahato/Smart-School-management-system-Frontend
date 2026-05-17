/**
 * useAuth Hook
 * Custom hook for accessing authentication state and methods
 */

import { useAuthContext } from "../app/providers/AuthProvider";

/**
 * useAuth Hook
 * Provides access to authentication state and methods
 *
 * @returns {object} Authentication context value
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
  return useAuthContext();
};

/**
 * useUser Hook
 * Provides access to current user information
 *
 * @returns {object} User information
 */
export const useUser = () => {
  const { user, userName, userEmail, userRole } = useAuthContext();
  return { user, userName, userEmail, userRole };
};

/**
 * useAuthStatus Hook
 * Provides authentication status only
 *
 * @returns {object} Auth status
 */
export const useAuthStatus = () => {
  const { isAuthenticated, isLoading, error } = useAuthContext();
  return { isAuthenticated, isLoading, error };
};

/**
 * useAuthActions Hook
 * Provides authentication actions only
 *
 * @returns {object} Auth actions
 */
export const useAuthActions = () => {
  const { login, signup, logout, clearError, refreshAuth } = useAuthContext();
  return { login, signup, logout, clearError, refreshAuth };
};

/**
 * useRoleAccess Hook
 * Provides role-based access control utilities
 *
 * @returns {object} Role access utilities
 */
export const useRoleAccess = () => {
  const { userRole, checkRole, getDashboardRoute, ROLES, ROLE_ROUTES } =
    useAuthContext();

  return {
    userRole,
    checkRole,
    getDashboardRoute,
    ROLES,
    ROLE_ROUTES,
    isAdmin: userRole === ROLES.ADMIN,
    isTeacher: userRole === ROLES.TEACHER,
    isStudent: userRole === ROLES.STUDENT,
    isParent: userRole === ROLES.PARENT,
  };
};

export default useAuth;
