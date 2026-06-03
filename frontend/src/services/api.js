import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function saveSession(loginResponse) {
  localStorage.setItem("token", loginResponse.access_token);
  localStorage.setItem("user", JSON.stringify(loginResponse.user));
}

export function getSessionUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
