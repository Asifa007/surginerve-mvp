import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import PageWrapper from "@/components/PageWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_ROBOTS } from "@/mockData";

const Robots = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [robots, setRobots] = useState(MOCK_ROBOTS);
  const [form, setForm] = useState({ name: "", model: "", location: "" });

  const canAddRobot = role === "admin";

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newRobot = {
      id: String(robots.length + 1),
      ...form,
      status: "Normal" as const,
      temperature: 36.0,
      vibration: 0.1,
      current: 2.0,
    };
    setRobots([...robots, newRobot]);
    setForm({ name: "", model: "", location: "" });
    setShowModal(false);
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Robots</h2>
            <p className="text-sm text-muted-foreground">Manage surgical robots</p>
          </div>
          {canAddRobot && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add Robot
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Model</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {robots.map((robot) => (
                <tr
                  key={robot.id}
                  onClick={() => navigate(`/robots/${robot.id}`)}
                  className="cursor-pointer border-b last:border-0 transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium text-foreground">{robot.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{robot.model}</td>
                  <td className="px-4 py-3 text-muted-foreground">{robot.location}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={robot.status as "Normal" | "Warning" | "Failure"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20">
            <div className="w-full max-w-md animate-scale-in rounded-xl border bg-card p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Add New Robot</h3>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="SurgiBot Zeta" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Model</label>
                  <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="SB-400" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="OR-6" />
                </div>
                <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Add Robot
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Robots;
