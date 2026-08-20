import { api, apiCall } from "./client";

export const appointmentsApi = {
  getAll: () => apiCall(api.get("/appointments")), // auto-scoped by role on the backend
  getAvailability: (doctorId, date) => apiCall(api.get("/appointments/availability", { params: { doctorId, date } })),
  create: (payload) => apiCall(api.post("/appointments", payload)),
  updateStatus: (id, status) => apiCall(api.put(`/appointments/${id}/status`, { status })),
  reschedule: (id, payload) => apiCall(api.put(`/appointments/${id}/reschedule`, payload)),
};
