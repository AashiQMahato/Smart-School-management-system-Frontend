/**
 * FeeSummaryCard - Hero summary card for student/parent fee overview
 */

import { Progress } from "antd";

const CARD_STATS = [
  {
    key: "totalAmount",
    label: "Total Fees",
    color: "blue",
    bg: "bg-blue-50",
    text: "text-blue-700",
    iconBg: "bg-blue-600",
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    key: "totalPaid",
    label: "Amount Paid",
    color: "emerald",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    iconBg: "bg-emerald-600",
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    key: "totalBalance",
    label: "Balance Due",
    color: "red",
    bg: "bg-red-50",
    text: "text-red-700",
    iconBg: "bg-red-600",
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
];

export default function FeeSummaryCard({
  summary,
  studentName,
  className: cls,
  academicYear,
}) {
  if (!summary) return null;

  const paidPct =
    summary.totalAmount > 0
      ? Math.min(
          100,
          Math.round((summary.totalPaid / summary.totalAmount) * 100),
        )
      : 0;

  const isFullyPaid = summary.totalBalance <= 0;
  const hasOverdue = summary.overdueCount > 0;

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${cls || ""}`}>
      {/* Top gradient bar */}
      <div
        className={`h-1.5 w-full ${isFullyPaid ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : hasOverdue ? "bg-gradient-to-r from-red-400 to-amber-400" : "bg-gradient-to-r from-blue-400 to-indigo-600"}`}
      />

      <div className="p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-5">
          <div>
            {studentName && (
              <p className="text-xs font-medium text-slate-500 mb-0.5 uppercase tracking-wide">
                Student
              </p>
            )}
            {studentName && (
              <p className="text-lg font-bold text-slate-900 leading-tight">
                {studentName}
              </p>
            )}
            {academicYear && (
              <span className="inline-block mt-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                AY {academicYear}
              </span>
            )}
          </div>
          <div className="text-right">
            <Progress
              type="circle"
              percent={paidPct}
              size={70}
              strokeColor={
                isFullyPaid ? "#10b981" : hasOverdue ? "#ef4444" : "#3b82f6"
              }
              trailColor="#f1f5f9"
              format={(p) => (
                <div className="text-center">
                  <div
                    className={`text-base font-black ${isFullyPaid ? "text-emerald-600" : hasOverdue ? "text-red-600" : "text-blue-600"}`}>
                    {p}%
                  </div>
                  <div className="text-[9px] text-slate-500 leading-none">
                    paid
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {CARD_STATS.map(({ key, label, bg, text, iconBg, icon }) => (
            <div key={key} className={`${bg} rounded-xl p-3`}>
              <div
                className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center mb-2`}>
                {icon}
              </div>
              <p className={`text-base font-black ${text}`}>
                ₹{(summary[key] || 0).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Due warning */}
        {hasOverdue && (
          <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            <svg
              className="w-4 h-4 text-red-600 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-700 font-medium">
              {summary.overdueCount} fee
              {summary.overdueCount > 1 ? "s are" : " is"} overdue. Please pay
              immediately.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
