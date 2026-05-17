/**
 * Fee Service - Complete Fee Payment Module API Client
 */

import axios from "axios";
import BASE_URL from "../config/baseUrl";

const API_URL = `${BASE_URL}/fees`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("ssms_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ═══════════════════════════════════════
// FEE STRUCTURES (ADMIN)
// ═══════════════════════════════════════

export const createFeeStructure = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/structures`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating fee structure");
  }
};

export const getAllFeeStructures = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.classId) params.append("classId", filters.classId);
    if (filters.academicYear) params.append("academicYear", filters.academicYear);
    if (filters.feeType) params.append("feeType", filters.feeType);
    if (filters.isActive !== undefined) params.append("isActive", filters.isActive);

    const url = params.toString() ? `${API_URL}/structures?${params}` : `${API_URL}/structures`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching fee structures");
  }
};

export const updateFeeStructure = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/structures/${id}`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating fee structure");
  }
};

export const deleteFeeStructure = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/structures/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting fee structure");
  }
};

export const toggleFeeStructure = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/structures/${id}/toggle`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error toggling fee structure");
  }
};

// ═══════════════════════════════════════
// FEE ASSIGNMENT (ADMIN)
// ═══════════════════════════════════════

export const assignFeesToClass = async (feeStructureId) => {
  try {
    const response = await axios.post(`${API_URL}/assign`, { feeStructureId }, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error assigning fees");
  }
};

// ═══════════════════════════════════════
// FEE CRUD (ADMIN)
// ═══════════════════════════════════════

export const createFee = async (feeData) => {
  try {
    const response = await axios.post(API_URL, feeData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating fee");
  }
};

export const createBulkFees = async (bulkData) => {
  try {
    const response = await axios.post(`${API_URL}/bulk`, bulkData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating bulk fees");
  }
};

export const getAllFees = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.feeType) params.append("feeType", filters.feeType);
    if (filters.paymentStatus) params.append("paymentStatus", filters.paymentStatus);
    if (filters.academicYear) params.append("academicYear", filters.academicYear);
    if (filters.period) params.append("period", filters.period);
    if (filters.classId) params.append("classId", filters.classId);
    if (filters.search) params.append("search", filters.search);

    const url = params.toString() ? `${API_URL}?${params}` : API_URL;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching fees");
  }
};

export const updateFee = async (feeId, feeData) => {
  try {
    const response = await axios.put(`${API_URL}/${feeId}`, feeData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating fee");
  }
};

export const deleteFee = async (feeId) => {
  try {
    const response = await axios.delete(`${API_URL}/${feeId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting fee");
  }
};

// ═══════════════════════════════════════
// FEE RETRIEVAL
// ═══════════════════════════════════════

export const getFeesByStudent = async (studentId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.feeType) params.append("feeType", filters.feeType);
    if (filters.paymentStatus) params.append("paymentStatus", filters.paymentStatus);
    if (filters.academicYear) params.append("academicYear", filters.academicYear);

    const url = params.toString()
      ? `${API_URL}/student/${studentId}?${params}`
      : `${API_URL}/student/${studentId}`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching fees");
  }
};

export const getMyFees = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.feeType) params.append("feeType", filters.feeType);
    if (filters.paymentStatus) params.append("paymentStatus", filters.paymentStatus);
    if (filters.academicYear) params.append("academicYear", filters.academicYear);

    const url = params.toString() ? `${API_URL}/my?${params}` : `${API_URL}/my`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching fees");
  }
};

// ═══════════════════════════════════════
// PAYMENTS
// ═══════════════════════════════════════

export const recordPayment = async (feeId, paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/${feeId}/pay`, paymentData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error recording payment");
  }
};

export const parentPayment = async (feeId, paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/${feeId}/parent-pay`, paymentData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error processing payment");
  }
};

export const getPaymentHistory = async (studentId) => {
  try {
    const response = await axios.get(`${API_URL}/payments/${studentId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching payment history");
  }
};

export const getAllPayments = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.paymentMethod) params.append("paymentMethod", filters.paymentMethod);
    if (filters.status) params.append("status", filters.status);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const url = params.toString() ? `${API_URL}/payments/all?${params}` : `${API_URL}/payments/all`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching payments");
  }
};

// ═══════════════════════════════════════
// ANALYTICS & RECEIPTS
// ═══════════════════════════════════════

export const getFeeStats = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.academicYear) params.append("academicYear", filters.academicYear);
    if (filters.classId) params.append("classId", filters.classId);

    const url = params.toString() ? `${API_URL}/stats/summary?${params}` : `${API_URL}/stats/summary`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching fee stats");
  }
};

export const getReceipt = async (paymentId) => {
  try {
    const response = await axios.get(`${API_URL}/receipt/${paymentId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching receipt");
  }
};

export default {
  createFeeStructure,
  getAllFeeStructures,
  updateFeeStructure,
  deleteFeeStructure,
  toggleFeeStructure,
  assignFeesToClass,
  createFee,
  createBulkFees,
  getAllFees,
  updateFee,
  deleteFee,
  getFeesByStudent,
  getMyFees,
  recordPayment,
  parentPayment,
  getPaymentHistory,
  getAllPayments,
  getFeeStats,
  getReceipt,
};
