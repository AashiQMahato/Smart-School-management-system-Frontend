import axios from "axios";
import BASE_URL from "../config/baseUrl";

const API_URL = `${BASE_URL}/attendance`;

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
 * Mark attendance for students
 * @param {Object} attendanceData - { classId, subjectId, date, attendanceRecords }
 * @returns {Promise}
 */
export const markAttendance = async (attendanceData) => {
  try {
    const response = await axios.post(
      `${API_URL}/mark`,
      attendanceData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error marking attendance",
    );
  }
};

/**
 * Update a specific attendance record
 * @param {string} attendanceId - Attendance record ID
 * @param {Object} updateData - { status, remarks }
 * @returns {Promise}
 */
export const updateAttendance = async (attendanceId, updateData) => {
  try {
    const response = await axios.put(
      `${API_URL}/${attendanceId}`,
      updateData,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error updating attendance",
    );
  }
};

/**
 * Delete attendance record (Admin only)
 * @param {string} attendanceId - Attendance record ID
 * @returns {Promise}
 */
export const deleteAttendance = async (attendanceId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${attendanceId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error deleting attendance",
    );
  }
};

/**
 * Get attendance by class and date
 * @param {Object} params - { classId, subjectId?, date?, startDate?, endDate? }
 * @returns {Promise}
 */
export const getAttendanceByClass = async (params) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.classId) queryParams.append("classId", params.classId);
    if (params.subjectId) queryParams.append("subjectId", params.subjectId);
    if (params.date) queryParams.append("date", params.date);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    const response = await axios.get(
      `${API_URL}/class?${queryParams.toString()}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching attendance",
    );
  }
};

/**
 * Get students for attendance marking
 * @param {Object} params - { classId, subjectId?, date? }
 * @returns {Promise}
 */
export const getStudentsForAttendance = async (params) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.classId) queryParams.append("classId", params.classId);
    if (params.subjectId) queryParams.append("subjectId", params.subjectId);
    if (params.date) queryParams.append("date", params.date);

    const response = await axios.get(
      `${API_URL}/students?${queryParams.toString()}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching students");
  }
};

/**
 * Get attendance for a student
 * @param {Object} params - { studentId?, startDate?, endDate?, subjectId? }
 * @returns {Promise}
 */
export const getAttendanceByStudent = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.studentId) queryParams.append("studentId", params.studentId);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.subjectId) queryParams.append("subjectId", params.subjectId);

    const response = await axios.get(
      `${API_URL}/student?${queryParams.toString()}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching student attendance",
    );
  }
};

/**
 * Get attendance for the logged-in student
 * Backend: GET /api/attendance/my
 * @param {Object} params - { startDate?, endDate?, subjectId?, classId? }
 * @returns {Promise}
 */
export const getMyAttendance = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.subjectId) queryParams.append("subjectId", params.subjectId);
    if (params.classId) queryParams.append("classId", params.classId);

    const suffix = queryParams.toString();
    const url = suffix ? `${API_URL}/my?${suffix}` : `${API_URL}/my`;

    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching my attendance",
    );
  }
};

/**
 * Get attendance for parent's child
 * @param {Object} params - { childId, startDate?, endDate?, subjectId? }
 * @returns {Promise}
 */
export const getAttendanceForChild = async (params) => {
  try {
    const queryParams = new URLSearchParams();
    // Backend supports parent access via /attendance/student with studentId
    const studentId = params?.studentId || params?.childId;
    if (studentId) queryParams.append("studentId", studentId);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.subjectId) queryParams.append("subjectId", params.subjectId);

    const response = await axios.get(
      `${API_URL}/student?${queryParams.toString()}`,
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
 * Get attendance summary/statistics
 * @param {Object} params - { classId?, subjectId?, studentId?, startDate?, endDate? }
 * @returns {Promise}
 */
export const getAttendanceSummary = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.classId) queryParams.append("classId", params.classId);
    if (params.subjectId) queryParams.append("subjectId", params.subjectId);
    if (params.studentId) queryParams.append("studentId", params.studentId);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    const response = await axios.get(
      `${API_URL}/summary?${queryParams.toString()}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching attendance summary",
    );
  }
};

/**
 * Helper to format date for API
 * @param {Date} date
 * @returns {string} YYYY-MM-DD format
 */
export const formatDateForAPI = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

/**
 * Helper to get date range for current month
 * @returns {Object} { startDate, endDate }
 */
export const getCurrentMonthRange = () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate),
  };
};

/**
 * Helper to calculate attendance percentage
 * @param {number} present
 * @param {number} total
 * @returns {number} percentage
 */
export const calculateAttendancePercentage = (present, total) => {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
};

/**
 * Helper to get attendance status color
 * @param {string} status
 * @returns {string} color class
 */
export const getAttendanceStatusColor = (status) => {
  const colors = {
    present: "text-green-600 bg-green-50",
    absent: "text-red-600 bg-red-50",
    late: "text-yellow-600 bg-yellow-50",
  };
  return colors[status] || "text-gray-600 bg-gray-50";
};

/**
 * Helper to get attendance status badge color (dark mode compatible)
 * @param {string} status
 * @returns {string} color class
 */
export const getAttendanceStatusBadge = (status) => {
  const badges = {
    present:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    absent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  };
  return (
    badges[status] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  );
};
