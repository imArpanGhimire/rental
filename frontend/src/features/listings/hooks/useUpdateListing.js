import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { updateListing } from "../../../api/listings.api.js";

export function useUpdateListing(
    listingId,
) {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: (payload) =>
            updateListing(
                listingId,
                payload,
            ),

        onSuccess: async (
            result,
        ) => {
            const updated =
                result?.updatedProperty ||
                result?.property ||
                result;

            if (updated?._id) {
                queryClient.setQueryData(
                    [
                        "listing",
                        updated._id,
                    ],
                    updated,
                );
            }

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [
                        "myListings",
                    ],
                }),

                queryClient.invalidateQueries({
                    queryKey: [
                        "listings",
                    ],
                }),

                queryClient.invalidateQueries({
                    queryKey: [
                        "listing",
                        listingId,
                    ],
                }),
            ]);
        },
    });
}