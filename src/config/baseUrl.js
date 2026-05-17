// Centralized API base URL for the frontend
// Uses environment variable if available, otherwise defaults to localhost

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
export default BASE_URL;
