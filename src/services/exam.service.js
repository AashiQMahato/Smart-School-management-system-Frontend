import axios from "axios";
import BASE_URL from "../config/baseUrl";

const API_URL = `${BASE_URL}/exams`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("ssms_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ===== EXAM CRUD =====

export const createExam = async (data) => {
  const res = await axios.post(API_URL, data, getAuthHeaders());
  return res.data;
};

export const getAllExams = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v) params.append(k, v);
  });
  const url = params.toString() ? `${API_URL}?${params}` : API_URL;
  const res = await axios.get(url, getAuthHeaders());
  return res.data;
};

export const getExamById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return res.data;
};

export const updateExam = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
  return res.data;
};

export const deleteExam = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return res.data;
};

// ===== EXAM SUBJECTS =====

export const addExamSubjects = async (examId, subjects) => {
  const res = await axios.post(
    `${API_URL}/${examId}/subjects`,
    { subjects },
    getAuthHeaders(),
  );
  return res.data;
};

export const getExamSubjects = async (examId, classId) => {
  const url = classId
    ? `${API_URL}/${examId}/subjects?classId=${classId}`
    : `${API_URL}/${examId}/subjects`;
  const res = await axios.get(url, getAuthHeaders());
  return res.data;
};

export const updateExamSubject = async (id, data) => {
  const res = await axios.put(
    `${API_URL}/subjects/${id}`,
    data,
    getAuthHeaders(),
  );
  return res.data;
};

// ===== MARKS =====

export const enterMarks = async (examId, examSubjectId, marks) => {
  const res = await axios.post(
    `${API_URL}/${examId}/marks`,
    { examSubjectId, marks },
    getAuthHeaders(),
  );
  return res.data;
};

export const submitMarksForApproval = async (examSubjectId) => {
  const res = await axios.post(
    `${API_URL}/marks/${examSubjectId}/submit`,
    {},
    getAuthHeaders(),
  );
  return res.data;
};

// ===== APPROVAL =====

export const getApprovalQueue = async () => {
  const res = await axios.get(`${API_URL}/approval/queue`, getAuthHeaders());
  return res.data;
};

export const approveMarks = async (examSubjectId) => {
  const res = await axios.post(
    `${API_URL}/marks/${examSubjectId}/approve`,
    {},
    getAuthHeaders(),
  );
  return res.data;
};

export const rejectMarks = async (examSubjectId) => {
  const res = await axios.post(
    `${API_URL}/marks/${examSubjectId}/reject`,
    {},
    getAuthHeaders(),
  );
  return res.data;
};

// ===== PUBLISH =====

export const publishExamResults = async (examId, classId) => {
  const res = await axios.post(
    `${API_URL}/${examId}/publish`,
    { classId },
    getAuthHeaders(),
  );
  return res.data;
};

export const unpublishExamResults = async (examId, classId) => {
  const res = await axios.post(
    `${API_URL}/${examId}/unpublish`,
    { classId },
    getAuthHeaders(),
  );
  return res.data;
};

// ===== RESULTS =====

export const getExamResults = async (examId, classId, subjectId) => {
  const params = new URLSearchParams();
  if (classId) params.append("classId", classId);
  if (subjectId) params.append("subjectId", subjectId);
  const url = params.toString()
    ? `${API_URL}/${examId}/results?${params}`
    : `${API_URL}/${examId}/results`;
  const res = await axios.get(url, getAuthHeaders());
  return res.data;
};

export const getClassAnalytics = async (examId, classId) => {
  const res = await axios.get(
    `${API_URL}/${examId}/analytics/${classId}`,
    getAuthHeaders(),
  );
  return res.data;
};

// ===== STUDENT =====

export const getMyExamResults = async (examId) => {
  const url = examId
    ? `${API_URL}/student/my-results?examId=${examId}`
    : `${API_URL}/student/my-results`;
  const res = await axios.get(url, getAuthHeaders());
  return res.data;
};

// ===== PARENT =====

export const getChildExamResults = async (studentId, examId) => {
  const url = examId
    ? `${API_URL}/parent/child/${studentId}?examId=${examId}`
    : `${API_URL}/parent/child/${studentId}`;
  const res = await axios.get(url, getAuthHeaders());
  return res.data;
};

// ===== REPORT CARD =====

export const getReportCard = async (studentId, examId) => {
  const url = examId
    ? `${API_URL}/report-card/${studentId}?examId=${examId}`
    : `${API_URL}/report-card/${studentId}`;
  const res = await axios.get(url, getAuthHeaders());
  return res.data;
};

// ===== TEACHER =====

export const getTeacherExams = async () => {
  const res = await axios.get(`${API_URL}/teacher/my-exams`, getAuthHeaders());
  return res.data;
};

// ===== ADMIN OVERVIEW =====

export const getAdminOverview = async () => {
  const res = await axios.get(`${API_URL}/admin/overview`, getAuthHeaders());
  return res.data;
};

// ===== STUDENT PUBLISHED EXAMS =====

export const getStudentPublishedExams = async () => {
  const res = await axios.get(
    `${API_URL}/student/published-exams`,
    getAuthHeaders(),
  );
  return res.data;
};

// ===== PARENT: CHILD PUBLISHED EXAMS =====

export const getChildPublishedExams = async (studentId) => {
  const res = await axios.get(
    `${API_URL}/parent/child/${studentId}/exams`,
    getAuthHeaders(),
  );
  return res.data;
};

export default {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  addExamSubjects,
  getExamSubjects,
  updateExamSubject,
  enterMarks,
  submitMarksForApproval,
  getApprovalQueue,
  approveMarks,
  rejectMarks,
  publishExamResults,
  unpublishExamResults,
  getExamResults,
  getClassAnalytics,
  getMyExamResults,
  getChildExamResults,
  getReportCard,
  getTeacherExams,
  getAdminOverview,
  getStudentPublishedExams,
  getChildPublishedExams,
};
