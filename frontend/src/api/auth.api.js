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

/* =========================================================
   PROFILE SETTINGS — NEW, BACKEND ROUTES DO NOT EXIST YET

   The four functions below are called by the new Profile
   Settings page (name edit, password change, avatar upload/
   remove). They assume REST-conventional routes that are NOT
   in the backend yet:

     PATCH  /auth/me           { name }
     PATCH  /auth/me/password  { currentPassword, newPassword }
     POST   /auth/me/avatar    multipart/form-data, field "avatar"
     DELETE /auth/me/avatar

   Until these exist on the backend, calling them will fail
   with a 404, and the settings page will show the normal
   error banner (via client.js's existing error normalizer).
   Adjust the paths here to match whatever routes get added.
========================================================= */

/**
 * @param {{ name: string }} payload
 */
export function updateProfile(payload) {
  return client.patch("/auth/me", payload).then((res) => res.data);
}

/**
 * @param {{ currentPassword: string, newPassword: string }} payload
 */
export function updatePassword(payload) {
  return client.patch("/auth/me/password", payload).then((res) => res.data);
}

/**
 * @param {File} file
 */
export function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);

  return client
    .post("/auth/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
}

export function removeAvatar() {
  return client.delete("/auth/me/avatar").then((res) => res.data);
}