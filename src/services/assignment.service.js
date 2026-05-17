import axios from "axios";
import BASE_URL from "../config/baseUrl";

const API_URL = `${BASE_URL}/assignments`;

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

// ============= TEACHER SERVICES =============

// Create new assignment
export const createAssignment = async (assignmentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/teacher/assignments`,
      assignmentData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error creating assignment",
    );
  }
};

// Get all teacher assignments
export const getTeacherAssignments = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.class) params.append("class", filters.class);
    if (filters.subject) params.append("subject", filters.subject);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const url = params.toString()
      ? `${API_URL}/teacher/assignments?${params}`
      : `${API_URL}/teacher/assignments`;

    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching assignments",
    );
  }
};

// Get assignment analytics
export const getAssignmentAnalytics = async (academicYear) => {
  try {
    const params = academicYear ? `?academicYear=${academicYear}` : "";
    const response = await axios.get(
      `${API_URL}/teacher/assignments/analytics${params}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching analytics",
    );
  }
};

// Get assignment by ID
export const getAssignmentById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/teacher/assignments/${id}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching assignment",
    );
  }
};

// Update assignment
export const updateAssignment = async (id, assignmentData) => {
  try {
    const response = await axios.put(
      `${API_URL}/teacher/assignments/${id}`,
      assignmentData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error updating assignment",
    );
  }
};

// Delete assignment
export const deleteAssignment = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/teacher/assignments/${id}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error deleting assignment",
    );
  }
};

// Get submissions for an assignment
export const getAssignmentSubmissions = async (id, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.isLate !== undefined) params.append("isLate", filters.isLate);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const url = params.toString()
      ? `${API_URL}/teacher/assignments/${id}/submissions?${params}`
      : `${API_URL}/teacher/assignments/${id}/submissions`;

    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching submissions",
    );
  }
};

// Get non-submitters
export const getNonSubmitters = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/teacher/assignments/${id}/non-submitters`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching non-submitters",
    );
  }
};

// Grade a submission
export const gradeSubmission = async (submissionId, gradeData) => {
  try {
    const response = await axios.put(
      `${API_URL}/teacher/submissions/${submissionId}/grade`,
      gradeData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error grading submission",
    );
  }
};

// ============= STUDENT SERVICES =============

// Get all student assignments
export const getStudentAssignments = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.subject) params.append("subject", filters.subject);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const url = params.toString()
      ? `${API_URL}/student/assignments?${params}`
      : `${API_URL}/student/assignments`;

    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching assignments",
    );
  }
};

// Get student assignment by ID
export const getStudentAssignmentById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/student/assignments/${id}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching assignment",
    );
  }
};

// Submit assignment
export const submitAssignment = async (id, submissionData) => {
  try {
    const response = await axios.post(
      `${API_URL}/student/assignments/${id}/submit`,
      submissionData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error submitting assignment",
    );
  }
};

// Get student submissions
export const getMySubmissions = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.subject) params.append("subject", filters.subject);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const url = params.toString()
      ? `${API_URL}/student/submissions?${params}`
      : `${API_URL}/student/submissions`;

    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching submissions",
    );
  }
};

// Get submission statistics
export const getSubmissionStats = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/student/submissions/stats`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching statistics",
    );
  }
};

// Get submission by ID
export const getSubmissionById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/student/submissions/${id}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching submission",
    );
  }
};

// Update submission
export const updateSubmission = async (id, submissionData) => {
  try {
    const response = await axios.put(
      `${API_URL}/student/submissions/${id}`,
      submissionData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error updating submission",
    );
  }
};

// ============= FILE UPLOAD SERVICE =============

// Upload file (can be used for both assignments and submissions)
export const uploadFile = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ssms_token")}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error uploading file");
  }
};

export default {
  // Teacher
  createAssignment,
  getTeacherAssignments,
  getAssignmentAnalytics,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getAssignmentSubmissions,
  getNonSubmitters,
  gradeSubmission,
  // Student
  getStudentAssignments,
  getStudentAssignmentById,
  submitAssignment,
  getMySubmissions,
  getSubmissionStats,
  getSubmissionById,
  updateSubmission,
  // File
  uploadFile,
};

// ============= ADMIN SERVICES =============

export const getAdminAssignments = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.class) params.append("class", filters.class);
    if (filters.subject) params.append("subject", filters.subject);
    if (filters.teacher) params.append("teacher", filters.teacher);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const url = params.toString()
      ? `${API_URL}/admin/assignments?${params}`
      : `${API_URL}/admin/assignments`;

    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching admin assignments",
    );
  }
};

export const adminCreateAssignment = async (assignmentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/assignments`,
      assignmentData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error creating admin assignment",
    );
  }
};

export const getAdminAssignmentById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/assignments/${id}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching admin assignment",
    );
  }
};

export const adminUpdateAssignment = async (id, assignmentData) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/assignments/${id}`,
      assignmentData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error updating admin assignment",
    );
  }
};

export const adminDeleteAssignment = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/admin/assignments/${id}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error deleting admin assignment",
    );
  }
};
