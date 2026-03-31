import { useSessionStore } from "@/store/auth-store";
import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL + "/api/v1",
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      const { clearSession } = useSessionStore.getState();

      clearSession();

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
