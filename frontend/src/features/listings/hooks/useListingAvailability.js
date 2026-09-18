import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateListingAvailability } from "../../../api/listings.api.js";

export function useListingAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, isAvailable }) =>
      updateListingAvailability(listingId, isAvailable),

    onSuccess: async (_, { listingId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["myListings"] }),
        queryClient.invalidateQueries({ queryKey: ["listings"] }),
        queryClient.invalidateQueries({ queryKey: ["listing", listingId] }),
      ]);
    },
  });
}
