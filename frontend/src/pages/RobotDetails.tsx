import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Thermometer, Waves, Zap } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import PredictionChart from "@/components/PredictionChart";
import PageWrapper from "@/components/PageWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_ROBOTS, MOCK_PREDICTION } from "@/mockData";

const RobotDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  const robot = MOCK_ROBOTS.find((r) => r.id === id);

  const [prediction, setPrediction] = useState<typeof MOCK_PREDICTION | null>(null);
  const [loading, setLoading] = useState(false);

  const canRunPrediction = role === "admin" || role === "doctor";

  if (!robot) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Robot not found
      </div>
    );
  }

  const handlePredict = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setPrediction(MOCK_PREDICTION);
    setLoading(false);
  };

  const sensors = [
    { label: "Temperature", value: `${robot.temperature}°C`, icon: Thermometer, color: "text-destructive", bg: "bg-destructive/10" },
    { label: "Vibration", value: `${robot.vibration} m/s²`, icon: Waves, color: "text-warning", bg: "bg-warning/10" },
    { label: "Current", value: `${robot.current} A`, icon: Zap, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/robots")}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{robot.name}</h2>
            <p className="text-sm text-muted-foreground">
              {robot.model} · {robot.location}
            </p>
          </div>
          <StatusBadge status={robot.status as "Normal" | "Warning" | "Failure"} className="ml-auto" />
        </div>

        {/* Sensor Values */}
        <div className="grid gap-4 sm:grid-cols-3">
          {sensors.map((s) => (
            <div key={s.label} className="rounded-xl border bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Run Prediction */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">AI Prediction</h3>
            {canRunPrediction && (
              <button
                onClick={handlePredict}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Run Prediction
              </button>
            )}
          </div>

          {prediction && (
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Prediction</span>
                  <StatusBadge status={prediction.prediction as "Normal" | "Warning" | "Failure"} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Probability</span>
                  <span className="text-lg font-bold text-foreground">
                    {(prediction.probability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Feature Contribution</p>
                <PredictionChart explanation={prediction.explanation} />
              </div>
            </div>
          )}

          {!prediction && !loading && (
            <p className="mt-4 text-sm text-muted-foreground">
              {canRunPrediction
                ? 'Click "Run Prediction" to analyze current sensor data'
                : "You do not have permission to run predictions"}
            </p>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default RobotDetails;
