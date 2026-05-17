import React from "react";

const SUBJECT_ACCENTS = [
  "bg-blue-50 border-blue-200 text-blue-900",
  "bg-emerald-50 border-emerald-200 text-emerald-900",
  "bg-violet-50 border-violet-200 text-violet-900",
  "bg-amber-50 border-amber-200 text-amber-900",
  "bg-rose-50 border-rose-200 text-rose-900",
  "bg-indigo-50 border-indigo-200 text-indigo-900",
  "bg-teal-50 border-teal-200 text-teal-900",
  "bg-slate-50 border-slate-200 text-slate-900",
];

const hashToAccent = (key) => {
  if (!key) return SUBJECT_ACCENTS[0];
  const hash = String(key)
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return SUBJECT_ACCENTS[hash % SUBJECT_ACCENTS.length];
};

const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return "";
  return `${startTime} - ${endTime}`;
};

const ScheduleCard = ({ item, onClick, showTeacher, showClass }) => {
  const accent = hashToAccent(item?.subjectId?._id);

  const subjectName = item?.subjectId?.name || "Untitled";
  const className = item?.classId?.name || "";
  const section = item?.section || item?.classId?.section || "";
  const teacherName = item?.teacherId?.name || "";
  const timeRange = formatTimeRange(item?.startTime, item?.endTime);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow ${accent}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{subjectName}</div>
          <div className="mt-1 text-xs opacity-80 flex flex-wrap gap-x-3 gap-y-1">
            {showClass && (className || section) && (
              <span className="inline-flex items-center gap-1">
                <span className="font-medium">{className}</span>
                {section ? <span>Section {section}</span> : null}
              </span>
            )}
            {showTeacher && teacherName ? (
              <span className="inline-flex items-center gap-1">
                <span className="font-medium">{teacherName}</span>
              </span>
            ) : null}
          </div>
        </div>

        {timeRange ? (
          <div className="shrink-0 text-xs font-semibold opacity-80">
            {timeRange}
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs opacity-80">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <span className="font-medium">Room</span> {item?.room || "-"}
          </span>
        </div>
        {item?.academicYear ? (
          <div className="shrink-0">{item.academicYear}</div>
        ) : null}
      </div>
    </button>
  );
};

export default ScheduleCard;
