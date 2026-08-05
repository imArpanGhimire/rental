import { useQuery } from "@tanstack/react-query";
import { getMyListings } from "../../../api/listings.api.js";

export function useMyListings(filters = {}) {
  return useQuery({
    queryKey: ["myListings", filters],
    queryFn: () => getMyListings(filters),
  });
}
