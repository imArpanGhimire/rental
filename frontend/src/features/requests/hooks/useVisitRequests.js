import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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

    /*
     * Check for new request-status changes every 30 seconds.
     */
    refetchInterval: options.refetchInterval ?? 30000,

    /*
     * Also refresh when the user comes back to the browser tab.
     */
    refetchOnWindowFocus: true,

    staleTime: 10000,
  });

  const requests = query.data?.requests ?? [];

  return {
    ...query,
    requests,
  };
}

export function useOwnerVisitRequests(options = {}) {
  const query = useQuery({
    queryKey: ["visitRequests", "owner"],
    queryFn: getOwnerVisitRequests,

    enabled: options.enabled ?? true,

    /*
     * Check for new visit requests every 30 seconds.
     */
    refetchInterval: options.refetchInterval ?? 30000,

    refetchOnWindowFocus: true,

    staleTime: 10000,
  });

  const requests = query.data?.requests ?? [];

  return {
    ...query,
    requests,
  };
}

export function useUpdateVisitRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) =>
      updateVisitRequestStatus(id, status),

    onSuccess: () => {
      /*
       * Owner's request list needs updating.
       */
      queryClient.invalidateQueries({
        queryKey: ["visitRequests", "owner"],
      });

      /*
       * The renter also needs to see the new accepted/declined status.
       */
      queryClient.invalidateQueries({
        queryKey: ["visitRequests", "mine"],
      });
    },
  });
}