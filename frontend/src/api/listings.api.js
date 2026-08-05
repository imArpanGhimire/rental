// frontend/src/api/listings.api.js
import client from "./client";

export function getListings(params = {}) {
  return client.get("/properties/get-all-properties", { params }).then((res) => res.data);
}

export function getNearbyProperties(params) {
  return client.get("/properties/nearby", { params }).then((res) => res.data);
}

export function polygonSearch(polygon, filters = {}) {
  return client.post("/properties/polygon-search", { polygon, ...filters }).then((res) => res.data);
}

export function getListing(id) {
  return client.get(`/properties/get-property/${id}`).then((res) => res.data);
}

export function createListing(payload) {
  return client.post("/properties/add-property", payload).then((res) => res.data);
}

export function updateListing(id, payload) {
  return client.put(`/properties/update-property/${id}`, payload).then((res) => res.data);
}

export function deleteListing(id) {
  return client.delete(`/properties/delete-property/${id}`).then((res) => res.data);
}

export function getMyListings(params = {}) {
  return client.get("/properties/view-my-listings", { params }).then((res) => res.data);
}

export function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  return client
    .post("/properties/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
}
