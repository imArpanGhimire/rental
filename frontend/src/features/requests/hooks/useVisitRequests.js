import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyVisitRequests,
  getOwnerVisitRequests,
  updateVisitRequestStatus,
} from "../../../api/visitRequests.api.js";

export function useMyVisitRequests(options = {}) {
  const query = useQuery({
    queryKey: ["visitRequests", "mine"],
    queryFn: getMyVisitRequests,
    enabled: options.enabled ?? true,
  });

  const requests = query.data?.requests ?? [];

  return { ...query, requests };
}

export function useOwnerVisitRequests(options = {}) {
  const query = useQuery({
    queryKey: ["visitRequests", "owner"],
    queryFn: getOwnerVisitRequests,
    enabled: options.enabled ?? true,
  });

  const requests = query.data?.requests ?? [];

  return { ...query, requests };
}

export function useUpdateVisitRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateVisitRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitRequests", "owner"] });
    },
  });
}
