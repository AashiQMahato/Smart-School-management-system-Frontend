/**
 * Student AI Analytics Page
 * Shows personalized academic insights: subject performance radar,
 * improvement potential, attendance impact, and study recommendations.
 */

import { useState, useEffect, useCallback } from "react";
import { getStudentAnalytics } from "../../../services/analytics.service";
import {
  AnalyticsLoading,
  AnalyticsError,
  AnalyticsHeader,
  AISummaryPanel,
  AlertCards,
  RecommendationsList,
  StatCard,
  RadarChartCard,
  BarChartCard,
  ImprovementScore,
} from "../../../components/Analytics/AnalyticsComponents";

export default function StudentAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStudentAnalytics();
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

  // Radar data for subject performance
  const radarData = (data.subjectPerformance || data.subjects || []).map(
    (s) => ({
      subject: s.subject || s.name,
      value: Math.round(s.score ?? s.percentage ?? s.average ?? 0),
    }),
  );

  // Bar chart for subject scores
  const barData = radarData.map((d) => ({
    label: d.subject,
    value: d.value,
  }));

  // Alerts
  const alerts = [];
  if (data.weakSubjects?.length) {
    alerts.push({
      type: "warning",
      title: "Subjects to Focus On",
      message: `You need improvement in: ${data.weakSubjects.map((s) => s.subject || s.name || s).join(", ")}`,
    });
  }
  if (data.attendanceAlert) {
    alerts.push({
      type: data.attendanceAlert.type || "info",
      title: "Attendance Status",
      message: data.attendanceAlert.message,
    });
  }

  const improvement = data.improvementPotential || {};

  return (
    <div className="space-y-6 pb-8">
      <AnalyticsHeader
        title="AI Analytics"
        subtitle="Your personalized academic insights"
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
        {radarData.length > 0 && (
          <RadarChartCard title="Subject Performance Radar" data={radarData} />
        )}
        {barData.length > 0 && (
          <BarChartCard title="Subject Scores" data={barData} color="#10b981" />
        )}
      </div>

      {/* Improvement Score */}
      {(improvement.current || improvement.potential) && (
        <ImprovementScore
          current={improvement.current}
          potential={improvement.potential}
          gap={improvement.gap}
        />
      )}

      <RecommendationsList
        items={data.recommendations || data.studyTips || []}
        title="Personalized Study Recommendations"
      />
    </div>
  );
}
