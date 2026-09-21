import axios from "axios";

// Use Vite's /api proxy.
// This works on both:
// - PC: http://localhost:5173
// - Mobile: http://192.168.1.8:5173
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const client = axios.create({
  baseURL: API_BASE_URL,

  // Backend authentication uses HTTP-only cookies
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// Handler that AuthContext or another module can register
// to respond to unauthorized requests.
let onUnauthorized = null;

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

// Handle API responses/errors
client.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      if (onUnauthorized) {
        onUnauthorized();
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

// Convert Axios errors into a consistent format
function normalizeError(error) {
  // Backend responded with an error
  if (error.response) {
    return {
      status: error.response.status,

      message:
        error.response.data?.message ||
        error.response.data?.error ||
        "Something went wrong",

      errors: error.response.data?.errors || null,

      raw: error.response.data,
    };
  }

  // Request was sent but server didn't respond
  if (error.request) {
    return {
      status: 0,
      message: "No response from server. Check your connection.",
      errors: null,
    };
  }

  // Something else went wrong
  return {
    status: -1,
    message: error.message,
    errors: null,
  };
}

export default client;