import { api, apiCall } from "./client";

export const departmentsApi = {
  getAll: () => apiCall(api.get("/departments")),
  create: (payload) => apiCall(api.post("/departments", payload)),
  update: (id, payload) => apiCall(api.put(`/departments/${id}`, payload)),
  remove: (id) => apiCall(api.delete(`/departments/${id}`)),
};
