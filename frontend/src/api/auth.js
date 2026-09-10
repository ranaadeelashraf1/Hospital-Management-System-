import { api, apiCall } from "./client";

export const authApi = {
  register: (payload) => apiCall(api.post("/auth/register", payload)),
  createManagedUser: (payload) => apiCall(api.post("/auth/admin/users", payload)),
  login: (payload) => apiCall(api.post("/auth/login", payload)),
  verifyEmail: (token) => apiCall(api.get("/auth/verify-email", { params: { token } })),
  resendVerification: (payload) => apiCall(api.post("/auth/resend-verification", payload)),
  updateMe: (payload) => apiCall(api.put("/auth/me", payload)),
  forgotPassword: (payload) => apiCall(api.post("/auth/forgot-password", payload)),
  resetPassword: (payload) => apiCall(api.post("/auth/reset-password", payload)),
  me: () => apiCall(api.get("/auth/me")),
};
