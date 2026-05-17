import axios from "axios";
import BASE_URL from "../config/baseUrl";

const API_URL = `${BASE_URL}/subjects`;

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

// Create a new subject
export const createSubject = async (subjectData) => {
  try {
    const payload = { ...subjectData };
    if (payload.assignedTeacher === "") delete payload.assignedTeacher;
    if (payload.classId === "") delete payload.classId;
    if (Array.isArray(payload.classIds) && payload.classIds.length === 0)
      delete payload.classIds;

    const response = await axios.post(API_URL, payload, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating subject");
  }
};

// Get all subjects
export const getAllSubjects = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.academicYear)
      params.append("academicYear", filters.academicYear);
    if (filters.classId) params.append("classId", filters.classId);
    if (filters.teacherId) params.append("teacherId", filters.teacherId);
    if (filters.showAll !== undefined)
      params.append("showAll", filters.showAll);
    if (filters.isActive !== undefined)
      params.append("isActive", filters.isActive);

    const url = params.toString() ? `${API_URL}?${params}` : API_URL;
    const response = await axios.get(url, getAuthHeaders());

    console.log("📡 Frontend received:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Frontend API error:", error);
    throw new Error(error.response?.data?.message || "Error fetching subjects");
  }
};

// Get subject by ID
export const getSubjectById = async (subjectId) => {
  try {
    const response = await axios.get(
      `${API_URL}/${subjectId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching subject");
  }
};

// Update subject
export const updateSubject = async (subjectId, updateData) => {
  try {
    const payload = { ...updateData };
    if (payload.assignedTeacher === "") delete payload.assignedTeacher;
    if (payload.classId === "") delete payload.classId;
    if (Array.isArray(payload.classIds) && payload.classIds.length === 0)
      delete payload.classIds;

    const response = await axios.put(
      `${API_URL}/${subjectId}`,
      payload,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating subject");
  }
};

// Delete subject
export const deleteSubject = async (subjectId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${subjectId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting subject");
  }
};

// Assign teacher to subject
export const assignTeacher = async (subjectId, teacherId) => {
  try {
    const response = await axios.post(
      `${API_URL}/${subjectId}/assign-teacher`,
      { teacherId },
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error assigning teacher");
  }
};

export default {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  assignTeacher,
};
