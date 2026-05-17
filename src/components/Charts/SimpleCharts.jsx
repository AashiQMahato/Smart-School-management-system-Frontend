/**
 * Simple CSS-based Chart Components
 * Reusable visualization components without external library dependencies
 */

import { Progress } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

// Simple Bar Chart Component
export const SimpleBarChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-3" style={{ minHeight: height }}>
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600 w-16 text-right">
            {item.label}
          </span>
          <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-end px-3 transition-all duration-500"
              style={{ width: `${(item.value / maxValue) * 100}%` }}>
              <span className="text-xs font-bold text-white">{item.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Trend Indicator Component
export const TrendIndicator = ({ value, label, positive = true }) => {
  const Icon = positive ? ArrowUpOutlined : ArrowDownOutlined;
  const color = positive ? "text-emerald-600" : "text-rose-600";
  const bg = positive ? "bg-emerald-50" : "bg-rose-50";

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${bg} ${color} text-xs font-semibold`}>
      <Icon className="text-xs" />
      {value}%
    </div>
  );
};

// Progress Ring Component
export const ProgressRing = ({
  percent,
  label,
  color = "#10b981",
  size = 120,
}) => {
  return (
    <div className="text-center">
      <Progress
        type="circle"
        percent={percent}
        strokeColor={{
          "0%": color,
          "100%": color,
        }}
        strokeWidth={10}
        width={size}
      />
      <p className="mt-3 text-sm text-slate-600 font-medium">{label}</p>
    </div>
  );
};

// Stat Card with Trend
export const StatCard = ({
  title,
  value,
  icon,
  gradient = "from-blue-500 to-blue-600",
  trend,
  subtitle,
  emoji,
}) => {
  return (
    <div
      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-linear-to-br ${gradient} text-white rounded-2xl overflow-hidden p-6 relative`}>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            {icon}
          </div>
          {trend && (
            <TrendIndicator value={trend.value} positive={trend.positive} />
          )}
        </div>
        <h3 className="text-4xl font-bold mb-1">{value}</h3>
        <p className="text-white/90 text-sm font-medium">{title}</p>
        {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
      </div>
      {emoji && (
        <div className="absolute -bottom-2 -right-2 text-8xl opacity-10">
          {emoji}
        </div>
      )}
    </div>
  );
};

// Timeline Component
export const ActivityTimeline = ({ activities }) => {
  const getIconColor = (type) => {
    const colors = {
      result: "bg-purple-100 text-purple-600",
      attendance: "bg-emerald-100 text-emerald-600",
      assignment: "bg-blue-100 text-blue-600",
      fee: "bg-amber-100 text-amber-600",
      default: "bg-slate-100 text-slate-600",
    };
    return colors[type] || colors.default;
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex gap-4">
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${getIconColor(activity.type)}`}>
              {activity.icon}
            </div>
            {index < activities.length - 1 && (
              <div className="absolute top-10 left-1/2 w-0.5 h-8 bg-slate-200 -translate-x-1/2" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <p className="font-semibold text-slate-800">{activity.title}</p>
            <p className="text-sm text-slate-500 mt-1">
              {activity.description}
            </p>
            <p className="text-xs text-slate-400 mt-2">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Subject Performance Card
export const SubjectCard = ({ subject, marks, maxMarks, grade, trend }) => {
  const percentage = ((marks / maxMarks) * 100).toFixed(0);
  const getGradeColor = (grade) => {
    const colors = {
      "A+": "from-emerald-500 to-emerald-600",
      A: "from-green-500 to-green-600",
      "B+": "from-blue-500 to-blue-600",
      B: "from-cyan-500 to-cyan-600",
      "C+": "from-yellow-500 to-yellow-600",
      C: "from-amber-500 to-amber-600",
      D: "from-orange-500 to-orange-600",
      F: "from-rose-500 to-rose-600",
    };
    return colors[grade] || colors.B;
  };

  return (
    <div className="group p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800 mb-1">{subject}</h4>
          <p className="text-sm text-slate-500">
            {marks}/{maxMarks} marks
          </p>
        </div>
        <div
          className={`w-14 h-14 rounded-xl bg-linear-to-br ${getGradeColor(grade)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
          {grade}
        </div>
      </div>
      <div className="space-y-2">
        <Progress
          percent={percentage}
          strokeColor={{
            "0%": "#6366f1",
            "100%": "#4f46e5",
          }}
          showInfo={false}
          strokeWidth={8}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">{percentage}%</span>
          {trend && (
            <TrendIndicator value={trend.value} positive={trend.positive} />
          )}
        </div>
      </div>
    </div>
  );
};

// Alert Card Component
export const AlertCard = ({ type = "info", title, message, action }) => {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    danger: "bg-rose-50 border-rose-200 text-rose-800",
  };

  return (
    <div
      className={`p-4 rounded-xl border-2 ${styles[type]} transition-all hover:shadow-md`}>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm opacity-90 mb-3">{message}</p>
      {action && (
        <button className="text-sm font-semibold underline hover:no-underline">
          {action}
        </button>
      )}
    </div>
  );
};
