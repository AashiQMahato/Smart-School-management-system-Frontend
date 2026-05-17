import axios from "axios";
import BASE_URL from "../config/baseUrl";

const API_URL = `${BASE_URL}/admin`;

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

// ============ USER MANAGEMENT ============

/**
 * Get all users with filters
 */
export const getAllUsers = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.role) params.append("role", filters.role);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const url = params.toString()
      ? `${API_URL}/users?${params}`
      : `${API_URL}/users`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching users");
  }
};

/**
 * Create a new user
 */
export const createUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/users`,
      userData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating user");
  }
};

/**
 * Get users by role
 */
export const getUsersByRole = async (role) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/role/${role}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching users by role",
    );
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/${userId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching user");
  }
};

/**
 * Update user
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      userData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating user");
  }
};

/**
 * Reset user password
 */
export const resetUserPassword = async (userId, newPassword) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/${userId}/reset-password`,
      { newPassword },
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error resetting password",
    );
  }
};

/**
 * Delete user
 */
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/users/${userId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting user");
  }
};

// ============ STUDENT MANAGEMENT ============

/**
 * Get all students
 */
export const getAllStudents = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.classId) params.append("classId", filters.classId);
    if (filters.section) params.append("section", filters.section);
    if (filters.academicYear)
      params.append("academicYear", filters.academicYear);
    if (filters.search) params.append("search", filters.search);

    const url = params.toString()
      ? `${API_URL}/students?${params}`
      : `${API_URL}/students`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching students");
  }
};

/**
 * Create student with class assignment
 */
export const createStudent = async (studentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/students`,
      studentData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating student");
  }
};

/**
 * Get students by class
 */
export const getStudentsByClass = async (classId) => {
  try {
    const response = await axios.get(
      `${API_URL}/students/class/${classId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching students");
  }
};

/**
 * Get student profile by user ID
 */
export const getStudentProfileByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/students/user/${userId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching student profile",
    );
  }
};

/**
 * Update student
 */
export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await axios.put(
      `${API_URL}/students/${studentId}`,
      studentData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating student");
  }
};

/**
 * Assign parent to student
 */
export const assignParentToStudent = async (studentId, parentId) => {
  try {
    const response = await axios.post(
      `${API_URL}/students/assign-parent`,
      { studentId, parentId },
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error assigning parent");
  }
};

/**
 * Change student class
 */
export const changeStudentClass = async (
  studentId,
  newClassId,
  newSection,
  newRollNumber,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/students/change-class`,
      { studentId, newClassId, newSection, newRollNumber },
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error changing student class",
    );
  }
};

// ============ PARENT MANAGEMENT ============

/**
 * Get all parents (Parent profiles)
 */
export const getAllParents = async () => {
  try {
    const response = await axios.get(`${API_URL}/parents`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching parents");
  }
};

/**
 * Get children by parent ID
 */
export const getChildrenByParentId = async (parentId) => {
  try {
    const response = await axios.get(
      `${API_URL}/parents/${parentId}/children`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching children");
  }
};

/**
 * Link child to parent
 */
export const linkChildToParent = async (parentId, studentId) => {
  try {
    const response = await axios.post(
      `${API_URL}/parents/link-child`,
      { parentId, studentId },
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error linking child to parent",
    );
  }
};

/**
 * Unlink child from parent
 */
export const unlinkChildFromParent = async (parentId, studentId) => {
  try {
    const response = await axios.post(
      `${API_URL}/parents/unlink-child`,
      { parentId, studentId },
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error unlinking child from parent",
    );
  }
};

// ============ CLASS & SUBJECT ASSIGNMENTS ============

/**
 * Get all teachers
 */
export const getAllTeachers = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);

    const url = params.toString()
      ? `${API_URL}/teachers?${params}`
      : `${API_URL}/teachers`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching teachers");
  }
};

/**
 * Get teacher by ID
 */
export const getTeacherById = async (teacherId) => {
  try {
    const response = await axios.get(
      `${API_URL}/teachers/${teacherId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching teacher");
  }
};

/**
 * Update teacher profile
 */
export const updateTeacher = async (teacherId, teacherData) => {
  try {
    const response = await axios.put(
      `${API_URL}/teachers/${teacherId}`,
      teacherData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating teacher");
  }
};

/**
 * Assign class teacher
 */
export const assignClassTeacher = async (classId, teacherId) => {
  try {
    const response = await axios.post(
      `${API_URL}/classes/assign-teacher`,
      { classId, teacherId },
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error assigning class teacher",
    );
  }
};

/**
 * Remove class teacher
 */
export const removeClassTeacher = async (classId) => {
  try {
    const response = await axios.post(
      `${API_URL}/classes/remove-teacher`,
      { classId },
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error removing class teacher",
    );
  }
};

/**
 * Get all classes with teacher info
 */
export const getAllClassesWithTeachers = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/classes/with-teachers`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching classes");
  }
};

/**
 * Assign teacher to subject
 */
export const assignTeacherToSubject = async (subjectId, teacherId) => {
  try {
    const response = await axios.post(
      `${API_URL}/subjects/assign-teacher`,
      { subjectId, teacherId },
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error assigning teacher to subject",
    );
  }
};

/**
 * Get teacher assignments
 */
export const getTeacherAssignments = async (teacherId) => {
  try {
    const response = await axios.get(
      `${API_URL}/teachers/${teacherId}/assignments`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching teacher assignments",
    );
  }
};

// ============ DASHBOARD ============

/**
 * Get admin dashboard stats
 */
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/dashboard/stats`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching dashboard stats",
    );
  }
};

// ============ PASSWORD GENERATION ============

/**
 * Generate a random password
 */
export const generatePassword = (length = 10) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

export default {
  // User management
  getAllUsers,
  createUser,
  getUsersByRole,
  getUserById,
  updateUser,
  resetUserPassword,
  deleteUser,
  // Student management
  getAllStudents,
  createStudent,
  getStudentsByClass,
  getStudentProfileByUserId,
  updateStudent,
  assignParentToStudent,
  changeStudentClass,
  // Parent management
  getChildrenByParentId,
  linkChildToParent,
  unlinkChildFromParent,
  // Teacher management
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  // Class & Subject assignments
  assignClassTeacher,
  removeClassTeacher,
  getAllClassesWithTeachers,
  assignTeacherToSubject,
  getTeacherAssignments,
  // Dashboard
  getDashboardStats,
  // Utils
  generatePassword,
};
