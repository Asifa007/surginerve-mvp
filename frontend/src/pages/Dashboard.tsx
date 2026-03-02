import { useEffect, useState } from "react";
import { fetchHistory } from "@/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

interface Prediction {
  id: number;
  failure_probability: number;
  risk_level: string;
  explanation: {
    temperature: number;
    vibration: number;
    current: number;
  };
  timestamp: string;
}

export default function Dashboard() {
  const [history, setHistory] = useState<Prediction[]>([]);

  const loadData = async () => {
    try {
      const data = await fetchHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch predictions", error);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const latest = history.length > 0 ? history[0] : null;

  const riskColor =
    latest?.risk_level === "High"
      ? "bg-red-500"
      : latest?.risk_level === "Medium"
      ? "bg-yellow-500"
      : "bg-green-500";

  const chartData = latest
    ? [
        { name: "Temperature", value: latest.explanation.temperature },
        { name: "Vibration", value: latest.explanation.vibration },
        { name: "Current", value: latest.explanation.current },
      ]
    : [];

  const trendData = history
    .slice(0, 10)
    .reverse()
    .map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString(),
      probability: (item.failure_probability * 100).toFixed(2),
    }));

  const highCount = history.filter((p) => p.risk_level === "High").length;
  const mediumCount = history.filter((p) => p.risk_level === "Medium").length;
  const lowCount = history.filter((p) => p.risk_level === "Low").length;

  const getBarColor = (value: number) => {
    if (value > 0.2) return "#ef4444";
    if (value > 0.05) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Live Prediction Dashboard</h1>

      {latest ? (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-xl p-4">
              <p className="text-sm text-gray-500">High Risk</p>
              <p className="text-xl font-bold text-red-500">{highCount}</p>
            </div>
            <div className="bg-white shadow rounded-xl p-4">
              <p className="text-sm text-gray-500">Medium Risk</p>
              <p className="text-xl font-bold text-yellow-500">{mediumCount}</p>
            </div>
            <div className="bg-white shadow rounded-xl p-4">
              <p className="text-sm text-gray-500">Low Risk</p>
              <p className="text-xl font-bold text-green-500">{lowCount}</p>
            </div>
          </div>

          {/* Latest Prediction Card */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3">
              Latest Prediction
            </h2>

            <p className="text-lg">
              <strong>Failure Probability:</strong>{" "}
              {(latest.failure_probability * 100).toFixed(2)}%
            </p>

            <p className="mt-2">
              <strong>Risk Level:</strong>{" "}
              <span className={`text-white px-3 py-1 rounded ${riskColor}`}>
                {latest.risk_level}
              </span>
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {new Date(latest.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Feature Contribution */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              Feature Contribution
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={getBarColor(entry.value)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trend Chart */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              Failure Probability Trend
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="probability"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p>Loading predictions...</p>
      )}
    </div>
  );
}