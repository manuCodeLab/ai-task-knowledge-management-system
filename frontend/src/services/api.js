import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://manu12901201-ai-task-knowledge-backend.hf.space";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.get("/", { timeout: 6000 }).catch(() => {
  // Best-effort warm-up for sleeping deployed backends.
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
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
