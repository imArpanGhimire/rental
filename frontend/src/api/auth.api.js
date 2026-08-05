import client from "./client";

/**
 * @param {{ name: string, email: string, password: string, role: 'owner' | 'renter' }} payload
 */
export function registerUser(payload) {
  return client.post("/auth/register", payload).then((res) => res.data);
}

/**
 * @param {{ email: string, password: string }} payload
 */
export function loginUser(payload) {
  return client.post("/auth/login", payload).then((res) => res.data);
}

export function logoutUser() {
  return client.post("/auth/logout").then((res) => res.data);
}

/**
 * NOTE: The backend README does not currently list a "get current user" route.
 * This is needed to rehydrate auth state on page refresh (cookie is present but
 * we have no user object in memory). Point this at whatever Arpan adds — common
 * options: GET /api/auth/me or GET /api/auth/profile. Until it exists, AuthContext
 * will fall back to treating a failed call here as "logged out" rather than crashing.
 */
export function getProfile() {
  return client.get("/auth/me").then((res) => res.data);
}