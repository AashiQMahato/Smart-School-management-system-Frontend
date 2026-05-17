/**
 * CalendarListView Component
 * Chronological event list with filters
 */

import EventCard from "./EventCard";
import {
  EVENT_TYPES,
  getEventTypeConfig,
} from "../../services/calendar.service";

const CalendarListView = ({
  events = [],
  onEventClick,
  eventTypeFilter,
  onEventTypeFilterChange,
  actions,
  emptyMessage = "No events found",
}) => {
  // Group events by date
  const groupedEvents = {};
  const filtered = eventTypeFilter
    ? events.filter((e) => e.eventType === eventTypeFilter)
    : events;

  filtered.forEach((evt) => {
    const dateKey = new Date(evt.startDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    groupedEvents[dateKey].push(evt);
  });

  const dateGroups = Object.entries(groupedEvents);

  return (
    <div className="space-y-4">
      {/* Type Filter Chips */}
      {onEventTypeFilterChange && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onEventTypeFilterChange(null)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
              !eventTypeFilter
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}>
            All Events
          </button>
          {EVENT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => onEventTypeFilterChange(type.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 flex items-center gap-1 ${
                eventTypeFilter === type.value
                  ? "shadow-sm"
                  : "hover:opacity-80"
              }`}
              style={{
                backgroundColor:
                  eventTypeFilter === type.value
                    ? config(type).color
                    : config(type).bg,
                color:
                  eventTypeFilter === type.value ? "white" : config(type).color,
              }}>
              <span>{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
      )}

      {/* Event Groups */}
      {dateGroups.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-slate-400">
            {emptyMessage}
          </h3>
          <p className="text-sm text-slate-300 mt-1">
            Events will appear here when they are created.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {dateGroups.map(([date, evts]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-sm font-semibold text-slate-700">
                  {date}
                </div>
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400">
                  {evts.length} event{evts.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid gap-2">
                {evts.map((evt) => (
                  <EventCard
                    key={evt._id}
                    event={evt}
                    onClick={onEventClick}
                    actions={actions?.(evt)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper
const config = (type) => ({
  color: type.color,
  bg: type.bg,
});

export default CalendarListView;
