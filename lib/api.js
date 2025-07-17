// lib/api.js
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL; // e.g. "http://localhost:8000/api"

const api = axios.create({
  baseURL: '',
  withCredentials: true, // send HttpOnly cookies
});

let isRefreshing = false;
let failedQueue = [];

// Process the queue once refresh finishes
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already trying refresh:
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Queue this request until the token is refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Call our Next.js /api/refresh route
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch("/api/refresh", {
            method: "POST",
            credentials: "include",
          });
          if (!res.ok) throw new Error("Refresh failed");

          const { access } = await res.json();
          processQueue(null, access);

          // Retry the original request with new token in header if needed
          originalRequest.headers["Authorization"] = `Bearer ${access}`;
          resolve(api(originalRequest));
        } catch (err) {
          processQueue(err, null);
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  }
);

export default api;
