import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavorites, addFavorite, removeFavorite } from "../../../api/favorites.api.js";

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });
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

  return { add, remove };
}
