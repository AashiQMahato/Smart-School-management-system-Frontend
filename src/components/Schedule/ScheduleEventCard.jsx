/**
 * ScheduleEventCard - Modern Event Card Component
 * Beautiful card design with color-coded event types
 * Supports both compact and full view modes
 */

import React from "react";
import {
  BookOpen,
  FileText,
  Users,
  Target,
  Clock,
  MapPin,
  User,
  GraduationCap,
  MoreHorizontal,
} from "lucide-react";

// Event type configurations with colors and icons
const EVENT_CONFIG = {
  class: {
    icon: BookOpen,
    label: "Class",
    bgColor: "bg-blue-50",
    borderColor: "border-l-blue-400",
    textColor: "text-blue-700",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-400",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
  },
  exam: {
    icon: FileText,
    label: "Exam",
    bgColor: "bg-red-50",
    borderColor: "border-l-red-400",
    textColor: "text-red-700",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
  },
  meeting: {
    icon: Users,
    label: "Meeting",
    bgColor: "bg-purple-50",
    borderColor: "border-l-purple-400",
    textColor: "text-purple-700",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
  },
  activity: {
    icon: Target,
    label: "Activity",
    bgColor: "bg-emerald-50",
    borderColor: "border-l-emerald-400",
    textColor: "text-emerald-700",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
  },
};

// Subject-based accent colors for when event type is not specified
const SUBJECT_ACCENTS = [
  {
    bgColor: "bg-indigo-50",
    borderColor: "border-l-indigo-400",
    textColor: "text-indigo-700",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    bgColor: "bg-cyan-50",
    borderColor: "border-l-cyan-400",
    textColor: "text-cyan-700",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    bgColor: "bg-violet-50",
    borderColor: "border-l-violet-400",
    textColor: "text-violet-700",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    bgColor: "bg-amber-50",
    borderColor: "border-l-amber-400",
    textColor: "text-amber-700",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    bgColor: "bg-rose-50",
    borderColor: "border-l-rose-400",
    textColor: "text-rose-700",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    bgColor: "bg-teal-50",
    borderColor: "border-l-teal-400",
    textColor: "text-teal-700",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    bgColor: "bg-sky-50",
    borderColor: "border-l-sky-400",
    textColor: "text-sky-700",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  {
    bgColor: "bg-lime-50",
    borderColor: "border-l-lime-400",
    textColor: "text-lime-700",
    iconBg: "bg-lime-100",
    iconColor: "text-lime-600",
  },
];

// Hash function to get consistent accent based on subject
const getSubjectAccent = (subjectId) => {
  if (!subjectId) return SUBJECT_ACCENTS[0];
  const hash = String(subjectId)
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return SUBJECT_ACCENTS[hash % SUBJECT_ACCENTS.length];
};

// Format time range with duration
const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return null;

  // Calculate duration in minutes
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const durationMins = endH * 60 + endM - (startH * 60 + startM);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  return {
    range: `${formatTime(startTime)} - ${formatTime(endTime)}`,
    duration: durationMins > 0 ? `${durationMins} min` : null,
  };
};

const ScheduleEventCard = ({
  item,
  onClick,
  showTeacher = true,
  showClass = false,
  compact = false,
  showActions = false,
}) => {
  // Determine event type config or use subject-based accent
  const eventType = item?.eventType || "class";
  const config = EVENT_CONFIG[eventType] || EVENT_CONFIG.class;
  const subjectAccent = getSubjectAccent(item?.subjectId?._id);

  // Use event config if event type is specified, otherwise use subject accent
  const hasExplicitEventType = item?.eventType && EVENT_CONFIG[item.eventType];
  const colors = hasExplicitEventType
    ? config
    : { ...config, ...subjectAccent };

  const IconComponent = config.icon;

  // Extract data
  const subjectName = item?.subjectId?.name || "Untitled";
  const className = item?.classId?.name || "";
  const section = item?.section || item?.classId?.section || "";
  const teacherName = item?.teacherId?.name || "";
  const room = item?.room || "";
  const timeInfo = formatTimeRange(item?.startTime, item?.endTime);

  // Compact card for week view
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`
          w-full text-left rounded-xl border-l-4 p-3 
          transition-all duration-200 group
          hover:shadow-md hover:scale-[1.02]
          ${colors.bgColor} ${colors.borderColor}
        `}>
        {/* Title Row */}
        <div className="flex items-start justify-between gap-2">
          <h4 className={`font-semibold text-sm truncate ${colors.textColor}`}>
            {subjectName}
          </h4>
          <div className={`p-1 rounded-md ${colors.iconBg}`}>
            <IconComponent className={`w-3 h-3 ${colors.iconColor}`} />
          </div>
        </div>

        {/* Time */}
        {timeInfo && (
          <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-600">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>
              {item.startTime} - {item.endTime}
            </span>
          </div>
        )}

        {/* Room */}
        {room && (
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>Room {room}</span>
          </div>
        )}
      </button>
    );
  }

  // Full card for day view / timeline
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left rounded-xl border-l-4 p-4 
        transition-all duration-200 group
        hover:shadow-lg hover:scale-[1.01]
        ${colors.bgColor} ${colors.borderColor}
      `}>
      <div className="flex items-start justify-between gap-4">
        {/* Left Section */}
        <div className="flex-1 min-w-0">
          {/* Event Type Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`
                inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
                ${colors.badgeBg || colors.iconBg} ${colors.badgeText || colors.textColor}
              `}>
              <IconComponent className="w-3 h-3" />
              {config.label}
            </span>
            {timeInfo?.duration && (
              <span className="text-xs text-slate-500 bg-white/50 px-2 py-0.5 rounded-full">
                {timeInfo.duration}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`font-bold text-base mb-2 ${colors.textColor}`}>
            {subjectName}
          </h3>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
            {/* Time */}
            {timeInfo && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="font-medium">{timeInfo.range}</span>
              </div>
            )}

            {/* Room */}
            {room && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Room {room}</span>
              </div>
            )}

            {/* Teacher */}
            {showTeacher && teacherName && (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>{teacherName}</span>
              </div>
            )}

            {/* Class */}
            {showClass && (className || section) && (
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>
                  {className}
                  {section && ` - Section ${section}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Icon & Actions */}
        <div className="flex flex-col items-end gap-2">
          <div
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              transition-transform group-hover:scale-110
              ${colors.iconBg}
            `}>
            <IconComponent className={`w-5 h-5 ${colors.iconColor}`} />
          </div>

          {showActions && (
            <button
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                // Handle more actions
              }}>
              <MoreHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Academic Year (if available) */}
      {item?.academicYear && (
        <div className="mt-3 pt-3 border-t border-slate-200/50">
          <span className="text-xs text-slate-500">
            Academic Year: {item.academicYear}
          </span>
        </div>
      )}
    </button>
  );
};

export default ScheduleEventCard;
