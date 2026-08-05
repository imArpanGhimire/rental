import { useQuery } from "@tanstack/react-query";
import { getListings } from "../../../api/listings.api.js";

export function useListings(filters = {}) {
  return useQuery({
    queryKey: ["listings", filters],
    queryFn: () => getListings(filters),
  });
}
