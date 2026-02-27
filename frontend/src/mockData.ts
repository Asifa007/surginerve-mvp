// Mock data for development without backend
export const MOCK_TOKEN = "mock-jwt-token-surginerve-2024";

export const MOCK_ROBOTS = [
  { id: "1", name: "SurgiBot Alpha", model: "SB-100", location: "OR-1", status: "Normal", temperature: 36.2, vibration: 0.12, current: 2.5 },
  { id: "2", name: "SurgiBot Beta", model: "SB-200", location: "OR-2", status: "Warning", temperature: 42.8, vibration: 0.35, current: 3.8 },
  { id: "3", name: "SurgiBot Gamma", model: "SB-100", location: "OR-3", status: "Normal", temperature: 35.5, vibration: 0.08, current: 2.1 },
  { id: "4", name: "SurgiBot Delta", model: "SB-300", location: "OR-4", status: "Failure", temperature: 55.1, vibration: 0.72, current: 5.2 },
  { id: "5", name: "SurgiBot Epsilon", model: "SB-200", location: "OR-5", status: "Normal", temperature: 37.0, vibration: 0.10, current: 2.3 },
];

export const MOCK_PREDICTION = {
  prediction: "Failure" as const,
  probability: 0.85,
  explanation: {
    temperature: 0.45,
    vibration: 0.30,
    current: 0.10,
  },
};

export const MOCK_HISTORY = [
  { id: "1", robotName: "SurgiBot Alpha", timestamp: "2024-12-20 14:32:00", prediction: "Normal", probability: 0.92 },
  { id: "2", robotName: "SurgiBot Beta", timestamp: "2024-12-20 13:15:00", prediction: "Warning", probability: 0.67 },
  { id: "3", robotName: "SurgiBot Delta", timestamp: "2024-12-20 12:45:00", prediction: "Failure", probability: 0.85 },
  { id: "4", robotName: "SurgiBot Alpha", timestamp: "2024-12-19 16:20:00", prediction: "Normal", probability: 0.95 },
  { id: "5", robotName: "SurgiBot Gamma", timestamp: "2024-12-19 11:00:00", prediction: "Normal", probability: 0.89 },
  { id: "6", robotName: "SurgiBot Beta", timestamp: "2024-12-18 09:30:00", prediction: "Warning", probability: 0.71 },
  { id: "7", robotName: "SurgiBot Delta", timestamp: "2024-12-18 08:00:00", prediction: "Failure", probability: 0.91 },
  { id: "8", robotName: "SurgiBot Epsilon", timestamp: "2024-12-17 15:45:00", prediction: "Normal", probability: 0.88 },
];
