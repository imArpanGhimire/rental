import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavorites, addFavorite, removeFavorite } from "../../../api/favorites.api.js";

export function useFavorites(options = {}) {
  const query = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: options.enabled ?? true,
  });

  const listings = (query.data?.forlater ?? [])
    .filter((f) => f.property)
    .map((f) => f.property);

  const favoriteIds = listings.map((l) => l._id);

  return { ...query, listings, favoriteIds };
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const remove = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  function toggle(propertyId, isFavorited) {
    if (isFavorited) {
      remove.mutate(propertyId);
    } else {
      add.mutate(propertyId);
    }
  }

  return { add, remove, toggle };
}
