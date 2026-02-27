import { Bot, Activity, AlertTriangle, TrendingUp } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import PredictionChart from "@/components/PredictionChart";
import PageWrapper from "@/components/PageWrapper";
import { MOCK_ROBOTS, MOCK_PREDICTION } from "@/mockData";

const stats = [
  { label: "Total Robots", value: MOCK_ROBOTS.length, icon: Bot, color: "text-primary", bg: "bg-primary/10" },
  { label: "Operational", value: MOCK_ROBOTS.filter((r) => r.status === "Normal").length, icon: Activity, color: "text-success", bg: "bg-success/10" },
  { label: "Warnings", value: MOCK_ROBOTS.filter((r) => r.status === "Warning").length, icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  { label: "Failures", value: MOCK_ROBOTS.filter((r) => r.status === "Failure").length, icon: TrendingUp, color: "text-destructive", bg: "bg-destructive/10" },
];

const Dashboard = () => {
  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground">System overview and latest predictions</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Latest Prediction</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge status={MOCK_PREDICTION.prediction as "Normal" | "Warning" | "Failure"} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Probability</span>
                <span className="text-sm font-semibold text-foreground">
                  {(MOCK_PREDICTION.probability * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Robot</span>
                <span className="text-sm text-foreground">SurgiBot Delta</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Feature Contribution</h3>
            <PredictionChart explanation={MOCK_PREDICTION.explanation} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
