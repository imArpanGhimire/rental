import client from "./client";

/*
 * Renter only.
 *
 * payload:
 * {
 *   rating: number,
 *   comment: string
 * }
 */
export function createReview(propertyId, payload) {
  return client
    .post(`/reviews/create-review/${propertyId}`, payload)
    .then((res) => res.data);
}

export function getPropertyReviews(propertyId) {
  return client
    .get(`/reviews/get-property-review/${propertyId}`)
    .then((res) => res.data);
}

/*
 * Renter can delete only their own review.
 */
export function deleteReview(reviewId) {
  return client
    .delete(`/reviews/delete-review/${reviewId}`)
    .then((res) => res.data);
}

/*
 * Owner only.
 *
 * IMPORTANT:
 * Backend expects:
 *
 * {
 *   comment: "..."
 * }
 */
export function replyToReview(reviewId, comment) {
  return client
    .post(`/reviews/reply-review/${reviewId}`, {
      comment,
    })
    .then((res) => res.data);
}

/*
 * Kept for compatibility with existing code.
 * Editing does NOT create another reply.
 */
export function editReply(reviewId, comment) {
  return client
    .patch(`/reviews/edit-reply/${reviewId}`, {
      comment,
    })
    .then((res) => res.data);
}