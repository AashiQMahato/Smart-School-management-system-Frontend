import React from "react";
import { Calendar, BookOpen, Users, Award, FileText } from "lucide-react";
import StatusBadge from "../UI/StatusBadge";

const AssignmentCard = ({ assignment, onClick, viewMode = "teacher" }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const due = new Date(assignment.dueDate);
    const diff = due - now;

    if (diff < 0) return { text: "Overdue", color: "text-red-600" };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 7) {
      return { text: `${days} days left`, color: "text-gray-600" };
    } else if (days > 0) {
      return { text: `${days}d ${hours}h left`, color: "text-amber-600" };
    } else if (hours > 0) {
      return { text: `${hours} hours left`, color: "text-red-600" };
    }
    return { text: "Due soon", color: "text-red-600" };
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-400 transition-colors">
            {assignment.title}
          </h3>
          <div className="flex flex-wrap gap-2 items-center">
            <StatusBadge status={assignment.status} size="sm" />
            {viewMode === "student" && assignment.submissionStatus && (
              <StatusBadge status={assignment.submissionStatus} size="sm" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Award size={18} className="text-amber-500" />
          {assignment.totalMarks} pts
        </div>
      </div>

      {/* Description Preview */}
      <div
        className="text-sm text-gray-600 mb-4 line-clamp-2"
        dangerouslySetInnerHTML={{
          __html:
            assignment.description?.substring(0, 120) + "..." ||
            "No description",
        }}
      />

      {/* Meta Information */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen size={16} className="text-blue-500" />
          <span className="truncate">{assignment.subject?.name || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} className="text-green-500" />
          <span className="truncate">
            {assignment.class
              ? `${assignment.class.name} - ${assignment.class.section}`
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>Due: {formatDate(assignment.dueDate)}</span>
        </div>

        <div className={`text-sm font-semibold ${timeRemaining.color}`}>
          {timeRemaining.text}
        </div>
      </div>

      {/* Teacher View: Submission Stats */}
      {viewMode === "teacher" && assignment.submissionStats && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <FileText size={16} className="text-blue-500" />
              <span className="font-medium text-gray-700">
                {assignment.submissionStats.total}
              </span>
              <span className="text-gray-500">submissions</span>
            </div>
            {assignment.submissionStats.pending > 0 && (
              <div className="flex items-center gap-1 text-amber-600">
                <span className="font-medium">
                  {assignment.submissionStats.pending}
                </span>
                <span>to grade</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Student View: Grade */}
      {viewMode === "student" &&
        assignment.mySubmission &&
        assignment.mySubmission.status === "graded" && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              <span className="text-lg font-bold text-gray-900">
                {assignment.mySubmission.marksObtained} /{" "}
                {assignment.totalMarks}
              </span>
              <span className="text-sm text-gray-500">
                (
                {Math.round(
                  (assignment.mySubmission.marksObtained /
                    assignment.totalMarks) *
                    100,
                )}
                %)
              </span>
            </div>
          </div>
        )}

      {/* Attachments Indicator */}
      {assignment.attachments && assignment.attachments.length > 0 && (
        <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
          <FileText size={14} />
          <span>{assignment.attachments.length} attachment(s)</span>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;
