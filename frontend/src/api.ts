import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// =============================
// Attach JWT automatically
// =============================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("surginerve_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =============================
// Handle 401 globally
// =============================
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

// =============================
// AUTH
// =============================
export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

// =============================
// ROBOTS
// =============================
export const fetchRobots = async () => {
  const res = await api.get("/robots/");
  return res.data;
};

export const fetchRobotById = async (id: number) => {
  const res = await api.get(`/robots/${id}`);
  return res.data;
};

export const addRobot = async (data: {
  robot_name: string;
  model_number: string;
  installation_date: string;
  status: string;
}) => {
  const res = await api.post("/robots/", data);
  return res.data;
};

// =============================
// SENSOR READINGS
// =============================
export const fetchSensorReadings = async (robotId?: number) => {
  const res = await api.get("/sensor-readings/", {
    params: robotId ? { robot_id: robotId } : {},
  });
  return res.data;
};

// =============================
// MANUAL PREDICTION (if needed)
// =============================
export const runPrediction = async (
  robotId: number,
  temperature: number,
  vibration: number,
  current: number
) => {
  const res = await api.post("/predict", {
    robot_id: robotId,
    temperature,
    vibration,
    current,
  });
  return res.data;
};

// =============================
// PREDICTION HISTORY
// =============================
export const fetchHistory = async (robotId?: number) => {
  const res = await api.get("/predictions/", {
    params: robotId ? { robot_id: robotId } : {},
  });
  return res.data;
};

export default api;