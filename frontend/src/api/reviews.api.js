import client from "./client";

/**
 * Renter only. @param {{ rating: number, comment: string }} payload
 */
export function createReview(propertyId, payload) {
  return client.post(`/reviews/create-review/${propertyId}`, payload).then((res) => res.data);
}

export function getPropertyReviews(propertyId) {
  return client.get(`/reviews/get-property-review/${propertyId}`).then((res) => res.data);
}

// Renter only, and only their own review (backend enforces ownership)
export function deleteReview(reviewId) {
  return client.delete(`/reviews/delete-review/${reviewId}`).then((res) => res.data);
}

// Owner only. comment is a plain string here — wrapped into the body shape the backend expects.
export function replyToReview(reviewId, comment) {
  return client.post(`/reviews/reply-review/${reviewId}`, { reply: comment }).then((res) => res.data);
}

// Owner only.
export function editReply(reviewId, comment) {
  return client.patch(`/reviews/edit-reply/${reviewId}`, { reply: comment }).then((res) => res.data);
}
