/**
 * Parent AI Analytics Page
 * Shows insights about children: performance comparison,
 * attendance trends, risk notifications, and recommendations.
 */

import { useState, useEffect, useCallback } from "react";
import { Tag } from "antd";
import { getParentAnalytics } from "../../../services/analytics.service";
import {
  AnalyticsLoading,
  AnalyticsError,
  AnalyticsHeader,
  AISummaryPanel,
  AlertCards,
  RecommendationsList,
  StatCard,
  BarChartCard,
  RiskTable,
  RiskTag,
} from "../../../components/Analytics/AnalyticsComponents";

export default function ParentAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getParentAnalytics();
      setData(res.data?.insights ?? res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  if (loading) return <AnalyticsLoading />;
  if (error) return <AnalyticsError message={error} onRetry={fetchInsights} />;
  if (!data)
    return (
      <AnalyticsError message="No insights available" onRetry={fetchInsights} />
    );

  // Children performance chart
  const childrenChart = (data.childrenPerformance || data.children || []).map(
    (c) => ({
      label: c.name || c.childName,
      value: Math.round(c.averageScore ?? c.avgScore ?? c.overall ?? 0),
    }),
  );

  // Per-child subject breakdown (show first child's subjects as bar chart)
  const firstChild = (data.childrenPerformance || data.children || [])[0];
  const subjectChart = (firstChild?.subjects || []).map((s) => ({
    label: s.subject || s.name,
    value: Math.round(s.score ?? s.percentage ?? 0),
  }));

  // Alerts
  const alerts = [];
  if (data.concerns?.length) {
    data.concerns.forEach((c) => {
      alerts.push({
        type: c.type || "warning",
        title: c.title || "Concern",
        message: c.message || c.description || c,
      });
    });
  }
  if (data.attendanceAlerts?.length) {
    data.attendanceAlerts.forEach((a) => {
      alerts.push({
        type: "warning",
        title: `Attendance: ${a.childName || a.name || "Child"}`,
        message:
          a.message || `Attendance is ${a.percentage ?? a.rate ?? "low"}%`,
      });
    });
  }

  // Children table with risk info
  const childrenRows = (data.childrenPerformance || data.children || []).map(
    (c) => ({
      name: c.name || c.childName,
      class: c.class || c.className || "—",
      averageScore: c.averageScore ?? c.avgScore ?? c.overall ?? 0,
      attendance: c.attendance ?? "—",
      risk: c.risk || "low",
    }),
  );

  const childColumns = [
    { key: "name", title: "Child" },
    { key: "class", title: "Class" },
    {
      key: "averageScore",
      title: "Avg Score",
      render: (val) => (
        <span
          className={val < 50 ? "text-red-600 font-bold" : "text-slate-700"}>
          {Math.round(val)}%
        </span>
      ),
    },
    {
      key: "attendance",
      title: "Attendance",
      render: (val) => (typeof val === "number" ? `${val}%` : val),
    },
    {
      key: "risk",
      title: "Risk",
      render: (val) => <RiskTag level={val} />,
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <AnalyticsHeader
        title="AI Analytics"
        subtitle="Insights about your children's academic performance"
        loading={loading}
        onRefresh={fetchInsights}
      />

      <AISummaryPanel summary={data.summary || data.overallSummary} />

      <AlertCards alerts={alerts} />

      {/* KPI Stats */}
      {data.kpis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.kpis.map((kpi, i) => (
            <StatCard
              key={i}
              label={kpi.label}
              value={kpi.value}
              suffix={kpi.suffix}
              trend={kpi.trend}
              color={["blue", "green", "amber", "purple"][i % 4]}
            />
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {childrenChart.length > 1 && (
          <BarChartCard
            title="Children Performance Comparison"
            data={childrenChart}
            color="#8b5cf6"
          />
        )}
        {subjectChart.length > 0 && (
          <BarChartCard
            title={`${firstChild?.name || "Child"} — Subject Scores`}
            data={subjectChart}
            color="#06b6d4"
          />
        )}
      </div>

      {/* Children Overview Table */}
      {childrenRows.length > 0 && (
        <RiskTable
          title="Children Overview"
          data={childrenRows}
          columns={childColumns}
        />
      )}

      <RecommendationsList
        items={data.recommendations || data.parentTips || []}
        title="Recommendations for Parents"
      />
    </div>
  );
}
