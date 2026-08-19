import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach the JWT (if we have one) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("medicare_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is invalid/expired, clear it and send the user back to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("medicare_token");
      localStorage.removeItem("medicare_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Small helper: unwraps { success, data } and surfaces a readable error message
export async function apiCall(promise) {
  try {
    const res = await promise;
    return res.data.data;
  } catch (err) {
    const message = err.response?.data?.message || "Something went wrong. Please try again.";
    throw new Error(message);
  }
}
