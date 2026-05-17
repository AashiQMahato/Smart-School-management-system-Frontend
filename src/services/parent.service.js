import axios from "axios";
import BASE_URL from "../config/baseUrl";

const API_URL = `${BASE_URL}`;

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("ssms_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

/**
 * Get current parent's children
 * Server resolves parent via JWT (no admin route)
 */
export const getMyChildren = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/parents/me/children`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching children");
  }
};

/**
 * Get current parent's profile
 * Includes populated userId and (light) children list
 */
export const getMyProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/parents/me`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching parent profile",
    );
  }
};

/**
 * Get specific child's attendance
 */
export const getChildAttendance = async (studentId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    params.append("studentId", studentId);

    const response = await axios.get(
      `${API_URL}/attendance/student?${params}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching child attendance",
    );
  }
};

/**
 * Get specific child's academic performance
 */
export const getChildPerformance = async (studentId) => {
  try {
    // This would need a grades/results endpoint
    const response = await axios.get(
      `${API_URL}/students/${studentId}/performance`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    // Return empty data if endpoint doesn't exist yet
    return { data: [] };
  }
};

/**
 * Get specific child's timetable
 */
export const getChildTimetable = async (classId) => {
  try {
    const response = await axios.get(
      `${API_URL}/schedules?classId=${classId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching timetable",
    );
  }
};

/**
 * Get specific child's fee status
 */
export const getChildFeeStatus = async (studentId) => {
  try {
    // This would need a fees endpoint
    const response = await axios.get(
      `${API_URL}/fees/student/${studentId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    // Return empty data if endpoint doesn't exist yet
    return { data: [] };
  }
};

export default {
  getMyProfile,
  getMyChildren,
  getChildAttendance,
  getChildPerformance,
  getChildTimetable,
  getChildFeeStatus,
};
