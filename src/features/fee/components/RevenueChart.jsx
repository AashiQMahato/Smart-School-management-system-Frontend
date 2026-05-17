/**
 * RevenueChart - Fee revenue charts using Recharts
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = {
  paid: "#10b981",
  pending: "#f59e0b",
  overdue: "#ef4444",
  partial: "#8b5cf6",
  primary: "#3b82f6",
};

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// Custom Tooltip for bar chart
const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3">
      <p className="font-bold text-slate-800 mb-2 text-sm">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span
            className="w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: entry.fill }}
          />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-bold text-slate-800">
            ₹{entry.value?.toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
};

// Custom Tooltip for pie chart
const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3">
      <p className="font-bold text-sm" style={{ color: item.payload.fill }}>
        {item.name}
      </p>
      <p className="text-xs text-slate-600 mt-1">
        Count: <strong>{item.value}</strong>
      </p>
    </div>
  );
};

// ─── Bar Chart: Fee Type Breakdown ───────────────────────────────
export function FeeTypeChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
        No data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item._id?.charAt(0).toUpperCase() + item._id?.slice(1) || "Other",
    Collected: item.totalCollected || 0,
    Pending: (item.totalAmount || 0) - (item.totalCollected || 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomBarTooltip />} />
        <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
        <Bar dataKey="Collected" fill={COLORS.paid} radius={[4, 4, 0, 0]} />
        <Bar dataKey="Pending" fill={COLORS.pending} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Pie Chart: Payment Status Distribution ───────────────────────
export function PaymentStatusPieChart({ stats }) {
  const overall = stats?.overall || {};

  const data = [
    { name: "Paid", value: overall.paidCount || 0, fill: PIE_COLORS[0] },
    { name: "Partial", value: overall.partialCount || 0, fill: PIE_COLORS[3] },
    { name: "Pending", value: overall.unpaidCount || 0, fill: PIE_COLORS[1] },
    { name: "Overdue", value: overall.overdueCount || 0, fill: PIE_COLORS[2] },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
          ))}
        </Pie>
        <Tooltip content={<CustomPieTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "4px" }}
          formatter={(value, entry) => (
            <span style={{ color: entry.color }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Horizontal bar chart: Class-wise collection ─────────────────
export function ClassCollectionChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
        No data available
      </div>
    );
  }

  const chartData = data.slice(0, 8).map((item) => ({
    name: item._id || "Unknown",
    Collected: item.totalCollected || 0,
    Pending: (item.totalAmount || 0) - (item.totalCollected || 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f1f5f9"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
          width={50}
        />
        <Tooltip content={<CustomBarTooltip />} />
        <Bar dataKey="Collected" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
        <Bar dataKey="Pending" fill={COLORS.pending} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
