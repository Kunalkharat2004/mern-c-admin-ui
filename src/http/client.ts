import axios from "axios";
import { useAuthStore } from "../store";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

const refreshToken = async () => {
  await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_AUTH_SERVICE_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const headers = { ...originalRequest.headers };
    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true;
        await refreshToken();
        return api.request({ ...originalRequest, headers });
      } catch (err) {
        console.error("Error in interceptor", err);
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;