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

export function getProfile() {
  return client.get("/auth/me").then((res) => res.data);
}

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
  formData.append("profilePicture", file);

  return client
    .put("/auth/update-profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
}

export function removeAvatar() {
  return client.delete("/auth/remove-profile-picture").then((res) => res.data);
}


export function getSecurityQuestionsList() {
  return client.get("/auth/security-questions-list").then((res) => res.data);
}

/**
 * @param {string} email
 */
export function getAccountSecurityQuestions(email) {
  return client.post("/auth/forgot-password/questions", { email }).then((res) => res.data);
}

/**
 * @param {{ email: string, answers: { question: string, answer: string }[] }} payload
 */
export function verifySecurityAnswers(payload) {
  return client.post("/auth/forgot-password/verify", payload).then((res) => res.data);
}

/**
 * @param {{ resetToken: string, newPassword: string }} payload
 */
export function resetPasswordWithToken(payload) {
  return client.post("/auth/forgot-password/reset", payload).then((res) => res.data);
}