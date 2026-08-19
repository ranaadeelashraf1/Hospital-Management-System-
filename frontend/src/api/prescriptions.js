import { api, apiCall } from "./client";

export const prescriptionsApi = {
  getAll: () => apiCall(api.get("/prescriptions")), // auto-scoped by role
  create: (payload) => apiCall(api.post("/prescriptions", payload)),
};
