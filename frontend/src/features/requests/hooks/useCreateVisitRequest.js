import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createVisitRequest } from "../../../api/visitRequests.api.js";

export function useCreateVisitRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVisitRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["visitRequests", "mine"] }),
        queryClient.invalidateQueries({ queryKey: ["visitRequests", "owner"] }),
      ]);
    },
  });
}
