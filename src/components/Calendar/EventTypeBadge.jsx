/**
 * EventTypeBadge Component
 * Color-coded badge for event types
 */

import { getEventTypeConfig } from "../../services/calendar.service";

const EventTypeBadge = ({ type, size = "default" }) => {
  const config = getEventTypeConfig(type);

  const sizeClasses = {
    small: "text-xs px-1.5 py-0.5",
    default: "text-xs px-2.5 py-1",
    large: "text-sm px-3 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]}`}
      style={{ backgroundColor: config.bg, color: config.color }}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

export default EventTypeBadge;
