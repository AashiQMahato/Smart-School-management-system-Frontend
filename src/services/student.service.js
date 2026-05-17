import axios from "axios";
import BASE_URL from "../config/baseUrl";

const API_URL = `${BASE_URL}`;

const normalizeStudentProfile = (profile) => {
  if (!profile || typeof profile !== "object") return profile;

  // Backend student profile uses `classId` (populated). Some pages expect `class`.
  const classValue = profile.class || profile.classId || null;

  return {
    ...profile,
    class: classValue,
  };
};

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
 * Get current student's profile with class and parent info
 * Fetches data based on logged-in user's roleProfile
 */
export const getMyStudentProfile = async () => {
  try {
    // Get current user data from storage
    const userData = localStorage.getItem("ssms_user");
    if (!userData) {
      throw new Error("User not authenticated");
    }
    const user = JSON.parse(userData);

    // If roleProfile exists and looks populated, return it directly.
    // Otherwise fall back to /users/me to avoid stale/incomplete localStorage payloads.
    if (user.roleProfile) {
      const rp = user.roleProfile;
      const hasPopulatedUser =
        rp.userId &&
        typeof rp.userId === "object" &&
        (rp.userId.email || rp.userId.name);
      const hasClass =
        (rp.classId &&
          typeof rp.classId === "object" &&
          (rp.classId._id || rp.classId.name)) ||
        typeof rp.classId === "string";

      const classObj =
        rp.class && typeof rp.class === "object" ? rp.class : rp.classId;
      const classTeacher = classObj?.classTeacher;
      const classTeacherOk =
        // no class teacher assigned is valid
        classTeacher == null ||
        // populated teacher profile with populated user
        (typeof classTeacher === "object" &&
          (classTeacher.userId?.name || classTeacher.userId?.email));

      if (hasPopulatedUser && hasClass && classTeacherOk) {
        return { data: normalizeStudentProfile(rp), success: true };
      }
    }

    // Otherwise fetch from API (student-accessible)
    const response = await axios.get(`${API_URL}/users/me`, getAuthHeaders());

    // user.routes returns: { success, user, roleProfile }
    if (response.data?.roleProfile) {
      return {
        data: normalizeStudentProfile(response.data.roleProfile),
        success: true,
      };
    }

    // Fallback to prevent undefined access in callers
    return { data: null, success: false };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching student profile",
    );
  }
};

/**
 * Get student's class subjects
 */
export const getMySubjects = async (classId) => {
  try {
    const response = await axios.get(
      `${API_URL}/subjects?classId=${classId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching subjects");
  }
};

/**
 * Get student's attendance
 */
export const getMyAttendance = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.classId) params.append("classId", filters.classId);

    const url = params.toString()
      ? `${API_URL}/attendance/my?${params}`
      : `${API_URL}/attendance/my`;

    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching attendance",
    );
  }
};

/**
 * Get student's timetable/schedule
 */
export const getMyTimetable = async (classId) => {
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

export default {
  getMyStudentProfile,
  getMySubjects,
  getMyAttendance,
  getMyTimetable,
};
