/**
 * Authentication Provider
 * Provides authentication context and state management throughout the application
 *
 * IMPORTANT: Signup functionality has been removed.
 * All user creation is done by Admin only through the Admin dashboard.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  loginUser,
  logoutUser,
  getToken,
  getStoredUser,
  isTokenExpired,
  refreshAuthToken,
  getCurrentUser,
  hasRole,
  ROLES,
  ROLE_ROUTES,
  clearAuthData,
} from "../../services/auth.service";

// Create Auth Context
const AuthContext = createContext(null);

// Auth states
const AUTH_STATES = {
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
};

/**
 * AuthProvider Component
 * Wraps the application and provides authentication state and methods
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState(AUTH_STATES.LOADING);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Initialize authentication state from storage
   */
  const initializeAuth = useCallback(async () => {
    setAuthState(AUTH_STATES.LOADING);

    const token = getToken();
    const storedUser = getStoredUser();

    if (!token || isTokenExpired(token)) {
      // Try to refresh token
      const refreshResult = await refreshAuthToken();
      if (!refreshResult.success) {
        setUser(null);
        setAuthState(AUTH_STATES.UNAUTHENTICATED);
        return;
      }
    }

    if (storedUser) {
      setUser(storedUser);
      setAuthState(AUTH_STATES.AUTHENTICATED);

      // Optionally verify with server
      const userResult = await getCurrentUser();
      if (userResult.success) {
        setUser(userResult.user);
      } else if (userResult.error === "Not authenticated") {
        setUser(null);
        setAuthState(AUTH_STATES.UNAUTHENTICATED);
      }
    } else {
      setUser(null);
      setAuthState(AUTH_STATES.UNAUTHENTICATED);
    }
  }, []);

  /**
   * Initialize auth on mount
   */
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Set up token expiry checker
   */
  useEffect(() => {
    if (authState !== AUTH_STATES.AUTHENTICATED) return;

    const checkTokenExpiry = setInterval(async () => {
      const token = getToken();
      if (!token || isTokenExpired(token)) {
        const refreshResult = await refreshAuthToken();
        if (!refreshResult.success) {
          setUser(null);
          setAuthState(AUTH_STATES.UNAUTHENTICATED);
          navigate("/auth", {
            state: { message: "Session expired. Please login again." },
          });
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkTokenExpiry);
  }, [authState, navigate]);

  /**
   * Login handler
   */
  const login = useCallback(
    async (credentials) => {
      setError(null);

      const result = await loginUser(credentials);

      if (result.success) {
        setUser(result.data.user);
        setAuthState(AUTH_STATES.AUTHENTICATED);

        // Get redirect path from state or use role-based default
        const from = location.state?.from?.pathname || result.data.redirectTo;
        navigate(from, { replace: true });

        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    },
    [navigate, location.state],
  );

  /**
   * Logout handler
   */
  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setAuthState(AUTH_STATES.UNAUTHENTICATED);
    setError(null);
    navigate("/auth", { replace: true });
  }, [navigate]);

  /**
   * Check if user has specific role(s)
   */
  const checkRole = useCallback(
    (allowedRoles) => {
      if (!user?.role) return false;
      return hasRole(user.role, allowedRoles);
    },
    [user],
  );

  /**
   * Get dashboard route for current user
   */
  const getDashboardRoute = useCallback(() => {
    if (!user?.role) return "/auth";
    const role = user.role.toLowerCase();
    return ROLE_ROUTES[role] || "/unauthorized";
  }, [user]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Force logout (for unauthorized access)
   */
  const forceLogout = useCallback(() => {
    clearAuthData();
    setUser(null);
    setAuthState(AUTH_STATES.UNAUTHENTICATED);
  }, []);

  // Memoized context value
  const value = useMemo(
    () => ({
      // State
      user,
      isAuthenticated: authState === AUTH_STATES.AUTHENTICATED,
      isLoading: authState === AUTH_STATES.LOADING,
      error,

      // User info
      userRole: user?.role?.toLowerCase() || null,
      userName: user?.name || "",
      userEmail: user?.email || "",

      // Methods
      login,
      logout,
      checkRole,
      getDashboardRoute,
      clearError,
      forceLogout,
      refreshAuth: initializeAuth,

      // Constants
      ROLES,
      ROLE_ROUTES,
    }),
    [
      user,
      authState,
      error,
      login,
      logout,
      checkRole,
      getDashboardRoute,
      clearError,
      forceLogout,
      initializeAuth,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuthContext Hook
 * Access auth context (internal use)
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export { AUTH_STATES, ROLES, ROLE_ROUTES };
export default AuthProvider;
