// frontend/src/features/listings/hooks/usePolygonSearch.js
import { useQuery } from "@tanstack/react-query";
import { polygonSearch } from "../../../api/listings.api.js";

export function usePolygonSearch(shape, filters = {}) {
  return useQuery({
    queryKey: ["listings", "polygon", shape, filters],
    queryFn: () => polygonSearch(shape, filters),
    enabled: Array.isArray(shape) && shape.length >= 3,
  });
}
