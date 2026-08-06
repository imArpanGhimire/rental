import client from "./client";

// Renter only
export function addFavorite(propertyId) {
  return client.post(`/favorites/add-forlater/${propertyId}`).then((res) => res.data);
}

// Renter only
export function removeFavorite(propertyId) {
  return client.post(`/favorites/remove-forlater/${propertyId}`).then((res) => res.data);
}

// Renter only — returns the logged-in renter's saved properties
export function getFavorites() {
  return client.get("/favorites/get-forlater").then((res) => res.data);
}
