/**
 * Authentication Service
 * Handles all authentication-related API calls, token management, and session persistence
 *
 * IMPORTANT: Signup has been removed. All user creation is done by Admin only.
 * This service handles LOGIN functionality only.
 */

import axios from "axios";
import BASE_URL from "../config/baseUrl";
const API_URL = `${BASE_URL}/auth`;

// Token storage keys
const TOKEN_KEY = "ssms_token";
const USER_KEY = "ssms_user";
const REFRESH_TOKEN_KEY = "ssms_refresh_token";

/**
 * Role constants for the application
 */
export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
};

/**
 * Role-based dashboard routes
 */
export const ROLE_ROUTES = {
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.TEACHER]: "/teacher/dashboard",
  [ROLES.STUDENT]: "/student/dashboard",
  [ROLES.PARENT]: "/parent/dashboard",
};

/**
 * Parse JWT token to extract payload
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null
 */
export const parseToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Token parsing error:", error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  const payload = parseToken(token);
  if (!payload || !payload.exp) return true;

  // Add 10 second buffer for clock skew
  return Date.now() >= payload.exp * 1000 - 10000;
};

/**
 * Get stored authentication token
 * @returns {string|null} - Token or null
 */
export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && isTokenExpired(token)) {
    clearAuthData();
    return null;
  }
  return token;
};

/**
 * Get stored user data
 * @returns {object|null} - User data or null
 */
export const getStoredUser = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

/**
 * Store authentication data
 * @param {string} token - JWT token
 * @param {object} user - User data
 * @param {string} refreshToken - Refresh token (optional)
 */
export const setAuthData = (token, user, refreshToken = null) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Get authorization headers for API requests
 * @returns {object} - Headers object
 */
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Login user
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} - { success, data, error }
 */
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      headers: { "Content-Type": "application/json" },
    });
    const data = response.data;
    if (data.token && data.user) {
      // Validate role from response
      const role = data.user.role?.toLowerCase();
      if (!Object.values(ROLES).includes(role)) {
        return {
          success: false,
          error: "Invalid user role",
        };
      }

      // Merge roleProfile into user for easier access
      const userWithProfile = data.roleProfile
        ? { ...data.user, roleProfile: data.roleProfile }
        : data.user;

      // Store auth data
      setAuthData(data.token, userWithProfile, data.refreshToken);
      return {
        success: true,
        data: {
          user: userWithProfile,
          roleProfile: data.roleProfile,
          token: data.token,
          redirectTo: ROLE_ROUTES[role],
        },
      };
    }
    return {
      success: false,
      error: data.message || "Login failed",
    };
  } catch (error) {
    const data = error.response?.data || {};
    return {
      success: false,
      error: data.message || "Network error. Please try again.",
    };
  }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  const token = getToken();
  // Attempt to invalidate token on server (optional)
  if (token) {
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: getAuthHeaders(),
        },
      );
    } catch (error) {
      // Continue with local logout even if server logout fails
      console.error("Server logout error:", error);
    }
  }
  // Always clear local data
  clearAuthData();
};

/**
 * Refresh authentication token
 * @returns {Promise<object>} - { success, token, error }
 */
export const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    return { success: false, error: "No refresh token" };
  }
  try {
    const response = await axios.post(
      `${API_URL}/refresh`,
      { refreshToken },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    const data = response.data;
    if (!data.token) {
      clearAuthData();
      return { success: false, error: "Token refresh failed" };
    }
    // Update stored token
    localStorage.setItem(TOKEN_KEY, data.token);
    if (data.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }
    return { success: true, token: data.token };
  } catch (error) {
    clearAuthData();
    return { success: false, error: "Token refresh failed" };
  }
};

/**
 * Get current user profile from server
 * @returns {Promise<object>} - { success, user, roleProfile, error }
 */
export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) {
    return { success: false, error: "Not authenticated" };
  }
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: getAuthHeaders(),
    });
    const data = response.data;

    // Handle new API response structure with user and roleProfile
    const userData = data.user || data;
    const roleProfile = data.roleProfile || null;

    // Merge roleProfile data into user for backward compatibility
    const mergedUser = roleProfile ? { ...userData, roleProfile } : userData;

    // Update stored user data
    localStorage.setItem(USER_KEY, JSON.stringify(mergedUser));
    return { success: true, user: mergedUser, roleProfile };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      clearAuthData();
    }
    return { success: false, error: "Failed to get user" };
  }
};

/**
 * Validate if user has required role
 * @param {string} userRole - User's role
 * @param {string|string[]} allowedRoles - Allowed role(s)
 * @returns {boolean} - True if authorized
 */
export const hasRole = (userRole, allowedRoles) => {
  if (!userRole) return false;

  const normalizedUserRole = userRole.toLowerCase();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return roles.some((role) => role.toLowerCase() === normalizedUserRole);
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

export default {
  ROLES,
  ROLE_ROUTES,
  loginUser,
  logoutUser,
  refreshAuthToken,
  getCurrentUser,
  getToken,
  getStoredUser,
  setAuthData,
  clearAuthData,
  getAuthHeaders,
  hasRole,
  isAuthenticated,
  parseToken,
  isTokenExpired,
};
