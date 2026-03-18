"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface BarChartProps {
  type: "bar";
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  yLabel?: string;
  colorKey?: string;
}

interface LineChartProps {
  type: "line";
  data: Array<Record<string, string | number>>;
  xKey: string;
  lines: Array<{ key: string; color: string; label: string }>;
  yLabel?: string;
}

type ChartProps = BarChartProps | LineChartProps;

const DEFAULT_COLORS = [
  "#c1121f",
  "#1864ab",
  "#2d6a4f",
  "#e67700",
  "#7048e8",
  "#d6336c",
];

export default function Chart(props: ChartProps) {
  if (props.type === "line") {
    return <LineChartComponent {...props} />;
  }
  return <BarChartComponent {...props} />;
}

function BarChartComponent({
  data,
  xKey,
  yKey,
  yLabel,
  colorKey,
}: BarChartProps) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="my-6 rounded-md border border-border bg-surface p-6 text-center text-sm text-text-muted">
        Ingen data tilgjengelig for graf.
      </div>
    );
  }
  return (
    <div className="my-6 rounded-md border border-border bg-white p-5">
      {yLabel && (
        <div className="mb-4 text-[12px] font-medium text-text-muted">
          {yLabel}
        </div>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
          <XAxis
            dataKey={xKey}
            tick={{ fill: "#495057", fontSize: 12 }}
            axisLine={{ stroke: "#dee2e6" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#868e96", fontSize: 12 }}
            axisLine={{ stroke: "#dee2e6" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #e9ecef",
              borderRadius: "6px",
              color: "#1a1a2e",
              fontSize: "13px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />
          <Bar dataKey={yKey} radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  colorKey
                    ? String(entry[colorKey])
                    : DEFAULT_COLORS[i % DEFAULT_COLORS.length]
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function LineChartComponent({
  data,
  xKey,
  lines,
  yLabel,
}: LineChartProps) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="my-6 rounded-md border border-border bg-surface p-6 text-center text-sm text-text-muted">
        Ingen data tilgjengelig for graf.
      </div>
    );
  }
  return (
    <div className="my-6 rounded-md border border-border bg-white p-5">
      {yLabel && (
        <div className="mb-4 text-[12px] font-medium text-text-muted">
          {yLabel}
        </div>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
          <XAxis
            dataKey={xKey}
            tick={{ fill: "#495057", fontSize: 12 }}
            axisLine={{ stroke: "#dee2e6" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#868e96", fontSize: 12 }}
            axisLine={{ stroke: "#dee2e6" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #e9ecef",
              borderRadius: "6px",
              color: "#1a1a2e",
              fontSize: "13px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", color: "#495057" }} />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.label}
              stroke={line.color}
              strokeWidth={2}
              dot={{ fill: line.color, r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
