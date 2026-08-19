import { api, apiCall } from "./client";

export const doctorsApi = {
  getAll: (params) => apiCall(api.get("/doctors", { params })),
  getById: (id) => apiCall(api.get(`/doctors/${id}`)),
  getMyProfile: () => apiCall(api.get("/doctors/me")),
  update: (id, payload) => apiCall(api.put(`/doctors/${id}`, payload)),
  remove: (id) => apiCall(api.delete(`/doctors/${id}`)),
};
