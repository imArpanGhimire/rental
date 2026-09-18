import { useQuery } from "@tanstack/react-query";

async function searchNepalLocations(query) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=np&q=${encodeURIComponent(query)}`,
    { headers: { Accept: "application/json" } },
  );

  if (!response.ok) {
    throw new Error("Location search failed");
  }

  return response.json();
}

export function useLocationSearch(query) {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: ["location-search", normalizedQuery],
    queryFn: () => searchNepalLocations(normalizedQuery),
    enabled: normalizedQuery.length >= 3,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
