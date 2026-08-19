import { api, apiCall } from "./client";

export const billingApi = {
  getAll: () => apiCall(api.get("/billing")), // auto-scoped by role
  create: (payload) => apiCall(api.post("/billing", payload)),
  update: (id, payload) => apiCall(api.put(`/billing/${id}`, payload)),
};
