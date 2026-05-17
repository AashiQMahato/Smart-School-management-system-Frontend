import axios from "axios";
import BASE_URL from "../config/baseUrl";

const API_URL = `${BASE_URL}`;

const isDebugEnabled = () => {
  try {
    return localStorage.getItem("ssms_debug") === "1";
  } catch {
    return false;
  }
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
 * Get current teacher's profile ID from storage
 */
const getTeacherProfileId = () => {
  const userData = localStorage.getItem("ssms_user");
  if (!userData) {
    throw new Error("User not authenticated");
  }
  const user = JSON.parse(userData);
  // roleProfile contains the teacher profile data with _id
  if (user.roleProfile && user.roleProfile._id) {
    return user.roleProfile._id;
  }
  throw new Error("Teacher profile not found");
};

/**
 * Get current teacher's assigned classes and subjects
 * Auto-fetches based on logged-in teacher's profile ID
 */
export const getMyAssignments = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/teachers/me/assignments`,
      getAuthHeaders(),
    );
    const payload = response.data;
    const raw = payload?.data;

    // Some pages (Mark/Manage Attendance) want a flat list:
    // [{ classId: <Class|id>, subjectId?: <Subject|id> }]
    // But other pages (TeacherDashboard) expect the original object payload.
    let items = [];
    if (Array.isArray(raw)) {
      items = raw;
    } else {
      // Prefer explicit schedule-derived pairs from backend when available
      if (Array.isArray(raw?.assignedSubjectPairs)) {
        items.push(
          ...raw.assignedSubjectPairs.map((pair) => ({
            classId: pair?.classId || null,
            subjectId: pair?.subjectId || null,
          })),
        );
      }

      // Fallback: subjects may include classId
      if (Array.isArray(raw?.assignedSubjects)) {
        raw.assignedSubjects.forEach((subject) => {
          const linked = [];
          if (subject?.classId) linked.push(subject.classId);
          if (Array.isArray(subject?.classIds) && subject.classIds.length) {
            linked.push(...subject.classIds);
          }

          // If subject isn't linked to a class, keep it but it won't be class-filterable.
          if (linked.length === 0) {
            items.push({ classId: null, subjectId: subject });
            return;
          }

          linked.forEach((classRef) => {
            items.push({ classId: classRef || null, subjectId: subject });
          });
        });
      }

      // Include pure class assignments (no subject) so class teachers can at least select the class
      if (Array.isArray(raw?.assignedClasses)) {
        items.push(
          ...raw.assignedClasses.map((cls) => ({
            classId: cls,
            subjectId: null,
          })),
        );
      }

      if (Array.isArray(raw?.classTeacherOf)) {
        items.push(
          ...raw.classTeacherOf.map((cls) => ({
            classId: cls,
            subjectId: null,
          })),
        );
      }
    }

    // De-dupe by class+subject
    const deduped = [
      ...new Map(
        items
          .filter((x) => x?.classId)
          .map((x) => {
            const classKey = x.classId?._id || x.classId;
            const subjectKey = x.subjectId?._id || x.subjectId || "";
            return [`${classKey}::${subjectKey}`, x];
          }),
      ).values(),
    ];

    return { ...payload, items: deduped };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching assignments",
    );
  }
};

/**
 * Get students in a specific class
 */
export const getStudentsByClass = async (classId, subjectId) => {
  try {
    const resolvedClassId =
      typeof classId === "object" && classId !== null
        ? classId?._id || classId?.id
        : classId;

    if (!resolvedClassId) {
      throw new Error("classId is required");
    }

    const params = new URLSearchParams();
    if (subjectId) params.set("subjectId", subjectId);

    const url = params.toString()
      ? `${API_URL}/teachers/class/${resolvedClassId}/students?${params.toString()}`
      : `${API_URL}/teachers/class/${resolvedClassId}/students`;

    if (isDebugEnabled()) {
      console.log("[teacher.service] getStudentsByClass request", {
        classId: resolvedClassId,
        subjectId,
        url,
        hasToken: !!localStorage.getItem("ssms_token"),
      });
    }

    const response = await axios.get(url, getAuthHeaders());
    if (isDebugEnabled()) {
      console.log("[teacher.service] getStudentsByClass response", {
        url,
        status: response?.status,
        success: response?.data?.success,
        count: response?.data?.count,
      });
    }

    if (isDebugEnabled()) {
      console.log("[teacher.service] getStudentsByClass response", {
        url,
        success: response?.data?.success,
        count: response?.data?.count,
      });
    }

    return response.data;
  } catch (error) {
    if (isDebugEnabled()) {
      console.log("[teacher.service] getStudentsByClass error", {
        classId,
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });
    }

    console.error(error);
    const status = error.response?.status;
    const backendMessage = error.response?.data?.message;
    const backendError = error.response?.data?.error;
    const details = backendError ? `: ${backendError}` : "";
    const statusText = status ? ` (HTTP ${status})` : "";

    throw new Error(
      `${backendMessage || "Error fetching students"}${statusText}${details}`,
    );
  }
};

/**
 * Get teacher's schedule
 */
export const getMySchedule = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/schedules/teacher`,
      getAuthHeaders(),
    );
    // Normalize to legacy shape expected by TeacherDashboard (array)
    return { data: response.data?.data?.items || [] };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching schedule");
  }
};

/**
 * Get subjects assigned to teacher
 */
export const getMySubjects = async () => {
  try {
    const teacherId = getTeacherProfileId();
    const response = await axios.get(
      `${API_URL}/subjects?teacherId=${teacherId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching subjects");
  }
};

/**
 * Get classes assigned to teacher (as class teacher)
 */
export const getMyClasses = async () => {
  try {
    const teacherId = getTeacherProfileId();
    const response = await axios.get(
      `${API_URL}/classes?classTeacher=${teacherId}`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching classes");
  }
};

export default {
  getMyAssignments,
  getStudentsByClass,
  getMySchedule,
  getMySubjects,
  getMyClasses,
};
