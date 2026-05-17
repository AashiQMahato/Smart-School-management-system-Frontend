/**
 * Analytics Service — Frontend API layer
 * All calls go through backend proxy (never exposes Groq key)
 */

import axios from "axios";
import BASE_URL from "../config/baseUrl";

const API_URL = `${BASE_URL}/analytics`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("ssms_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const getAdminAnalytics = async (academicYear) => {
  try {
    const params = academicYear ? `?academicYear=${academicYear}` : "";
    const response = await axios.get(
      `${API_URL}/admin${params}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch admin analytics",
    );
  }
};

export const getTeacherAnalytics = async (academicYear) => {
  try {
    const params = academicYear ? `?academicYear=${academicYear}` : "";
    const response = await axios.get(
      `${API_URL}/teacher${params}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch teacher analytics",
    );
  }
};

export const getStudentAnalytics = async (academicYear) => {
  try {
    const params = academicYear ? `?academicYear=${academicYear}` : "";
    const response = await axios.get(
      `${API_URL}/student${params}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch student analytics",
    );
  }
};

export const getParentAnalytics = async (studentId, academicYear) => {
  try {
    const params = new URLSearchParams();
    if (studentId) params.append("studentId", studentId);
    if (academicYear) params.append("academicYear", academicYear);
    const qs = params.toString() ? `?${params}` : "";
    const response = await axios.get(
      `${API_URL}/parent${qs}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch parent analytics",
    );
  }
};

export default {
  getAdminAnalytics,
  getTeacherAnalytics,
  getStudentAnalytics,
  getParentAnalytics,
};
