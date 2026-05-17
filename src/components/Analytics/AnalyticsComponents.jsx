/**
 * Reusable AI Analytics Components
 * Shared across Admin / Teacher / Student / Parent analytics pages
 */

import { useState } from "react";
import { Spin, Button, Tag, Empty, Tooltip, Progress } from "antd";
import {
  ReloadOutlined,
  BulbOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  RiseOutlined,
  FallOutlined,
  RobotOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ───────────────────────────────────────────────────────
// Loading State
// ───────────────────────────────────────────────────────
export function AnalyticsLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center animate-pulse">
          <RobotOutlined className="text-3xl text-blue-500" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
          <Spin size="small" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-slate-800">
          AI is analyzing your data…
        </p>
        <p className="text-sm text-slate-500 mt-1">
          This may take a few seconds
        </p>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Error State
// ───────────────────────────────────────────────────────
export function AnalyticsError({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <ExclamationCircleOutlined className="text-2xl text-red-500" />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-slate-800">Analysis Failed</p>
        <p className="text-sm text-slate-500 mt-1 max-w-md">
          {message || "Something went wrong while generating insights."}
        </p>
      </div>
      {onRetry && (
        <Button
          icon={<ReloadOutlined />}
          onClick={onRetry}
          type="primary"
          className="bg-blue-600">
          Retry Analysis
        </Button>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Page Header with Refresh button
// ───────────────────────────────────────────────────────
export function AnalyticsHeader({ title, subtitle, loading, onRefresh }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ThunderboltOutlined className="text-blue-500" />
          {title}
        </h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <Button
        icon={<ReloadOutlined spin={loading} />}
        onClick={onRefresh}
        loading={loading}
        type="default"
        size="large"
        className="shrink-0">
        Refresh Insights
      </Button>
    </div>
  );
}

// ───────────────────────────────────────────────────────
// AI Summary Panel (big card with summary text)
// ───────────────────────────────────────────────────────
export function AISummaryPanel({ summary, className = "" }) {
  if (!summary) return null;
  return (
    <div
      className={`rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <BulbOutlined className="text-lg text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-2">
            AI Summary
          </h3>
          <p className="text-slate-700 leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Alert Cards
// ───────────────────────────────────────────────────────
const ALERT_STYLES = {
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <WarningOutlined className="text-amber-600" />,
    badge: "warning",
  },
  danger: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: <ExclamationCircleOutlined className="text-red-600" />,
    badge: "error",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: <CheckCircleOutlined className="text-blue-600" />,
    badge: "processing",
  },
};

export function AlertCards({ alerts = [] }) {
  if (!alerts.length) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {alerts.map((alert, i) => {
        const style = ALERT_STYLES[alert.type] || ALERT_STYLES.info;
        return (
          <div
            key={i}
            className={`rounded-xl ${style.bg} border ${style.border} p-4`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{style.icon}</div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  {alert.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1">{alert.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Recommendations List
// ───────────────────────────────────────────────────────
export function RecommendationsList({
  items = [],
  title = "AI Recommendations",
}) {
  if (!items.length) return null;
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
      <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
        <BulbOutlined className="text-amber-500" />
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-xs font-bold">
              {i + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Stat Card (mini KPI)
// ───────────────────────────────────────────────────────
export function StatCard({ label, value, suffix, trend, color = "blue" }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
    indigo: "from-indigo-500 to-indigo-600",
  };
  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
        {label}
      </p>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {suffix && (
          <span className="text-sm text-slate-500 mb-0.5">{suffix}</span>
        )}
      </div>
      {trend && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          {trend === "up" || trend === "improving" ? (
            <RiseOutlined className="text-emerald-500" />
          ) : trend === "down" || trend === "declining" ? (
            <FallOutlined className="text-red-500" />
          ) : null}
          <span
            className={
              trend === "up" || trend === "improving"
                ? "text-emerald-600"
                : trend === "down" || trend === "declining"
                  ? "text-red-600"
                  : "text-slate-500"
            }>
            {trend.charAt(0).toUpperCase() + trend.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Bar Chart Card
// ───────────────────────────────────────────────────────
const CHART_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#6366f1",
];

export function BarChartCard({
  title,
  data = [],
  dataKey = "value",
  nameKey = "label",
  color = "#3b82f6",
  height = 300,
}) {
  if (!data.length) return null;
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
      <h3 className="text-base font-bold text-slate-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey={nameKey}
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <RTooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />
          <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Radar Chart Card
// ───────────────────────────────────────────────────────
export function RadarChartCard({
  title,
  data = [],
  dataKey = "value",
  nameKey = "subject",
  height = 320,
}) {
  if (!data.length) return null;
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
      <h3 className="text-base font-bold text-slate-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey={nameKey}
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
          />
          <Radar
            name="Score"
            dataKey={dataKey}
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Risk Table (for teacher weak students, dropout risks)
// ───────────────────────────────────────────────────────
const RISK_COLORS = { low: "green", medium: "orange", high: "red" };

export function RiskTable({ title, data = [], columns }) {
  if (!data.length) return null;
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
      <h3 className="text-base font-bold text-slate-800 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className="border-b border-slate-100 hover:bg-slate-50">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Improvement Score Indicator
// ───────────────────────────────────────────────────────
export function ImprovementScore({ current, potential, gap }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
      <h3 className="text-base font-bold text-slate-800 mb-4">
        Improvement Potential
      </h3>
      <div className="flex items-center gap-8">
        <div className="text-center">
          <Progress
            type="circle"
            percent={Math.round(current || 0)}
            size={100}
            strokeColor="#6366f1"
            format={(p) => (
              <span className="text-lg font-bold text-slate-800">{p}%</span>
            )}
          />
          <p className="text-xs text-slate-500 mt-2">Current</p>
        </div>
        <div className="text-center">
          <Progress
            type="circle"
            percent={Math.round(potential || 0)}
            size={100}
            strokeColor="#10b981"
            format={(p) => (
              <span className="text-lg font-bold text-slate-800">{p}%</span>
            )}
          />
          <p className="text-xs text-slate-500 mt-2">Potential</p>
        </div>
        {gap !== undefined && (
          <div className="text-center">
            <div className="w-25 h-25 rounded-full bg-amber-50 border-4 border-amber-200 flex items-center justify-center">
              <span className="text-lg font-bold text-amber-700">
                +{Math.round(gap)}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Gap</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Risk Tag helper used across pages
export function RiskTag({ level }) {
  const color = RISK_COLORS[level] || "default";
  return <Tag color={color}>{level?.toUpperCase()}</Tag>;
}
