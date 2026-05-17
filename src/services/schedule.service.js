import BASE_URL from "../config/baseUrl";
const API_URL = BASE_URL;

// Token storage key (same as auth.service.js)
const TOKEN_KEY = "ssms_token";

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token;
};

// Create headers with auth token
const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const scheduleService = {
  _buildError(response, data, fallbackMessage) {
    const error = new Error(data?.message || fallbackMessage);
    error.status = response?.status;
    if (data?.conflicts) error.conflicts = data.conflicts;
    if (data?.success === false) error.success = false;
    return error;
  },

  /**
   * Create a new schedule
   */
  async createSchedule(scheduleData) {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Not authenticated. Please login first.");
    }

    const response = await fetch(`${API_URL}/schedules`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(scheduleData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      }
      throw this._buildError(response, data, "Failed to create schedule");
    }

    return data;
  },

  /**
   * Get all schedules with optional filters
   */
  async getSchedules(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_URL}/schedules${queryParams ? `?${queryParams}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch schedules");
    }

    return data;
  },

  async getAdminSchedules(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_URL}/schedules/admin${queryParams ? `?${queryParams}` : ""}`;
    const response = await fetch(url, { method: "GET", headers: getHeaders() });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch schedules");
    return data;
  },

  async getTeacherSchedules(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_URL}/schedules/teacher${queryParams ? `?${queryParams}` : ""}`;
    const response = await fetch(url, { method: "GET", headers: getHeaders() });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch schedules");
    return data;
  },

  async getStudentSchedules(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_URL}/schedules/student${queryParams ? `?${queryParams}` : ""}`;
    const response = await fetch(url, { method: "GET", headers: getHeaders() });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch schedules");
    return data;
  },

  async getParentSchedules(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_URL}/schedules/parent${queryParams ? `?${queryParams}` : ""}`;
    const response = await fetch(url, { method: "GET", headers: getHeaders() });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch schedules");
    return data;
  },

  /**
   * Get a single schedule by ID
   */
  async getScheduleById(scheduleId) {
    const response = await fetch(`${API_URL}/schedules/${scheduleId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch schedule");
    }

    return data;
  },

  /**
   * Update a schedule
   */
  async updateSchedule(scheduleId, updateData) {
    const response = await fetch(`${API_URL}/schedules/${scheduleId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw this._buildError(response, data, "Failed to update schedule");
    }

    return data;
  },

  /**
   * Delete a schedule
   */
  async deleteSchedule(scheduleId) {
    const response = await fetch(`${API_URL}/schedules/${scheduleId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete schedule");
    }

    return data;
  },

  /**
   * Get weekly schedule for a class
   */
  async getWeeklyScheduleForClass(classId, section, academicYear) {
    const queryParams = academicYear ? `?academicYear=${academicYear}` : "";
    const response = await fetch(
      `${API_URL}/schedules/class/${classId}/section/${section}${queryParams}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch weekly schedule");
    }

    return data;
  },

  /**
   * Get weekly schedule for a teacher
   */
  async getWeeklyScheduleForTeacher(teacherId, academicYear) {
    const queryParams = academicYear ? `?academicYear=${academicYear}` : "";
    const response = await fetch(
      `${API_URL}/schedules/teacher/${teacherId}${queryParams}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch weekly schedule");
    }

    return data;
  },

  /**
   * Get authenticated teacher's own schedule (uses JWT, no teacherId needed)
   */
  async getMySchedule(academicYear) {
    const queryParams = academicYear ? `?academicYear=${academicYear}` : "";
    const response = await fetch(
      `${API_URL}/schedules/my-schedule${queryParams}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch weekly schedule");
    }

    return data;
  },
};

export default scheduleService;
