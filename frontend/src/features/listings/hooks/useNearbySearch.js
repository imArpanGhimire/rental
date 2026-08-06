import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNearbyProperties } from "../../../api/listings.api.js";

const DEFAULT_CENTER = { lng: 85.324, lat: 27.7172 }; // Kathmandu fallback
const DEFAULT_RADIUS_KM = 3;

export function useNearbySearch(extraFilters = {}) {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);

  const commitSearch = useCallback((nextCenter, nextRadiusKm) => {
    setCenter(nextCenter);
    setRadiusKm(nextRadiusKm);
  }, []);

  const query = useQuery({
    queryKey: ["nearby", center, radiusKm, extraFilters],
    queryFn: () =>
      getNearbyProperties({
        lng: center.lng,
        lat: center.lat,
        radius: radiusKm,
        ...extraFilters,
      }),
  });

  return { ...query, center, radiusKm, commitSearch };
}
