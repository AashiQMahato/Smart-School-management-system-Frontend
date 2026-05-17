/**
 * EventCard Component
 * Displays event information in a card format
 */

import EventTypeBadge from "./EventTypeBadge";
import { getEventTypeConfig } from "../../services/calendar.service";

const EventCard = ({ event, onClick, compact = false, actions }) => {
  const config = getEventTypeConfig(event.eventType);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateRange = (start, end) => {
    const s = formatDate(start);
    const e = formatDate(end);
    return s === e ? s : `${s} — ${e}`;
  };

  if (compact) {
    return (
      <div
        onClick={() => onClick?.(event)}
        className="group flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer hover:bg-slate-50 transition-colors duration-150">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: config.color }}
        />
        <span className="text-xs text-slate-700 truncate group-hover:text-slate-900">
          {event.title}
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick?.(event)}
      className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md p-4 cursor-pointer transition-all duration-300 ease-out"
      style={{ borderLeft: `4px solid ${config.color}` }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <EventTypeBadge type={event.eventType} size="small" />
            {!event.isPublished && (
              <span className="text-xs px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded font-medium">
                Draft
              </span>
            )}
          </div>

          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors duration-200 truncate">
            {event.title}
          </h4>

          <p className="text-xs text-slate-500 mt-1">
            {formatDateRange(event.startDate, event.endDate)}
          </p>

          {event.description && (
            <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
              {event.description}
            </p>
          )}

          {event.classId && (
            <div className="mt-2">
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                {event.classId.name}{" "}
                {event.classId.section ? `- ${event.classId.section}` : ""}
              </span>
            </div>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
