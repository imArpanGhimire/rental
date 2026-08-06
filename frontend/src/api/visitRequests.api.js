// frontend/src/api/visitRequests.api.js
import client from "./client";

export function createVisitRequest(payload) {
  return client.post("/visit-requests", payload).then((res) => res.data);
}

export function getMyVisitRequests() {
  return client.get("/visit-requests/mine").then((res) => res.data);
}

export function getOwnerVisitRequests() {
  return client.get("/visit-requests/owner").then((res) => res.data);
}

export function updateVisitRequestStatus(id, status) {
  return client.put(`/visit-requests/${id}/status`, { status }).then((res) => res.data);
}
