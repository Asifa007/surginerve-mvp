import { useState } from "react";
import { Search } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import PageWrapper from "@/components/PageWrapper";
import { MOCK_HISTORY } from "@/mockData";

const History = () => {
  const [filter, setFilter] = useState("");

  const filtered = MOCK_HISTORY.filter(
    (h) =>
      h.robotName.toLowerCase().includes(filter.toLowerCase()) ||
      h.prediction.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Prediction History</h2>
          <p className="text-sm text-muted-foreground">Past predictions and results</p>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by robot or status..."
            className="w-full rounded-lg border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Robot</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Timestamp</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Prediction</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Probability</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{entry.robotName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{entry.timestamp}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={entry.prediction as "Normal" | "Warning" | "Failure"} />
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {(entry.probability * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
};

export default History;
