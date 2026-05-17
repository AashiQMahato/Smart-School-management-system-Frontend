/**
 * Teacher AI Analytics Page
 * Shows per-class/subject insights: student performance distribution,
 * at-risk students, subject difficulty, and teaching recommendations.
 */

import { useState, useEffect, useCallback } from "react";
import { Tag } from "antd";
import { getTeacherAnalytics } from "../../../services/analytics.service";
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

export default function TeacherAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTeacherAnalytics();
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

  // Chart data
  const performanceChart = (
    data.classPerformance ||
    data.studentPerformance ||
    []
  ).map((c) => ({
    label: c.className || c.class || c.name,
    value: Math.round(c.averageScore ?? c.avgScore ?? 0),
  }));

  const subjectDifficultyChart = (data.subjectDifficulty || []).map((s) => ({
    label: s.subject || s.name,
    value: Math.round(s.failRate ?? s.difficulty ?? 0),
  }));

  // Alerts
  const alerts = [];
  if (data.weakStudents?.length) {
    alerts.push({
      type: "warning",
      title: "Students Need Attention",
      message: `${data.weakStudents.length} student(s) scoring below average — consider remedial support.`,
    });
  }
  if (data.attendanceConcerns?.length) {
    alerts.push({
      type: "warning",
      title: "Low Attendance Detected",
      message: `${data.attendanceConcerns.length} student(s) have low attendance in your classes.`,
    });
  }

  // At-risk students
  const weakStudents = (data.weakStudents || data.atRiskStudents || []).slice(
    0,
    15,
  );
  const riskColumns = [
    { key: "name", title: "Student" },
    {
      key: "class",
      title: "Class",
      render: (val) => val || "—",
    },
    {
      key: "averageScore",
      title: "Avg Score",
      render: (val, row) => {
        const score = val ?? row.avgScore ?? 0;
        return (
          <span
            className={
              score < 40 ? "text-red-600 font-bold" : "text-slate-700"
            }>
            {Math.round(score)}%
          </span>
        );
      },
    },
    {
      key: "risk",
      title: "Risk",
      render: (val) => <RiskTag level={val || "medium"} />,
    },
    {
      key: "suggestion",
      title: "AI Suggestion",
      render: (val) => (
        <span className="text-xs text-slate-600">{val || "—"}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <AnalyticsHeader
        title="AI Analytics"
        subtitle="Insights for your classes and students"
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
        <BarChartCard
          title="Class Performance Overview"
          data={performanceChart}
          color="#3b82f6"
        />
        {subjectDifficultyChart.length > 0 && (
          <BarChartCard
            title="Subject Difficulty (Fail Rate %)"
            data={subjectDifficultyChart}
            color="#ef4444"
          />
        )}
      </div>

      {/* Weak Students Table */}
      {weakStudents.length > 0 && (
        <RiskTable
          title="Students Needing Attention"
          data={weakStudents}
          columns={riskColumns}
        />
      )}

      <RecommendationsList
        items={data.recommendations || data.teachingTips || []}
        title="Teaching Recommendations"
      />
    </div>
  );
}
