import axios from "axios";
import BASE_URL from "../config/baseUrl";

const API_URL = `${BASE_URL}/classes`;

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

// Create a new class
export const createClass = async (classData) => {
  try {
    const payload = { ...classData };
    if (payload.classTeacher === "") delete payload.classTeacher;

    const response = await axios.post(API_URL, payload, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating class");
  }
};

// Get all classes
export const getAllClasses = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.academicYear)
      params.append("academicYear", filters.academicYear);
    if (filters.name) params.append("name", filters.name);

    const url = params.toString() ? `${API_URL}?${params}` : API_URL;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching classes");
  }
};

// Get class by ID
export const getClassById = async (classId) => {
  try {
    const response = await axios.get(`${API_URL}/${classId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching class");
  }
};

// Update class
export const updateClass = async (classId, updateData) => {
  try {
    const payload = { ...updateData };
    if (payload.classTeacher === "") delete payload.classTeacher;

    const response = await axios.put(
      `${API_URL}/${classId}`,
      payload,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating class");
  }
};

// Delete class
export const deleteClass = async (classId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${classId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting class");
  }
};

// Assign subjects to class
export const assignSubjects = async (classId, subjectIds) => {
  try {
    const response = await axios.post(
      `${API_URL}/${classId}/subjects`,
      { subjectIds },
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error assigning subjects",
    );
  }
};

// Remove subject from class
export const removeSubject = async (classId, subjectId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${classId}/subjects/${subjectId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error removing subject");
  }
};

export default {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignSubjects,
  removeSubject,
};
