import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface PredictionChartProps {
  explanation: Record<string, number>;
}

const COLORS = [
  "hsl(224, 65%, 33%)",
  "hsl(210, 100%, 50%)",
  "hsl(190, 80%, 45%)",
  "hsl(160, 60%, 45%)",
  "hsl(38, 92%, 50%)",
];

const PredictionChart = ({ explanation }: PredictionChartProps) => {
  const data = Object.entries(explanation).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: +(value * 100).toFixed(1),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }}
          axisLine={{ stroke: "hsl(214, 20%, 88%)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }}
          axisLine={{ stroke: "hsl(214, 20%, 88%)" }}
          tickLine={false}
          unit="%"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(0, 0%, 100%)",
            border: "1px solid hsl(214, 20%, 88%)",
            borderRadius: "8px",
            fontSize: "13px",
          }}
          formatter={(value: number) => [`${value}%`, "Contribution"]}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PredictionChart;
