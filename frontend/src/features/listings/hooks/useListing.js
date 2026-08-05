import { useQuery } from "@tanstack/react-query";
import { getListing } from "../../../api/listings.api.js";

export function useListing(id) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => getListing(id),
    enabled: !!id,
  });
}
