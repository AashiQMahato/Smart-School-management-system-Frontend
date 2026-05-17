import React from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  Award,
  Send,
} from "lucide-react";

const StatusBadge = ({ status, size = "md", showIcon = true }) => {
  const statusConfig = {
    // Assignment statuses
    draft: {
      label: "Draft",
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
      borderColor: "border-gray-300",
      icon: FileText,
    },
    published: {
      label: "Published",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-300",
      icon: Send,
    },
    expired: {
      label: "Expired",
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      borderColor: "border-red-300",
      icon: XCircle,
    },

    // Submission statuses
    submitted: {
      label: "Submitted",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      borderColor: "border-green-300",
      icon: CheckCircle,
    },
    graded: {
      label: "Graded",
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
      borderColor: "border-purple-300",
      icon: Award,
    },
    late: {
      label: "Late",
      bgColor: "bg-amber-100",
      textColor: "text-amber-700",
      borderColor: "border-amber-300",
      icon: AlertCircle,
    },
    pending: {
      label: "Pending",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-300",
      icon: Clock,
    },
    overdue: {
      label: "Overdue",
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      borderColor: "border-red-300",
      icon: AlertCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium border
        ${sizeClasses[size]}
        ${config.bgColor}
        ${config.textColor}
        ${config.borderColor}
        transition-all duration-200
      `}>
      {showIcon && <Icon size={iconSizes[size]} />}
      {config.label}
    </span>
  );
};

export default StatusBadge;
