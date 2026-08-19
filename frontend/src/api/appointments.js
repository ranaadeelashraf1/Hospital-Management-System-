import { api, apiCall } from "./client";

export const appointmentsApi = {
  getAll: () => apiCall(api.get("/appointments")), // auto-scoped by role on the backend
  create: (payload) => apiCall(api.post("/appointments", payload)),
  updateStatus: (id, status) => apiCall(api.put(`/appointments/${id}/status`, { status })),
  reschedule: (id, payload) => apiCall(api.put(`/appointments/${id}/reschedule`, payload)),
};
