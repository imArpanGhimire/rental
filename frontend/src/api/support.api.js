import client from "./client";

export function sendSupportReport(payload) {
    return client
        .post("/support/report", payload)
        .then((res) => res.data);
}