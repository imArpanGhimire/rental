import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createListing } from "../../../api/listings.api.js";

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createListing,

    onSuccess: async (result) => {
      /*
       * Backend responses can differ depending on the controller:
       * { property: {...} }
       * { listing: {...} }
       * or directly return the property.
       */
      const newListing =
        result?.property ||
        result?.listing ||
        result?.data ||
        (result?._id ? result : null);

      /*
       * Immediately add the newly-created listing to My Listings.
       * This fixes the problem where the listing was created successfully
       * but My Listings still showed the old cache.
       */
      if (newListing?._id) {
        queryClient.setQueryData(["myListings", {}], (oldData) => {
          if (!oldData) {
            return {
              myproperties: [newListing],
              listings: [newListing],
            };
          }

          const existing =
            oldData.myproperties ??
            oldData.listings ??
            [];

          const alreadyExists = existing.some(
            (listing) => listing._id === newListing._id
          );

          if (alreadyExists) {
            return oldData;
          }

          return {
            ...oldData,
            myproperties: [newListing, ...existing],
            listings: [newListing, ...existing],
          };
        });
      }

      /*
       * Refresh every My Listings query.
       * This also covers queries with filters in their query key.
       */
      await queryClient.invalidateQueries({
        queryKey: ["myListings"],
      });

      /*
       * Refresh the general listings cache too, because the new property
       * should also become visible in Browse.
       */
      await queryClient.invalidateQueries({
        queryKey: ["listings"],
      });
    },
  });
}