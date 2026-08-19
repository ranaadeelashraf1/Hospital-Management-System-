import { api, apiCall } from "./client";

export const authApi = {
  register: (payload) => apiCall(api.post("/auth/register", payload)),
  login: (payload) => apiCall(api.post("/auth/login", payload)),
  me: () => apiCall(api.get("/auth/me")),
};
