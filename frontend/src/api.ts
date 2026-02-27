import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("surginerve_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("surginerve_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// --- Auth ---
export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

// --- Robots ---
export const fetchRobots = async () => {
  const res = await api.get("/robots");
  return res.data;
};

export const fetchRobotById = async (id: string) => {
  const res = await api.get(`/robots/${id}`);
  return res.data;
};

export const addRobot = async (data: { name: string; model: string; location: string }) => {
  const res = await api.post("/robots", data);
  return res.data;
};

// --- Predictions ---
export const runPrediction = async (robotId: string) => {
  const res = await api.post(`/robots/${robotId}/predict`);
  return res.data;
};

export const fetchHistory = async () => {
  const res = await api.get("/predictions/history");
  return res.data;
};

export default api;
