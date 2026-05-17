/**
 * ScheduleDetailModal - Event Details Modal
 * Shows comprehensive event details with role-specific actions
 */

import React from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  GraduationCap,
  BookOpen,
  FileText,
  Users,
  Target,
  Building,
  Hash,
  Copy,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle,
  Bell,
  Share2,
} from "lucide-react";

// Event type configurations
const EVENT_CONFIG = {
  class: {
    icon: BookOpen,
    label: "Class Session",
    color: "indigo",
    bgGradient: "from-blue-500 to-indigo-600",
  },
  exam: {
    icon: FileText,
    label: "Examination",
    color: "red",
    bgGradient: "from-red-500 to-rose-600",
  },
  meeting: {
    icon: Users,
    label: "Meeting",
    color: "purple",
    bgGradient: "from-purple-500 to-violet-600",
  },
  activity: {
    icon: Target,
    label: "Activity",
    color: "emerald",
    bgGradient: "from-emerald-500 to-green-600",
  },
};

// Format time for display
const formatTime = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${minutes} ${ampm}`;
};

// Calculate duration
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return null;
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const durationMins = endH * 60 + endM - (startH * 60 + startM);

  if (durationMins < 60) {
    return `${durationMins} minutes`;
  }

  const hours = Math.floor(durationMins / 60);
  const mins = durationMins % 60;
  return mins > 0
    ? `${hours}h ${mins}m`
    : `${hours} hour${hours > 1 ? "s" : ""}`;
};

// Info Row Component
const InfoRow = ({ icon: Icon, label, value, className = "" }) => {
  if (!value) return null;

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
};

// Action Button Component
const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  disabled = false,
}) => {
  const variants = {
    default: "bg-slate-100 text-slate-600 hover:bg-slate-200",
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    success: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
        text-sm font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
      `}>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};

const ScheduleDetailModal = ({
  item,
  onClose,
  role = "student", // admin, teacher, student, parent
  onEdit,
  onDelete,
  onMarkAttendance,
}) => {
  if (!item) return null;

  const eventType = item?.eventType || "class";
  const config = EVENT_CONFIG[eventType] || EVENT_CONFIG.class;
  const IconComponent = config.icon;

  // Extract data
  const subjectName = item?.subjectId?.name || "Untitled";
  const subjectCode = item?.subjectId?.code || "";
  const className = item?.classId?.name || "";
  const section = item?.section || item?.classId?.section || "";
  const teacherName = item?.teacherId?.name || "";
  const teacherEmail = item?.teacherId?.email || "";
  const room = item?.room || "";
  const startTime = formatTime(item?.startTime);
  const endTime = formatTime(item?.endTime);
  const duration = calculateDuration(item?.startTime, item?.endTime);
  const academicYear = item?.academicYear || "";
  const dayOfWeek = item?.dayOfWeek || "";

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  // Role-based permissions
  const canEdit = role === "admin";
  const canDelete = role === "admin";
  const canMarkAttendance = role === "teacher";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl pointer-events-auto overflow-hidden transform transition-all"
          onClick={(e) => e.stopPropagation()}>
          {/* Header with gradient background */}
          <div
            className={`
              relative px-6 pt-6 pb-16 bg-linear-to-br ${config.bgGradient}
            `}>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors">
              <X className="w-5 h-5" />
            </button>

            {/* Event Type Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                {config.label}
              </span>
              {dayOfWeek && (
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                  {dayOfWeek}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-2">
              {subjectName}
            </h2>

            {/* Time */}
            <div className="flex items-center gap-2 text-white/90">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {startTime} - {endTime}
                {duration && (
                  <span className="text-white/70 ml-2">({duration})</span>
                )}
              </span>
            </div>
          </div>

          {/* Icon Badge (overlapping header and content) */}
          <div className="relative px-6 -mt-8">
            <div
              className={`
                w-16 h-16 rounded-2xl bg-white shadow-lg
                flex items-center justify-center
                border-4 border-white
              `}>
              <IconComponent className={`w-8 h-8 text-${config.color}-600`} />
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Location */}
              <InfoRow
                icon={MapPin}
                label="Location"
                value={room && `Room ${room}`}
              />

              {/* Class */}
              <InfoRow
                icon={GraduationCap}
                label="Class"
                value={
                  className &&
                  `${className}${section ? ` - Section ${section}` : ""}`
                }
              />

              {/* Teacher */}
              <InfoRow icon={User} label="Teacher" value={teacherName} />

              {/* Subject Code */}
              <InfoRow icon={Hash} label="Subject Code" value={subjectCode} />

              {/* Academic Year */}
              <InfoRow
                icon={Calendar}
                label="Academic Year"
                value={academicYear}
              />

              {/* Building (if available) */}
              {item?.building && (
                <InfoRow
                  icon={Building}
                  label="Building"
                  value={item.building}
                />
              )}
            </div>

            {/* Teacher Contact (for students/parents) */}
            {(role === "student" || role === "parent") && teacherEmail && (
              <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Teacher Contact
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{teacherEmail}</span>
                  <button
                    onClick={() => copyToClipboard(teacherEmail)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Description (if available) */}
            {item?.description && (
              <div className="mb-6">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Description
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {/* Admin Actions */}
              {canEdit && onEdit && (
                <ActionButton
                  icon={Edit}
                  label="Edit"
                  onClick={() => onEdit(item)}
                  variant="default"
                />
              )}
              {canDelete && onDelete && (
                <ActionButton
                  icon={Trash2}
                  label="Delete"
                  onClick={() => onDelete(item)}
                  variant="danger"
                />
              )}

              {/* Teacher Actions */}
              {canMarkAttendance && onMarkAttendance && (
                <ActionButton
                  icon={CheckCircle}
                  label="Mark Attendance"
                  onClick={() => onMarkAttendance(item)}
                  variant="success"
                />
              )}

              {/* Common Actions */}
              <ActionButton
                icon={Bell}
                label="Set Reminder"
                onClick={() => {
                  // Handle reminder
                  console.log("Setting reminder for:", item);
                }}
                variant="default"
              />

              <ActionButton
                icon={Share2}
                label="Share"
                onClick={() => {
                  // Handle share
                  const shareText = `${subjectName} - ${dayOfWeek} ${startTime}-${endTime} in Room ${room}`;
                  if (navigator.share) {
                    navigator.share({
                      title: subjectName,
                      text: shareText,
                    });
                  } else {
                    copyToClipboard(shareText);
                  }
                }}
                variant="default"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Schedule ID: {item?._id?.slice(-8) || "N/A"}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleDetailModal;
