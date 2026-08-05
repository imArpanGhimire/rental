import axios from "axios";

// Base URL for the backend API. Override with VITE_API_BASE_URL in a .env file
// e.g. VITE_API_BASE_URL=http://localhost:3000/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // required: backend auth uses an HTTP-only cookie, not a bearer token
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: a hook other modules (like AuthContext) can register to react to a 401
// e.g. force logout + redirect to /login without client.js needing to know about routing.
let onUnauthorized = null;
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (onUnauthorized) onUnauthorized();
    }
    return Promise.reject(normalizeError(error));
  }
);

// Flattens axios error shapes into something components can read consistently:
// err.message, err.status, err.errors (if backend sends field-level validation errors)
function normalizeError(error) {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || error.response.data?.error || "Something went wrong",
      errors: error.response.data?.errors || null,
      raw: error.response.data,
    };
  }
  if (error.request) {
    return { status: 0, message: "No response from server. Check your connection.", errors: null };
  }
  return { status: -1, message: error.message, errors: null };
}

export default client;