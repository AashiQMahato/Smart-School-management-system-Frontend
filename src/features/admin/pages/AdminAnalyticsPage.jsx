/**
 * Admin AI Analytics Page
 * Shows school-wide AI-generated insights: class performance,
 * weak subjects, fee forecast, at-risk students, and recommendations.
 */

import { useState, useEffect, useCallback } from "react";
import { Tag } from "antd";
import { getAdminAnalytics } from "../../../services/analytics.service";
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

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminAnalytics();
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

  // Build chart-ready data
  const classChartData = (data.classPerformance || []).map((c) => ({
    label: c.className || c.class,
    value: Math.round(c.averageScore ?? c.avgScore ?? 0),
  }));

  const subjectChartData = (
    data.weakSubjects ||
    data.subjectAnalysis ||
    []
  ).map((s) => ({
    label: s.subject || s.name,
    value: Math.round(s.averageScore ?? s.avgScore ?? s.score ?? 0),
  }));

  // Alerts
  const alerts = [];
  if (data.dropoutRisks?.length) {
    alerts.push({
      type: "danger",
      title: "Dropout Risk Detected",
      message: `${data.dropoutRisks.length} student(s) are at risk of dropping out. Review immediately.`,
    });
  }
  if (data.feeDefaulters?.length || data.feeForecast?.defaulterCount) {
    alerts.push({
      type: "warning",
      title: "Fee Collection Alert",
      message:
        data.feeForecast?.summary ||
        `${data.feeDefaulters?.length ?? data.feeForecast?.defaulterCount} students have outstanding fees.`,
    });
  }
  if (data.attendanceConcerns?.length) {
    alerts.push({
      type: "warning",
      title: "Low Attendance",
      message: `${data.attendanceConcerns.length} student(s) with attendance below threshold.`,
    });
  }

  // At-risk students table
  const atRiskStudents = [
    ...(data.dropoutRisks || []),
    ...(data.atRiskStudents || []),
  ].slice(0, 10);

  const riskColumns = [
    { key: "name", title: "Student" },
    {
      key: "risk",
      title: "Risk Level",
      render: (val) => <RiskTag level={val || "medium"} />,
    },
    { key: "reason", title: "Reason" },
  ];

  return (
    <div className="space-y-6 pb-8">
      <AnalyticsHeader
        title="AI Analytics"
        subtitle="School-wide insights powered by AI"
        loading={loading}
        onRefresh={fetchInsights}
      />

      {/* AI Summary */}
      <AISummaryPanel summary={data.summary || data.overallSummary} />

      {/* Alerts */}
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
        <BarChartCard
          title="Class-wise Average Performance"
          data={classChartData}
          color="#6366f1"
        />
        <BarChartCard
          title="Subject-wise Performance"
          data={subjectChartData}
          color="#f59e0b"
        />
      </div>

      {/* At-risk Students */}
      {atRiskStudents.length > 0 && (
        <RiskTable
          title="At-Risk Students"
          data={atRiskStudents}
          columns={riskColumns}
        />
      )}

      {/* Recommendations */}
      <RecommendationsList items={data.recommendations || []} />
    </div>
  );
}
