/**
 * Result Service
 * Handles all result/marks-related API calls
 */

import axios from "axios";
import BASE_URL from "../config/baseUrl";

const API_URL = `${BASE_URL}/results`;

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
 * Create a new result entry
 */
export const createResult = async (resultData) => {
  try {
    const response = await axios.post(API_URL, resultData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating result");
  }
};

/**
 * Create bulk results
 */
export const createBulkResults = async (bulkData) => {
  try {
    const response = await axios.post(
      `${API_URL}/bulk`,
      bulkData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error creating bulk results",
    );
  }
};

/**
 * Get results by class
 */
export const getResultsByClass = async (classId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.examType) params.append("examType", filters.examType);
    if (filters.subjectId) params.append("subjectId", filters.subjectId);
    if (filters.academicYear)
      params.append("academicYear", filters.academicYear);
    if (filters.isPublished !== undefined)
      params.append("isPublished", filters.isPublished);

    const url = params.toString()
      ? `${API_URL}/class/${classId}?${params}`
      : `${API_URL}/class/${classId}`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching results");
  }
};

/**
 * Get results by student
 */
export const getResultsByStudent = async (studentId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.examType) params.append("examType", filters.examType);
    if (filters.subjectId) params.append("subjectId", filters.subjectId);
    if (filters.academicYear)
      params.append("academicYear", filters.academicYear);

    const url = params.toString()
      ? `${API_URL}/student/${studentId}?${params}`
      : `${API_URL}/student/${studentId}`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching results");
  }
};

/**
 * Get my results (for logged-in student)
 */
export const getMyResults = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.examType) params.append("examType", filters.examType);
    if (filters.subjectId) params.append("subjectId", filters.subjectId);
    if (filters.academicYear)
      params.append("academicYear", filters.academicYear);

    const url = params.toString() ? `${API_URL}/my?${params}` : `${API_URL}/my`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching results");
  }
};

/**
 * Update a result
 */
export const updateResult = async (resultId, resultData) => {
  try {
    const response = await axios.put(
      `${API_URL}/${resultId}`,
      resultData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating result");
  }
};

/**
 * Publish results
 */
export const publishResults = async (publishData) => {
  try {
    const response = await axios.post(
      `${API_URL}/publish`,
      publishData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error publishing results",
    );
  }
};

/**
 * Delete a result
 */
export const deleteResult = async (resultId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${resultId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting result");
  }
};

export default {
  createResult,
  createBulkResults,
  getResultsByClass,
  getResultsByStudent,
  getMyResults,
  updateResult,
  publishResults,
  deleteResult,
};
