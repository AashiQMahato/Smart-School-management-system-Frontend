/**
 * Calendar Service
 * API calls for academic calendar module
 */

import axios from "axios";
import BASE_URL from "../config/baseUrl";

const API = `${BASE_URL}/calendar`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("ssms_token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ==================== ACADEMIC YEARS ====================

export const createAcademicYear = async (data) => {
  const res = await axios.post(`${API}/academic-years`, data, getAuthHeaders());
  return res.data;
};

export const getAllAcademicYears = async () => {
  const res = await axios.get(`${API}/academic-years`, getAuthHeaders());
  return res.data;
};

export const getCurrentAcademicYear = async () => {
  const res = await axios.get(
    `${API}/academic-years/current`,
    getAuthHeaders(),
  );
  return res.data;
};

export const updateAcademicYear = async (id, data) => {
  const res = await axios.put(
    `${API}/academic-years/${id}`,
    data,
    getAuthHeaders(),
  );
  return res.data;
};

export const deleteAcademicYear = async (id) => {
  const res = await axios.delete(
    `${API}/academic-years/${id}`,
    getAuthHeaders(),
  );
  return res.data;
};

// ==================== CALENDAR EVENTS ====================

export const createEvent = async (data) => {
  const res = await axios.post(`${API}/events`, data, getAuthHeaders());
  return res.data;
};

export const getEvents = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });
  const res = await axios.get(
    `${API}/events?${params.toString()}`,
    getAuthHeaders(),
  );
  return res.data;
};

export const getEventById = async (id) => {
  const res = await axios.get(`${API}/events/${id}`, getAuthHeaders());
  return res.data;
};

export const updateEvent = async (id, data) => {
  const res = await axios.put(`${API}/events/${id}`, data, getAuthHeaders());
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await axios.delete(`${API}/events/${id}`, getAuthHeaders());
  return res.data;
};

export const togglePublishEvent = async (id) => {
  const res = await axios.patch(
    `${API}/events/${id}/toggle-publish`,
    {},
    getAuthHeaders(),
  );
  return res.data;
};

export const getAnalytics = async () => {
  const res = await axios.get(`${API}/events/analytics`, getAuthHeaders());
  return res.data;
};

// ==================== ROLE-SPECIFIC ====================

export const getTeacherEvents = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });
  const res = await axios.get(
    `${API}/teacher/events?${params.toString()}`,
    getAuthHeaders(),
  );
  return res.data;
};

export const createTeacherEvent = async (data) => {
  const res = await axios.post(`${API}/teacher/events`, data, getAuthHeaders());
  return res.data;
};

export const getStudentEvents = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });
  const res = await axios.get(
    `${API}/student/events?${params.toString()}`,
    getAuthHeaders(),
  );
  return res.data;
};

export const getParentEvents = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });
  const res = await axios.get(
    `${API}/parent/events?${params.toString()}`,
    getAuthHeaders(),
  );
  return res.data;
};

// ==================== CONSTANTS ====================

export const EVENT_TYPES = [
  { value: "exam", label: "Exam", color: "#ef4444", bg: "#fef2f2", icon: "📚" },
  {
    value: "holiday",
    label: "Holiday",
    color: "#22c55e",
    bg: "#f0fdf4",
    icon: "🎉",
  },
  {
    value: "school_event",
    label: "School Event",
    color: "#3b82f6",
    bg: "#eff6ff",
    icon: "🏫",
  },
  {
    value: "assignment_deadline",
    label: "Assignment Deadline",
    color: "#f97316",
    bg: "#fff7ed",
    icon: "📝",
  },
  {
    value: "fee_due",
    label: "Fee Due Date",
    color: "#a855f7",
    bg: "#faf5ff",
    icon: "💰",
  },
  {
    value: "announcement",
    label: "Announcement",
    color: "#6366f1",
    bg: "#eef2ff",
    icon: "📢",
  },
];

export const getEventTypeConfig = (type) => {
  return EVENT_TYPES.find((t) => t.value === type) || EVENT_TYPES[5];
};

export const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" },
];
