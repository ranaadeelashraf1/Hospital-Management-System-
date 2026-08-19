import { api, apiCall } from "./client";

export const patientsApi = {
  getAll: (params) => apiCall(api.get("/patients", { params })),
  getById: (id) => apiCall(api.get(`/patients/${id}`)),
  create: (payload) => apiCall(api.post("/patients", payload)),
  update: (id, payload) => apiCall(api.put(`/patients/${id}`, payload)),
  remove: (id) => apiCall(api.delete(`/patients/${id}`)),
  getMyProfile: () => apiCall(api.get("/patients/me")), // logged-in patient
  getMyTreated: () => apiCall(api.get("/patients/mine")), // logged-in doctor's patients
};
