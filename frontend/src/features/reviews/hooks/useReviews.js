import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPropertyReviews,
  createReview,
  deleteReview,
  replyToReview,
  editReply,
} from "../../../api/reviews.api.js";

export function useReviews(propertyId) {
  return useQuery({
    queryKey: ["reviews", propertyId],
    queryFn: () => getPropertyReviews(propertyId),
    enabled: !!propertyId,
  });
}

export function useCreateReview(propertyId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createReview(propertyId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews", propertyId] }),
  });
}

export function useDeleteReview(propertyId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews", propertyId] }),
  });
}

export function useReplyToReview(propertyId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, comment }) => replyToReview(reviewId, comment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews", propertyId] }),
  });
}